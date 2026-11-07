# Website Roxy AI

Struktur (URL bersih dipisah dengan "/"):

| URL | File |
|---|---|
| `/` | `public/index.html` |
| `/fitur` | `public/fitur/index.html` |
| `/terkait` | `public/terkait/index.html` |
| `/developer` | `public/developer/index.html` |
| `/panel` | `public/panel/index.html` (panel developer) |

CSS: `public/assets/css/style.css` | JS: `public/assets/js/` | Data: `public/data/config.json`

## Jalankan dengan panel (VPS / Termux / panel Node)
    PANEL_PASSWORD="passwordkuat123" PORT=3000 node server.js
Buka `/panel`, masuk, ubah data, klik Simpan. Perubahan langsung tampil di website.
Panel terkunci kalau PANEL_PASSWORD kosong, kurang dari 8 karakter, atau masih "ganti-password-ini".

## Hosting statis (Netlify, Vercel, GitHub Pages, cPanel)
Upload isi folder `public`. Website jalan normal, tapi tombol Simpan tidak aktif.
Di `/panel` pakai "Unduh config.json" lalu timpa `data/config.json` di hosting.
Di mode statis halaman panel bisa dibuka siapa saja (hanya untuk membuat file, tidak mengubah website).

Pasang HTTPS di domain `yannaimd.my.id` (reverse proxy Nginx/Caddy, atau Cloudflare) agar password panel tidak lewat HTTP biasa.
