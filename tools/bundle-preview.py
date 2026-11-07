#!/usr/bin/env python3
"""Gabungkan website jadi SATU file HTML untuk pratinjau (artifact).
CSS dan JS di-inline, foto bot dan musik jadi data URI.
Pakai: python3 tools/bundle-preview.py hasil.html
Hasil dipublish sebagai artifact (tanpa <html>/<head>/<body>, skeleton ditambah saat publish)."""
import re, sys, base64, subprocess, os
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public')
r = lambda p: open(os.path.join(root, p), encoding='utf8').read()
css, menus, app, html = r('assets/css/style.css'), r('assets/js/menus.js'), r('assets/js/app.js'), r('index.html')
body = re.search(r'<body[^>]*>(.*)</body>', html, re.S).group(1)
body = re.sub(r'<script src[^>]*></script>', '', body).strip()
def b64(path, mime):
    return 'data:%s;base64,%s' % (mime, base64.b64encode(open(os.path.join(root, path), 'rb').read()).decode())
img = b64('assets/img/bot.jpg', 'image/jpeg')   # kecilkan dulu kalau terlalu besar
mus = b64('assets/media/music.mp3', 'audio/mpeg')
body = body.replace('/assets/img/bot.jpg', img)
app = app.replace("'/assets/img/bot.jpg'", "'" + img + "'").replace("'/assets/media/music.mp3'", "'" + mus + "'")
out = f'''<title>Roxy AI</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Space+Mono:wght@700&display=swap" rel="stylesheet">
<style>
{css}
</style>
<script>document.body.dataset.page="home";document.body.classList.add("lock");</script>
<link id="fav" rel="icon" href="">
{body}
<script>
{menus}
</script>
<script>
{app}
</script>
'''
open(sys.argv[1] if len(sys.argv) > 1 else 'preview.html', 'w', encoding='utf8').write(out)
print('ok', len(out))
