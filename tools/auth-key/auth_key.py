#!/usr/bin/env python3
# KlikBand Auth Key: lists the bands and watches bound to your Xiaomi account in
# Mi Fitness, with their auth keys, for connecting them in AstroBox or
# Gadgetbridge by hand.
#
# Logs in to your Xiaomi account the way the Mi Fitness app does (email or
# phone and password, typed here and sent only to account.xiaomi.com, never
# saved; a code from email or SMS when Xiaomi asks for one), then asks every
# Mi Fitness data center for the account's devices, since a device lives in
# the one it was bound in (a band bound in Indonesia is on sg.hlth.io.mi.com).
# Read-only: nothing on the account or the band is changed.
#
# Unofficial: not made, endorsed or supported by Xiaomi or AstroBox.
#
# usage: python3 auth_key.py
import base64, getpass, hashlib, http.cookiejar, json, os, random, string, sys, time
import urllib.error, urllib.parse, urllib.request

# Per-user app data: %APPDATA% on Windows, ~/Library/Application Support on macOS
APP_DATA = (os.environ.get('APPDATA') if os.name == 'nt' else
            os.path.expanduser('~/Library/Application Support') if sys.platform == 'darwin' else
            os.environ.get('XDG_DATA_HOME') or os.path.expanduser('~/.local/share'))
HOSTS = [('cn', 'hlth.io.mi.com'), ('sg', 'sg.hlth.io.mi.com'), ('de', 'de.hlth.io.mi.com'),
         ('ru', 'ru.hlth.io.mi.com'), ('us', 'us.hlth.io.mi.com'), ('i2', 'i2.hlth.io.mi.com')]
PATH = '/app/v1/source/get_source_list'
SID = 'miothealth'
SDK_VERSION = 'accountsdk-18.8.15'
UA = 'Mozilla/5.0 (Linux; Android 14) MiFitness'
# Xiaomi trusts a device id once it passed a verification code, so it is kept
# (it is not a secret) to avoid asking for a code on every run
DEVICE_ID_FILE = os.path.join(APP_DATA, 'KlikBand', 'mi-device-id')


class LoginError(Exception):
    pass


# What the login went through, names only, shown when the servers refuse
DIAGNOSIS = ''


def device_id():
    try:
        return open(DEVICE_ID_FILE).read().strip()
    except OSError:
        value = ''.join(random.choice(string.ascii_lowercase) for _ in range(6))
        os.makedirs(os.path.dirname(DEVICE_ID_FILE), exist_ok=True)
        with open(DEVICE_ID_FILE, 'w') as f:
            f.write(value)
        return value


def xiaomi_json(text):
    return json.loads(text.removeprefix('&&&START&&&'))


class Recorder(urllib.request.HTTPRedirectHandler):
    """Keeps the headers of every redirect: Xiaomi puts the session key
    (Extension-Pragma) on a redirect, not on the page it leads to."""
    def __init__(self):
        self.hops = []
        self.stop_host = None
        self.stopped = None

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        self.hops.append((req.full_url, headers))
        if self.stop_host and urllib.parse.urlparse(newurl).hostname == self.stop_host:
            self.stopped = newurl
            return None
        return super().redirect_request(req, fp, code, msg, headers, newurl)


class Session:
    """Cookies and redirects for account.xiaomi.com, like a browser."""
    def __init__(self, did):
        self.jar = http.cookiejar.CookieJar()
        self.recorder = Recorder()
        self.opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.jar), self.recorder)
        for domain in ('.xiaomi.com', '.mi.com', 'account.xiaomi.com'):
            for name, value in (('sdkVersion', SDK_VERSION), ('deviceId', did)):
                self.jar.set_cookie(http.cookiejar.Cookie(0, name, value, None, False, domain, True, domain.startswith('.'),
                                                          '/', True, False, None, False, None, None, {}))

    def get(self, url, stop_at=None):
        """GET following redirects; with `stop_at`, stops before that host and
        returns the address it was sent to."""
        self.recorder.stop_host, self.recorder.stopped = stop_at, None
        try:
            with self.opener.open(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=20) as r:
                self.headers = r.headers
                return r.read().decode('utf-8', 'replace'), r.geturl()
        except urllib.error.HTTPError as error:
            if self.recorder.stopped:
                self.headers = error.headers
                return '', self.recorder.stopped
            raise
        finally:
            self.recorder.stop_host = None

    def post(self, url, form):
        data = urllib.parse.urlencode(form).encode()
        with self.opener.open(urllib.request.Request(url, data=data, headers={
                'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded'}), timeout=20) as r:
            self.headers = r.headers
            return r.read().decode('utf-8', 'replace')

    def pragma(self):
        """ssecurity, nonce and psecurity from any Extension-Pragma seen so far."""
        found = {}
        for _, headers in self.recorder.hops + [(None, self.headers)]:
            try:
                found.update({k: v for k, v in json.loads(headers.get('Extension-Pragma') or '{}').items() if v})
            except ValueError:
                pass
        return found

    def route(self):
        """Where the redirects went, with header names only (no values)."""
        return ' > '.join('%s%s[%s]' % (urllib.parse.urlparse(url).hostname, urllib.parse.urlparse(url).path,
                                        ','.join(sorted(set(h.keys()) - {'Set-Cookie', 'Date', 'Content-Type', 'Content-Length', 'Connection'})))
                          for url, h in self.recorder.hops)

    def auth_reply(self, text):
        """A login answer, with ssecurity and nonce taken from the
        Extension-Pragma header when the body leaves them out."""
        auth = xiaomi_json(text)
        try:
            pragma = json.loads(self.headers.get('Extension-Pragma') or '{}')
        except ValueError:
            pragma = {}
        for key in ('ssecurity', 'nonce', 'psecurity'):
            if not auth.get(key) and pragma.get(key):
                auth[key] = pragma[key]
        return auth

    def cookie(self, name, domain=''):
        """A cookie by name, from a domain containing `domain` when given."""
        return next((c.value for c in self.jar if c.name == name and domain in c.domain), '')

    def token_cookies(self):
        """Where token cookies were set, names and domains only."""
        return ', '.join(sorted('%s@%s' % (c.name, c.domain) for c in self.jar
                                if 'oken' in c.name or c.name in ('userId', 'cUserId')))


def masked_target(kind, *replies):
    """Where Xiaomi says it sent the code (a masked email or phone number),
    from any field naming the `kind` ('email' or 'phone'), if it says."""
    for reply in replies:
        for key, value in reply.items():
            if isinstance(value, str) and value and kind in key.lower():
                return value
    return ''


def verify_with_code(session, notification_url, by_phone=False):
    """Xiaomi's verification code step: a code sent by email or SMS, with
    resending or switching to the other one when the code does not arrive."""
    context = urllib.parse.parse_qs(urllib.parse.urlparse(notification_url).query).get('context', [''])[0]
    session.get(notification_url)
    if not context:
        raise LoginError('Xiaomi meminta verifikasi, tapi alamatnya tidak dikenali:\n' + notification_url)
    query = urllib.parse.urlencode({'sid': SID, 'context': context, '_locale': 'en_US'})
    identity = xiaomi_json(session.get('https://account.xiaomi.com/identity/list?' + query)[0])
    # 8 = email, 4 = phone (SMS)
    options = [flag for flag in (identity.get('options') or []) if flag in (8, 4)]
    if not options:
        raise LoginError('Xiaomi meminta verifikasi yang belum didukung alat ini. Buka alamat ini di browser:\n' + notification_url)
    if len(options) == 1:
        flag = options[0]
    else:
        # A phone number login most likely has the phone at hand
        default = '2' if by_phone else '1'
        answer = input('Kirim kode ke (1) email atau (2) SMS? [%s] ' % default).strip() or default
        flag = 4 if answer == '2' else 8

    retry = 0
    while True:
        kind, name = ('Email', 'email') if flag == 8 else ('Phone', 'SMS')
        stamp = urllib.parse.urlencode({'_dc': int(time.time() * 1000), 'sid': SID, 'context': context, 'mask': 0, '_locale': 'en_US'})
        sent = xiaomi_json(session.post('https://account.xiaomi.com/identity/auth/send%sTicket?%s' % (kind, stamp),
                                        {'retry': retry, 'icode': '', '_json': 'true', 'ick': session.cookie('ick')}))
        if sent.get('code') != 0:
            raise LoginError('Gagal mengirim kode lewat %s: %s' % (name, sent.get('tips') or sent.get('desc') or sent))
        target = masked_target(kind.lower(), sent, identity)
        print('Kode dikirim lewat %s%s. Bisa butuh 1-2 menit.' % (name, ' ke ' + target if target else ''))
        if flag == 8:
            print('Tidak ada di kotak masuk? Cek folder Spam/Promosi, atau email yang terdaftar di akun Xiaomi.')

        while True:
            code = input('Kode verifikasi dari %s (kosongkan lalu Enter kalau kode tidak datang): ' % name).strip()
            if not code:
                break
            stamp = urllib.parse.urlencode({'_flag': flag, '_json': 'true', 'sid': SID, 'context': context, 'mask': 0, '_locale': 'en_US'})
            verified = xiaomi_json(session.post('https://account.xiaomi.com/identity/auth/verify%s?%s' % (kind, stamp),
                                                {'_flag': flag, 'ticket': code, 'trust': 'true', '_json': 'true', 'ick': session.cookie('ick')}))
            if verified.get('code') == 0 and verified.get('location'):
                return verified['location']
            print('Kode ditolak: %s. Coba lagi.' % (verified.get('tips') or verified.get('desc') or verified.get('code')))

        other = 4 if flag == 8 else 8
        choices = '(1) kirim ulang lewat %s' % name
        if other in options:
            choices += ', (2) kirim lewat %s' % ('SMS' if other == 4 else 'email')
        answer = input('Kode tidak datang? %s, (0) batal: ' % choices).strip()
        if answer == '2' and other in options:
            flag, retry = other, 0
        elif answer == '1':
            retry = 1
        else:
            raise LoginError('Verifikasi dibatalkan.')


def login():
    """Email or phone and password to a Mi Fitness (miothealth) token."""
    user = input('Email atau nomor HP akun Xiaomi: ').strip()
    password = getpass.getpass('Password (tidak ditampilkan): ')
    did = device_id()
    session = Session(did)
    login_url = 'https://account.xiaomi.com/pass/serviceLogin?sid=%s&_json=true' % SID

    def with_password(sign):
        return session.auth_reply(session.post('https://account.xiaomi.com/pass/serviceLoginAuth2', {
            'sid': SID, 'hash': hashlib.md5(password.encode()).hexdigest().upper(),
            'callback': 'https://sts-hlth.io.mi.com/healthapp/sts', 'qs': '%3Fsid%3Dmiothealth%26_json%3Dtrue',
            'user': user, '_sign': sign, '_json': 'true'}))

    auth = with_password(xiaomi_json(session.get(login_url)[0]).get('_sign', ''))
    if auth.get('code') == 70016:
        raise LoginError('Email/nomor HP atau password salah.')
    if auth.get('captchaUrl'):
        raise LoginError('Xiaomi meminta captcha. Login sekali di https://account.xiaomi.com lewat browser, lalu coba lagi.')
    if auth.get('notificationUrl'):
        print('Xiaomi meminta verifikasi untuk perangkat baru.')
        by_phone = not any(c.isalpha() or c == '@' for c in user)
        return verified_login(session, auth, verify_with_code(session, auth['notificationUrl'], by_phone), login_url, did)
    if auth.get('code') != 0 or not auth.get('location') or not auth.get('ssecurity'):
        raise LoginError('Login gagal: %s\n(kolom: %s)' % (
            auth.get('description') or auth.get('desc') or auth.get('code'),
            ', '.join(sorted(k for k, v in auth.items() if v not in ('', None, 0)))))
    session.get(auth['location'])
    service_token = (session.cookie('serviceToken', 'sts-hlth.io.mi.com') or
                     session.cookie(SID + '_serviceToken', 'sts-hlth.io.mi.com'))
    if not service_token:
        raise LoginError('Login berhasil, tapi token Mi Fitness tidak diterima.\n(%s)' % session.token_cookies())
    return {'user_id': str(auth.get('userId') or session.cookie('userId')), 'device_id': did,
            'ssecurity': auth['ssecurity'], 'service_token': service_token,
            'c_user_id': auth.get('cUserId') or session.cookie('cUserId')}


def verified_login(session, first, location, login_url, did):
    """Finishes a login that needed a verification code: the session key
    (ssecurity) and nonce come with the first answer, and the STS address the
    verified login leads to is opened signed with them (clientSign), which
    gives a Mi Fitness token that matches that key."""
    hops = len(session.recorder.hops)
    _, sts_url = session.get(location, stop_at='sts-hlth.io.mi.com')
    source = 'redirect'
    if urllib.parse.urlparse(sts_url).hostname != 'sts-hlth.io.mi.com':
        # The code page did not lead there: the login by cookie does
        again = session.auth_reply(session.get(login_url, stop_at='sts-hlth.io.mi.com')[0])
        sts_url, source = again.get('location') or session.recorder.stopped or '', 'serviceLogin'
    ssecurity = first.get('ssecurity') or session.pragma().get('ssecurity')
    nonce = (urllib.parse.parse_qs(urllib.parse.urlparse(sts_url).query).get('nonce') or [first.get('nonce')])[0]
    global DIAGNOSIS
    DIAGNOSIS = 'kunci pertama: %s; nonce: %s; sts dari: %s; rute: %s' % (
        'ada' if first.get('ssecurity') else 'tidak', 'ada' if nonce else 'tidak', source,
        ' > '.join(session.route().split(' > ')[hops:]) or '-')
    if not ssecurity or not nonce or not sts_url:
        raise LoginError('Kode diterima, tapi Xiaomi tidak memberi %s.\n(%s)' % (
            'kunci sesi' if not ssecurity else 'nonce' if not nonce else 'alamat token', DIAGNOSIS))
    client_sign = base64.b64encode(hashlib.sha1(('nonce=%s&%s' % (nonce, ssecurity)).encode()).digest()).decode()
    sign = urllib.parse.urlencode({'clientSign': client_sign, '_userIdNeedEncrypt': 'true'})
    session.get(sts_url + ('&' if '?' in sts_url else '?') + sign)
    service_token = (session.cookie('serviceToken', 'sts-hlth.io.mi.com') or
                     session.cookie(SID + '_serviceToken', 'sts-hlth.io.mi.com') or
                     session.headers.get('serviceToken', ''))
    if not service_token:
        raise LoginError('Kode diterima, tapi token Mi Fitness tidak diterima.\n(%s; cookie: %s)' % (
            DIAGNOSIS, session.token_cookies()))
    return {'user_id': str(session.cookie('userId', 'sts-hlth') or first.get('userId') or session.cookie('userId')),
            'device_id': did, 'ssecurity': ssecurity, 'service_token': service_token,
            'c_user_id': session.cookie('cUserId', 'sts-hlth') or first.get('cUserId') or session.cookie('cUserId')}


class Rc4:
    """RC4 with the first 1024 bytes dropped, one keystream for several fields."""
    def __init__(self, key):
        self.s = list(range(256))
        j = 0
        for i in range(256):
            j = (j + self.s[i] + key[i % len(key)]) % 256
            self.s[i], self.s[j] = self.s[j], self.s[i]
        self.i = self.j = 0
        self.apply(bytes(1024))

    def apply(self, data):
        s, out = self.s, bytearray()
        for b in data:
            self.i = (self.i + 1) % 256
            self.j = (self.j + s[self.i]) % 256
            s[self.i], s[self.j] = s[self.j], s[self.i]
            out.append(b ^ s[(s[self.i] + s[self.j]) % 256])
        return bytes(out)


def signature(nonce, params):
    raw = '&'.join(['POST', PATH] + ['%s=%s' % (k, params[k]) for k in sorted(params)] + [nonce])
    return base64.b64encode(hashlib.sha1(raw.encode()).digest()).decode()


def bound_devices(token, region, host):
    nonce = base64.b64encode(os.urandom(8) + int(time.time() // 60).to_bytes(4, 'big')).decode()
    signed_nonce = base64.b64encode(hashlib.sha256(
        base64.b64decode(token['ssecurity']) + base64.b64decode(nonce)).digest()).decode()
    params = {'data': json.dumps({'page_size': 50, 'status': 1}, separators=(',', ':'))}
    params['rc4_hash__'] = signature(signed_nonce, params)
    cipher = Rc4(base64.b64decode(signed_nonce))
    form = {k: base64.b64encode(cipher.apply(params[k].encode())).decode() for k in sorted(params)}
    form['signature'] = signature(signed_nonce, form)
    form['_nonce'] = nonce
    cookie = '; '.join(['sdkVersion=accountsdk-18.8.15', 'locale=en_us', 'deviceId=' + token['device_id'],
                        'userId=' + token['user_id'], 'cUserId=' + token.get('c_user_id', ''),
                        'serviceToken=' + token['service_token']])
    request = urllib.request.Request('https://' + host + PATH, data=urllib.parse.urlencode(form).encode(), headers={
        'User-Agent': 'Mozilla/5.0 (Linux; Android 14) MiFitness', 'region_tag': region,
        'HandleParams': 'true', 'Cookie': cookie, 'Content-Type': 'application/x-www-form-urlencoded'})
    body = urllib.request.urlopen(request, timeout=20).read().decode()
    reply = json.loads(Rc4(base64.b64decode(signed_nonce)).apply(base64.b64decode(body.strip('"'))).decode('utf-8', 'replace'))
    if reply.get('code') != 0:
        raise RuntimeError('code %s: %s' % (reply.get('code'), reply.get('message')))
    return (reply.get('result') or {}).get('list') or []


def find_devices(token):
    """Devices on every host, by identifier, and how many hosts failed."""
    found, failed = {}, 0
    for region, host in HOSTS:
        try:
            for device in bound_devices(token, region, host):
                found.setdefault(device.get('identifier') or device.get('sid'), (region, device))
        except (urllib.error.URLError, RuntimeError, ValueError) as error:
            failed += 1
            print('  (%s: %s)' % (host, str(error)[:80]))
    if failed == len(HOSTS) and DIAGNOSIS:
        print('  (%s)' % DIAGNOSIS)
    return found, failed


def get_keys():
    try:
        token = login()
    except LoginError as error:
        print('\n%s' % error)
        return 1
    except (urllib.error.URLError, ValueError) as error:
        print('\nLogin gagal: %s' % error)
        return 1

    found, failed = find_devices(token)
    if failed == len(HOSTS):
        print('\nSemua server menolak permintaan ini. Coba lagi.')
        return 1
    if not found:
        print('\nTidak ada perangkat di akun ini. Pastikan band sudah dipasangkan di Mi Fitness dengan akun yang sama.')
        return 1

    print('\nPerangkat di akun Xiaomi kamu:\n')
    for region, device in found.values():
        detail = device.get('detail') or {}
        print('  %s (%s)' % (device.get('name', '').strip() or '?', device.get('model', '')))
        print('    MAC      : %s' % (detail.get('mac') or '-'))
        print('    Auth key : %s' % (detail.get('encrypt_key') or '-'))
        print('    Server   : %s\n' % region)
    print('Di AstroBox: tambah perangkat › isi auth key, lalu sambungkan.')
    print('Di Gadgetbridge: tempel auth key saat menambahkan band.')
    print('Key berubah setiap kali band dipasangkan ulang di Mi Fitness.')
    print('Auth key seperti password band: jangan dibagikan ke orang lain.')
    return 0


def main():
    while True:
        print('KlikBand Auth Key\n')
        print('  1. Ambil auth key band (login akun Xiaomi)')
        print('  0. Keluar\n')
        try:
            choice = input('Pilih [1/0]: ').strip()
        except (EOFError, KeyboardInterrupt):
            return 0
        print()
        if choice == '0':
            return 0
        if choice == '1':
            try:
                get_keys()
            except KeyboardInterrupt:
                print('\nDibatalkan.')
            print('\n' + '-' * 60 + '\n')


if __name__ == '__main__':
    sys.exit(main())
