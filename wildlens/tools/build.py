"""Assemble src/ into dist/wildlens.html (the page published as a Claude Artifact)
dist/preview.html and index.html (same page wrapped in a full HTML skeleton,
for local testing and for GitHub Pages, which needs index.html at the repository root).
Usage: python3 -I tools/build.py"""
import json, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
p = lambda *a: os.path.join(root, *a)
r = lambda f: open(p("src", f), encoding="utf-8").read()
photos = json.load(open(p("photos.json"))) if os.path.exists(p("photos.json")) else {}
data = r("data.js").replace("const PHOTOS = {};", "const PHOTOS = " + json.dumps(photos) + ";")
page = r("shell.html") + "\n<script>\n" + r("config.js") + "\n" + r("art.js") + "\n" + data + "\n" + r("app.js") + "\n</script>\n"
os.makedirs(p("dist"), exist_ok=True)
open(p("dist", "wildlens.html"), "w", encoding="utf-8").write(page)
head, body = page.split("</style>", 1)            # move <title>, fonts and CSS into <head>
full = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<style>:root{color-scheme:light}body{margin:0}[hidden]{display:none!important}img{max-width:100%}</style>'
        + head + "</style></head><body>" + body + "</body></html>")
open(p("dist", "preview.html"), "w", encoding="utf-8").write(full)
open(p("index.html"), "w", encoding="utf-8").write(full)   # GitHub Pages serves this at the site root
print(f"built dist/wildlens.html ({len(page):,} bytes), photos: {sorted(photos) or 'none'}")
