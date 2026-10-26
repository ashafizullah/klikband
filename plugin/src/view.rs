// The plugin page: what is on the band, a place search, and sending the
// picked place with its calculation method.
use astrobox_ng_wit::astrobox::psys_host::ui_v3::{self as ui, ElementType, Event, FlexDirection};
use serde_json::Value;
use std::sync::{Mutex, MutexGuard, OnceLock};

use crate::band;
use crate::places::{self, MAX_LATITUDE, Place};

pub const METHODS: [&str; 7] = ["kemenag", "mwl", "isna", "egypt", "ummalqura", "karachi", "dubai"];

#[derive(Default)]
struct State {
    root: Option<String>,
    lang: String,
    query: String,
    results: Vec<Place>,
    picked: Option<(Place, f64)>,
    method: String,
    band: String,
    // KlikBand's version and band clock from its last state reply
    band_version: String,
    band_clock: String,
    note: String,
}

static STATE: OnceLock<Mutex<State>> = OnceLock::new();

fn state() -> MutexGuard<'static, State> {
    STATE
        .get_or_init(|| Mutex::new(State { lang: "en".into(), method: "mwl".into(), ..Default::default() }))
        .lock()
        .unwrap_or_else(|p| p.into_inner())
}

pub fn set_language(code: &str) {
    let lang = if code.starts_with("zh") {
        "zh"
    } else if code.starts_with("id") {
        "id"
    } else {
        "en"
    };
    state().lang = lang.into();
}

fn tr(lang: &str, key: &str) -> &'static str {
    match (lang, key) {
        ("id", "subtitle") => "Kirim lokasi mana pun di dunia ke KlikBand di band, untuk waktu sholat dan arah kiblat.",
        ("zh", "subtitle") => "把全球任意地点发送到手环上的 KlikBand，用于礼拜时间和朝向。",
        (_, "subtitle") => "Send any place in the world to KlikBand on your band, for its prayer times and Qibla.",
        ("id", "onBand") => "Di band",
        ("zh", "onBand") => "手环上",
        (_, "onBand") => "On the band",
        ("id", "unknown") => "Belum diketahui. Buka KlikBand di band, lalu tekan Periksa.",
        ("zh", "unknown") => "未知。请在手环上打开 KlikBand，然后点击“检查”。",
        (_, "unknown") => "Not known yet. Open KlikBand on the band, then press Check.",
        ("id", "clock") => "jam band",
        ("zh", "clock") => "手环时钟",
        (_, "clock") => "band clock",
        ("id", "check") => "Periksa",
        ("zh", "check") => "检查",
        (_, "check") => "Check",
        ("id", "placeholder") => "Nama kota, mis. London",
        ("zh", "placeholder") => "城市名称，例如 London",
        (_, "placeholder") => "City name, e.g. London",
        ("id", "search") => "Cari",
        ("zh", "search") => "搜索",
        (_, "search") => "Search",
        ("id", "none") => "Tidak ditemukan.",
        ("zh", "none") => "未找到。",
        (_, "none") => "Nothing found.",
        ("id", "method") => "Metode perhitungan",
        ("zh", "method") => "计算方法",
        (_, "method") => "Calculation method",
        ("id", "send") => "Kirim ke band",
        ("zh", "send") => "发送到手环",
        (_, "send") => "Send to band",
        ("id", "notInstalled") => "KlikBand belum terpasang di band.",
        ("zh", "notInstalled") => "手环上尚未安装 KlikBand。",
        (_, "notInstalled") => "KlikBand is not installed on the band.",
        ("id", "tooOld") => "Perbarui KlikBand di band ke versi 1.25.0 atau lebih baru.",
        ("zh", "tooOld") => "请将手环上的 KlikBand 更新到 1.25.0 或更高版本。",
        (_, "tooOld") => "Update KlikBand on the band to 1.25.0 or later.",
        ("id", "sendFailed") => "Gagal mengirim ke band.",
        ("zh", "sendFailed") => "发送到手环失败。",
        (_, "sendFailed") => "Could not send to the band.",
        ("id", "noBand") => "Tidak ada band yang tersambung ke AstroBox.",
        ("zh", "noBand") => "没有手环连接到 AstroBox。",
        (_, "noBand") => "No band is connected to AstroBox.",
        ("id", "waiting") => "Terkirim. Menunggu balasan KlikBand… (KlikBand harus terbuka di band)",
        ("zh", "waiting") => "已发送，等待 KlikBand 回复…（KlikBand 需在手环上打开）",
        (_, "waiting") => "Sent. Waiting for KlikBand to reply… (KlikBand must be open on the band)",
        ("id", "saved") => "Tersimpan di band",
        ("zh", "saved") => "已保存到手环",
        (_, "saved") => "Saved on the band",
        ("id", "refused") => "Band menolak lokasi ini",
        ("zh", "refused") => "手环拒绝了这个地点",
        (_, "refused") => "The band refused this place",
        ("id", "polar") => "Terlalu dekat kutub: di atas 65° tidak setiap hari ada matahari terbit dan terbenam.",
        ("zh", "polar") => "离极地太近：纬度 65° 以上并非每天都有日出日落。",
        (_, "polar") => "Too close to the pole: above 65° not every day has a sunrise and sunset.",
        ("id", "kemenag") => "Kemenag RI · 20°/18°",
        ("zh", "kemenag") => "印尼宗教部 · 20°/18°",
        (_, "kemenag") => "Kemenag (Indonesia) · 20°/18°",
        ("id", "mwl") => "Liga Muslim Dunia",
        ("zh", "mwl") => "世界穆斯林联盟",
        (_, "mwl") => "Muslim World League",
        ("id", "isna") => "ISNA · Amerika Utara",
        ("zh", "isna") => "北美伊斯兰协会",
        (_, "isna") => "ISNA · North America",
        ("id", "egypt") => "Mesir",
        ("zh", "egypt") => "埃及",
        (_, "egypt") => "Egypt",
        ("zh", "ummalqura") => "乌姆古拉 · 麦加",
        (_, "ummalqura") => "Umm al-Qura · Makkah",
        ("zh", "karachi") => "卡拉奇",
        (_, "karachi") => "Karachi",
        ("zh", "dubai") => "迪拜",
        (_, "dubai") => "Dubai",
        _ => "",
    }
}

fn redraw() {
    let root = state().root.clone();
    if let Some(root) = root {
        ui::render(&root, build());
    }
}

fn note(text: String) {
    tracing::info!("{}", text);
    state().note = text;
    redraw();
}

fn text(content: &str, size: u32, color: &str) -> ui::Element {
    ui::Element::new(ElementType::P, Some(content)).size(size).text_color(color)
}

fn button(label: &str, id: &str, primary: bool) -> ui::Element {
    ui::Element::new(ElementType::Button, Some(label))
        .padding(10)
        .radius(10)
        .bg(if primary { "#1fa77a" } else { "#2c2c2e" })
        .text_color("#ffffff")
        .on(Event::Click, id)
}

fn build() -> ui::Element {
    let s = state();
    let l = s.lang.as_str();

    let band_line = if s.band.is_empty() { tr(l, "unknown").to_string() } else { s.band.clone() };
    let band_card = ui::Element::new(ElementType::Div, None)
        .flex()
        .flex_direction(FlexDirection::Column)
        .gap(8)
        .padding(14)
        .radius(14)
        .bg("#1c1c1e")
        .child(text(tr(l, "onBand"), 13, "#8e8e93"))
        .child(text(&band_line, 16, "#ffffff"))
        .child(button(tr(l, "check"), "check", false));

    let search_row = ui::Element::new(ElementType::Div, None)
        .flex()
        .gap(8)
        .child(
            ui::Element::new(ElementType::Input, None)
                // Left uncontrolled: a fixed value would undo every key press,
                // since the page is not redrawn while typing
                .prop("placeholder", tr(l, "placeholder"))
                .flex_grow(1.0)
                .on(Event::Input, "query")
                .on(Event::Change, "query"),
        )
        .child(button(tr(l, "search"), "search", true));

    let mut root = ui::Element::new(ElementType::Div, None)
        .flex()
        .flex_direction(FlexDirection::Column)
        .gap(12)
        .padding(16)
        .max_width(560)
        .child(text("KlikBand", 22, "#ffffff"))
        .child(text(tr(l, "subtitle"), 14, "#8e8e93"))
        .child(band_card)
        .child(search_row);

    for (i, place) in s.results.iter().enumerate() {
        let label = format!("{} · {}", place.label(), place.timezone);
        root = root.child(button(&label, &format!("pick:{}", i), false));
    }

    if let Some((place, tz)) = &s.picked {
        let mut methods = ui::Element::new(ElementType::Div, None).flex().gap(6).prop("style", "flex-wrap: wrap");
        for code in METHODS {
            methods = methods.child(button(tr(l, code), &format!("method:{}", code), *code == *s.method));
        }
        let details = format!("{:.4}, {:.4} · {} · {}", place.lat, place.lng, place.timezone, places::offset_label(*tz));
        root = root.child(
            ui::Element::new(ElementType::Div, None)
                .flex()
                .flex_direction(FlexDirection::Column)
                .gap(8)
                .padding(14)
                .radius(14)
                .bg("#1c1c1e")
                .child(text(&place.label(), 18, "#ffffff"))
                .child(text(&details, 13, "#8e8e93"))
                .child(text(tr(l, "method"), 13, "#8e8e93"))
                .child(methods)
                .child(button(tr(l, "send"), "send", true)),
        );
    }

    if !s.note.is_empty() {
        root = root.child(text(&s.note, 14, "#ff9f0a"));
    }
    root
}

pub fn render(element_id: &str) {
    state().root = Some(element_id.to_string());
    ui::render(element_id, build());
}

// The text of an input event: either the value itself or { "value": ... }
fn input_value(payload: &str) -> String {
    match serde_json::from_str::<Value>(payload) {
        Ok(Value::Object(map)) => map.get("value").and_then(Value::as_str).unwrap_or_default().to_string(),
        Ok(Value::String(text)) => text,
        _ => payload.to_string(),
    }
}

pub async fn on_ui_event(id: &str, event: Event, payload: &str) {
    match (id, event) {
        ("query", _) => state().query = input_value(payload),
        ("search", Event::Click) => search(),
        ("check", Event::Click) => check().await,
        ("send", Event::Click) => send().await,
        (id, Event::Click) if id.starts_with("pick:") => {
            if let Ok(i) = id[5..].parse::<usize>() {
                pick(i);
            }
        }
        (id, Event::Click) if id.starts_with("method:") => {
            state().method = id[7..].to_string();
            redraw();
        }
        _ => {}
    }
}

fn search() {
    let (query, lang) = {
        let s = state();
        (s.query.trim().to_string(), s.lang.clone())
    };
    if query.is_empty() {
        return;
    }
    match places::search(&query, &lang) {
        Ok(results) => {
            let empty = results.is_empty();
            {
                let mut s = state();
                s.results = results;
                s.picked = None;
                s.note = if empty { tr(&lang, "none").into() } else { String::new() };
            }
            redraw();
        }
        Err(e) => note(e),
    }
}

fn pick(i: usize) {
    let (place, lang) = {
        let s = state();
        (s.results.get(i).cloned(), s.lang.clone())
    };
    let Some(place) = place else { return };
    if place.lat.abs() > MAX_LATITUDE {
        note(tr(&lang, "polar").into());
        return;
    }
    match places::utc_offset(&place) {
        Ok(tz) => {
            {
                let mut s = state();
                s.method = places::suggested_method(&place.country_code).into();
                s.picked = Some((place, tz));
                s.results.clear();
                s.note.clear();
            }
            redraw();
        }
        Err(e) => note(e),
    }
}

fn problem_key(problem: band::Problem) -> &'static str {
    match problem {
        band::Problem::NoBand => "noBand",
        band::Problem::NotInstalled => "notInstalled",
        band::Problem::TooOld => "tooOld",
        band::Problem::SendFailed => "sendFailed",
    }
}

fn band_line(lang: &str, name: &str, tz: f64, method: &str, version: &str, clock: &str) -> String {
    let mut line = format!("{} · {} · {}", name, places::offset_label(tz), tr(lang, method));
    if !version.is_empty() {
        line.push_str(&format!(" · KlikBand {}", version));
    }
    if !clock.is_empty() {
        line.push_str(&format!(" · {} {}", tr(lang, "clock"), clock));
    }
    line
}

async fn check() {
    let lang = state().lang.clone();
    match band::ask_state().await {
        Ok(_) => note(tr(&lang, "waiting").into()),
        Err(p) => note(tr(&lang, problem_key(p)).into()),
    }
}

async fn send() {
    let (picked, method, lang) = {
        let s = state();
        (s.picked.clone(), s.method.clone(), s.lang.clone())
    };
    let Some((place, tz)) = picked else { return };
    match band::set_location(&place, tz, &method).await {
        Ok(_) => note(tr(&lang, "waiting").into()),
        Err(p) => note(tr(&lang, problem_key(p)).into()),
    }
}

// A reply from KlikBand on the band
pub fn on_band_reply(payload: &str) {
    let Some(reply) = band::parse_reply(payload) else {
        tracing::info!("band reply not understood: {}", payload);
        return;
    };
    tracing::info!("band reply: {}", reply);
    let lang = state().lang.clone();
    match reply.get("type").and_then(Value::as_str) {
        Some("state") => {
            let place = reply.pointer("/place/name").and_then(Value::as_str).unwrap_or("?");
            let tz = reply.pointer("/place/tz").and_then(Value::as_f64).unwrap_or(0.0);
            let method = reply.get("method").and_then(Value::as_str).unwrap_or("");
            let version = reply.get("version").and_then(Value::as_str).unwrap_or("").to_string();
            let clock = reply.get("clockOffset").and_then(Value::as_f64).map(places::offset_label).unwrap_or_default();
            {
                let mut s = state();
                s.band = band_line(&lang, place, tz, method, &version, &clock);
                s.band_version = version;
                s.band_clock = clock;
                s.note.clear();
            }
            redraw();
        }
        Some("locationSaved") => {
            let ok = reply.get("ok").and_then(Value::as_bool).unwrap_or(false);
            let name = reply.get("name").and_then(Value::as_str).unwrap_or("");
            if ok {
                // What the band now uses is what was sent, so no need to ask it again
                {
                    let mut s = state();
                    if let Some((_, tz)) = s.picked {
                        s.band = band_line(&lang, name, tz, &s.method, &s.band_version, &s.band_clock);
                    }
                }
                note(format!("{}: {}", tr(&lang, "saved"), name));
            } else {
                note(tr(&lang, "refused").into());
            }
        }
        _ => {}
    }
}
