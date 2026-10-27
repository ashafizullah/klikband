#!/bin/sh
# Releases KlikBand: GitHub Release, the AstroBox store and, with --plugin,
# the KlikBand plugin for AstroBox. See docs/RELEASING.md.
#
# usage: tools/release.sh VERSION [--notes NOTES.md] [--plugin PLUGIN_VERSION]
#   e.g. tools/release.sh 1.26.0 --plugin 1.1.0
# The notes default to release-notes/VERSION.md (kept out of git).
#
# Asks before each step that publishes something. Needs git, gh, node,
# python3 and, with --plugin, cargo with the wasm32-wasip2 target.
set -e

ROOT=$(cd "$(dirname "$0")/.." && pwd)
RESOURCE_DIR=${RESOURCE_DIR:-$ROOT/../astrobox-resource-klikband}
RESOURCE_REPO=astrobox-resource-com.ashafizullah.klikband
OWNER=ashafizullah
PACKAGE=com.ashafizullah.klikband
STORE=AstralSightStudios/AstroBox-Repo

VERSION=$1
shift || true
NOTES=
PLUGIN_VERSION=
while [ $# -gt 0 ]; do
  case $1 in
    --notes) NOTES=$2; shift 2 ;;
    --plugin) PLUGIN_VERSION=$2; shift 2 ;;
    *) echo "unknown option: $1" >&2; exit 1 ;;
  esac
done
[ -n "$NOTES" ] || NOTES=$ROOT/release-notes/$VERSION.md
if ! echo "$VERSION" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$' || [ ! -f "$NOTES" ]; then
  sed -n 2,10p "$0"
  exit 1
fi
NOTES=$(cd "$(dirname "$NOTES")" && pwd)/$(basename "$NOTES")

ask() {
  printf '%s [y/N] ' "$1"
  read -r answer
  [ "$answer" = y ] || [ "$answer" = Y ]
}

# GitHub sometimes answers a push to the release repo with HTTP 500; HTTP/1.1 gets through
push() {
  git push "$@" || git -c http.version=HTTP/1.1 push "$@"
}

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

echo "== 1. KlikBand $VERSION"
cd "$ROOT"
[ "$(git branch --show-current)" = main ] || { echo "switch to main first" >&2; exit 1; }
[ -z "$(git status --porcelain)" ] || { echo "commit or stash your changes first" >&2; exit 1; }
# Releases are signed with KlikBand's own key (kept out of git, see docs/RELEASING.md);
# AstroBox refuses packages signed with the toolkit's debug certificate
[ -f sign/release/private.pem ] && [ -f sign/release/certificate.pem ] || { echo "sign/release/private.pem and certificate.pem are missing" >&2; exit 1; }
git pull -q --ff-only origin main

CODE=$(python3 -I - "$VERSION" <<'EOF'
import json, re, sys
p = 'src/manifest.json'
s = open(p).read()
code = json.loads(s)['versionCode'] + 1
s = re.sub(r'"versionName": "[^"]*"', '"versionName": "%s"' % sys.argv[1], s, count=1)
s = re.sub(r'"versionCode": \d+', '"versionCode": %d' % code, s, count=1)
open(p, 'w').write(s)
print(code)
EOF
)
echo "versionName $VERSION, versionCode $CODE"

if [ -n "$PLUGIN_VERSION" ]; then
  sed -i '' "s/\"version\": \"[^\"]*\"/\"version\": \"$PLUGIN_VERSION\"/" plugin/manifest.json
  sed -i '' "s/^version = \"[^\"]*\"/version = \"$PLUGIN_VERSION\"/" plugin/Cargo.toml
  plugin/package.sh
fi

npm run lint
npx aiot release
RPK=$WORK/KlikBand-$VERSION.rpk
cp "dist/$PACKAGE.release.$VERSION.rpk" "$RPK"
ASSETS=$RPK
[ -n "$PLUGIN_VERSION" ] && cp plugin/dist/KlikBand.abp "$WORK/" && ASSETS="$RPK $WORK/KlikBand.abp"

git add src/manifest.json plugin/manifest.json plugin/Cargo.toml plugin/Cargo.lock
git commit -q -m "Release $VERSION"
git log --oneline -1

if ask "Push main and publish the GitHub release v$VERSION?"; then
  git push origin main
  # shellcheck disable=SC2086
  gh release create "v$VERSION" --target main --title "KlikBand $VERSION" --notes-file "$NOTES" $ASSETS
else
  echo "Stopped. The release commit is local; undo it with: git reset --hard HEAD~1"
  exit 1
fi

echo "== 2. AstroBox release repo ($RESOURCE_DIR)"
cd "$RESOURCE_DIR"
git pull -q --ff-only origin main
git rm -q --ignore-unmatch KlikBand-*.rpk
cp "$RPK" .
python3 -I - "$VERSION" "$CODE" <<'EOF'
import json, sys
p = 'manifest_v2.json'
m = json.load(open(p))
# versionCode lets AstroBox offer the update to people who have KlikBand
for d in m['downloads'].values():
    d['version'] = sys.argv[1]
    d['file_name'] = 'KlikBand-%s.rpk' % sys.argv[1]
    d['versionCode'] = int(sys.argv[2])
with open(p, 'w') as f:
    json.dump(m, f, ensure_ascii=False, indent=2)
    f.write('\n')
EOF
if [ -n "$PLUGIN_VERSION" ]; then
  cp "$ROOT/plugin/dist/manifest.json" "$ROOT/plugin/dist/icon.png" "$ROOT/plugin/dist/klikband_astrobox.wasm" plugin/
fi
git add -A
git commit -q -m "KlikBand $VERSION${PLUGIN_VERSION:+, plugin $PLUGIN_VERSION}"
HASH=$(git rev-parse --short=7 HEAD)
if ask "Push the release repo (commit $HASH)?"; then
  push origin main
else
  echo "Stopped. Push it later with: cd $RESOURCE_DIR && git push origin main"
  exit 1
fi

echo "== 3. AstroBox store ($STORE)"
git clone -q --depth 1 --filter=blob:none --sparse "https://github.com/$OWNER/AstroBox-Repo.git" "$WORK/store"
cd "$WORK/store"
git remote add upstream "https://github.com/$STORE.git"
# A shallow clone only tracks main, so other branches are fetched into
# remote-tracking refs by name
git fetch -q --depth 1 upstream main:refs/remotes/upstream/main
BASE=$(git rev-parse upstream/main)
DIR=tmp/$OWNER/$RESOURCE_REPO
LISTED=$(git show "upstream/main:index_v2.csv" | grep -c "^$PACKAGE," || true)
# An edit request still open in the store (an earlier update-klikband-* PR)
OPEN=$(gh pr list -R "$STORE" --author "$OWNER" --state open --json headRefName \
  --jq '[.[].headRefName | select(startswith("update-klikband"))][0] // ""')

if [ "$LISTED" = 0 ]; then
  # Not in the store yet: the first submission (add-klikband) is still open, so update it
  git fetch -q --depth 1 origin add-klikband:refs/remotes/origin/add-klikband
  git checkout -q -b add-klikband origin/add-klikband
  git sparse-checkout set tmp
  sed -i '' "s/,$RESOURCE_REPO,[0-9a-f]*,/,$RESOURCE_REPO,$HASH,/" "$DIR/resource.csv"
  git commit -q -am "Update KlikBand to $VERSION"
  if ask "Push the open store submission (add-klikband) to $HASH?"; then
    push origin add-klikband
  fi
elif [ -n "$OPEN" ]; then
  # Listed, with an edit request still open: point it at the new commit, since
  # a second edit from the same catalog row would clash with it
  git fetch -q --depth 1 origin "$OPEN:refs/remotes/origin/$OPEN"
  git checkout -q -b "$OPEN" "origin/$OPEN"
  git sparse-checkout set tmp
  sed -i '' "s/,$RESOURCE_REPO,[0-9a-f]*,/,$RESOURCE_REPO,$HASH,/" "$DIR/resource.csv"
  git commit -q -am "Update KlikBand to $VERSION"
  if ask "Push the open store edit request ($OPEN) to $HASH?"; then
    push origin "$OPEN"
  fi
else
  # Listed: an edit request, which names the current row by its digest
  BRANCH=update-klikband-$VERSION
  git checkout -q -b "$BRANCH" upstream/main
  git sparse-checkout set tmp
  mkdir -p "$DIR"
  git show upstream/main:index_v2.csv | python3 -I -c '
import csv, hashlib, json, sys
package, repo, commit, base, out = sys.argv[1:]
rows = list(csv.reader(sys.stdin))
header = rows[0]
row = next(r for r in rows[1:] if r and r[0] == package)
entry = dict(zip(header, row))
digest = hashlib.sha256(",".join(entry.get(c, "").strip() for c in header).encode()).hexdigest()
entry["repo_commit_hash"] = commit
with open(out + "/resource.csv", "w", newline="") as f:
    w = csv.writer(f, lineterminator="\n")
    w.writerow(header)
    w.writerow([entry[c] for c in header])
json.dump({"schema_version": 1, "mode": "edit", "original_id": package, "base_entry_digest": digest,
           "base_catalog_commit": base}, open(out + "/request.json", "w"), indent=2)
' "$PACKAGE" "$RESOURCE_REPO" "$HASH" "$BASE" "$DIR"
  git add tmp
  git commit -q -m "Update resource: KlikBand $VERSION"
  if ask "Open a store pull request for KlikBand $VERSION?"; then
    push origin "$BRANCH"
    gh pr create -R "$STORE" --head "$OWNER:$BRANCH" --base main \
      --title "Update resource: KlikBand $VERSION" \
      --body "KlikBand $VERSION: https://github.com/$OWNER/klikband/releases/tag/v$VERSION"
  fi
fi

echo "== done"
[ -n "$PLUGIN_VERSION" ] && echo "The plugin store reads plugin/manifest.json from the release repo every 4 hours; nothing else to do."
exit 0
