# Website Roxy AI (README serah-terima)

Dokumen ini ditulis supaya AI atau developer lain bisa langsung lanjut tanpa konteks percakapan sebelumnya.
**Aturan kerja: setiap kali ada perubahan/build, perbarui README ini (bagian "Status", "Riwayat permintaan", dan "Masalah/To-do").**

- Terakhir diperbarui: build 9 (7 Nov 2026)
- Pemilik: Yann (WA 6285282426298, Telegram @yannz2z). Bahasa komunikasi: Indonesia, santai.
- Sumber isi menu: zip bot `roxy_ai_obsurcate.zip` (`source/menu-yannajah.js`, variabel `global.allmenu`).

## 1. Ringkasan
Website satu halaman (SPA ber-hash) untuk bot WhatsApp Roxy AI. Tanpa framework, tanpa dependensi npm.
Node hanya dipakai untuk `server.js` (server statis + API panel developer). Hosting statis (Vercel dll) juga bisa, tapi panel masuk mode statis.

## 2. Struktur
```
roxy-site/
  server.js                 server statis + API (/api/ping, /api/login, /api/config, /api/upload)
  package.json
  tools/bundle-preview.py   gabung seluruh web jadi 1 file HTML (untuk pratinjau artifact)
  _backup_lama/             file lama dari versi sebelumnya (boleh dihapus)
  public/
    index.html              halaman utama, berisi semua "view" (home, rules, fitur, terkait, info, saluran, grup, owner)
    panel/index.html        panel developer (/panel)
    fitur|terkait|developer/index.html   hanya redirect ke /#fitur, /#terkait, /#owner
    assets/css/style.css    seluruh style (web + panel)
    assets/js/menus.js      const CATS = [[kategori,[perintah...]]...]  ("*" di belakang nama = premium)
    assets/js/app.js        logika web (loader, menu, routing hash, fitur, musik) + helper global
    assets/js/panel.js      logika panel developer
    assets/icons.svg        sprite ikon untuk panel (dipakai fungsi ic())
    assets/img/bot.jpg      foto bot bawaan (dari default-avatar.jpg bot)
    assets/media/music.mp3  musik bawaan (dari menu.mp3 bot)
    data/config.json        data yang bisa diubah dari panel
    uploads/                hasil upload dari panel (server mode)
```
Helper global di `app.js` yang dipakai juga oleh `panel.js`: `$`, `$$`, `ic`, `esc`, `safe`, `say`, `getConfig`, `DEF`, `DEFIMG`, `DEFMUS`. Jangan ganti namanya tanpa mengubah `panel.js`.

## 3. Desain (jangan diubah tanpa diminta)
Permintaan pemilik: **simpel, cartoon, TEMA TERANG (bukan gelap), tanpa efek glow ala AI, tanpa simbol bintang.**
- Latar abu terang `#e5e7ec`, kartu putih, garis tebal `3px` warna `#1f2733`, bayangan keras offset (`5px 5px 0 #aeb4c0`).
- Font: Nunito 700-900 (teks), Space Mono (label kecil/pill/kode).
- Ikon berwarna per menu: biru, hijau, kuning, merah, oranye, ungu, cyan (variabel CSS `--blue` dst).
- Menu: tombol kecil di **kanan atas** yang membuka dropdown ke bawah. Item "Fitur" punya tombol panah untuk membuka submenu kategori.
- Tombol musik kuning di samping tombol menu.
- Loading: kartu putih + bar bergaris kuning + bola foto bot melompat, latar krem bertitik dengan bentuk melayang (lingkaran, plus, hati, segitiga; BUKAN bintang). Setelah selesai layar menutup seperti iris (`clip-path`).
- Halaman memakai `.view` (satu tampil, lainnya `hidden`) dengan animasi `popin`.

## 4. Isi halaman
- **Home**: penjelasan bot dengan gaya tulis manusiawi (skill /humanizer tidak tersedia, jadi ditulis manual: kalimat natural, tanpa klaim yang tidak bisa dibuktikan). Jangan campur aturan/info ke home.
- **Rules, Info, Terkait, Saluran, Grup, Owner**: tiap halaman sendiri, dibuka dari menu.
- **Fitur**: grid kategori, klik kategori untuk melihat perintah, ada kolom cari lintas kategori. Route: `#fitur` dan `#fitur-<slug>` (mis. `#fitur-ai`).
- Kategori yang SENGAJA dihapus dari `menus.js`: NSFW, Cpanel (V1-V3), Owner. Kategori JPM, Auto Join, Enc, Premium masih ada (tanyakan pemilik kalau mau dihapus).
- Route hash hanya huruf kecil/angka/strip karena aturan artifact claude.ai.

## 5. config.json (diatur lewat panel)
```
botName, dev, telegram, tiktok,
favicon, botImg, loadImg, music      "" = pakai bawaan; atau "/uploads/..", "/assets/..", atau "https://.."
musicOn (bool), musicVol (0..1)
store {label,url}, api {label,url}
owners [{label,wa}], channels [{name,url}], groups [{name,url}]
```
Validasi ada di dua tempat: `check()` di `panel.js` dan `sanitize()` di `server.js` (server adalah yang menentukan).

## 6. Panel developer (`/panel`)
- Bisa atur: data umum, **favicon, foto bot (Home), foto loading bar, musik web** (upload atau URL, ada preview, tombol "Pakai bawaan", checkbox putar otomatis, slider volume), website terkait, owner/saluran/grup.
- **Login pakai username + password** dari environment variable. **Maksimal 3 kali salah**, lalu diblokir 5 menit per IP. Token sesi berlaku 8 jam.
- Jalankan: `PANEL_USER="usernamekamu" PANEL_PASSWORD="passwordkuat123" PORT=3000 node server.js`
  - Username min. 3 karakter dan bukan `admin`. Password min. 8 karakter dan bukan `ganti-password-ini`. Kalau salah satu tidak memenuhi, panel terkunci.
- Upload (`POST /api/upload`, butuh token): gambar png/jpg/jpeg/webp/gif/ico maks 3 MB; audio mp3/ogg/wav/m4a maks 10 MB. SVG sengaja ditolak (risiko XSS). Hasil di `public/uploads/`.
- Server mendukung HTTP Range untuk audio (agar Safari bisa memutar).
- **Hosting statis (Vercel/Netlify/GitHub Pages)**: tidak ada server, jadi panel mode statis: tidak ada login, tombol Simpan/Upload tidak jalan, hanya bisa isi form lalu "Unduh config.json" dan menimpa `public/data/config.json` secara manual. Panel yang benar-benar terkunci butuh hosting Node (VPS/Termux/Pterodactyl). Opsi lain yang belum dibuat: versi serverless Vercel (butuh env var + penyimpanan seperti Vercel KV/Blob atau commit ke GitHub lewat API).
- Pasang HTTPS di domain agar password tidak lewat HTTP biasa.

## 7. Musik
Browser memblokir autoplay, jadi musik mulai setelah sentuhan pertama pengunjung. Pilihan pengunjung (nyala/mati) disimpan di `localStorage` kunci `roxy_music` dan menang atas pengaturan panel.

## 8. Pratinjau (artifact claude.ai)
`python3 tools/bundle-preview.py hasil.html` lalu publish `hasil.html` sebagai artifact (tanpa tag html/head/body; skeleton ditambahkan saat publish). Di artifact: foto bot dan musik jadi data URI, `fetch('/data/config.json')` gagal sehingga memakai `DEF` di `app.js`, dan panel tidak bisa dipakai (butuh server). Foto dari domain luar diblokir CSP artifact.
Untuk tes lokal dengan Playwright, bungkus hasil dengan `<html><head>..</head><body>..</body></html>` karena script awal memakai `document.body`.

## 9. Riwayat permintaan (urut)
1. Pasang file `app.js`, `style.css`, `index.html`, `indexpanel.html` ke folder `roxy-site/public` (index panel jadi `public/panel/index.html`) lalu buatkan pratinjau artifact.
2. Ganti style: simpel, hitam, cartoon; menu di kanan atas, kecil, dropdown ke bawah.
3. Style terlalu "AI glow": ganti ke cartoon lain, tema terang (contoh: dashboard abu terang, kartu putih garis tebal, ikon berwarna). Loading bar juga harus cartoon.
4. Home = penjelasan bot (gaya humanizer). Info dan lainnya dipindah ke menu masing-masing. Fitur punya submenu kategori. Animasi buka web dibuat aesthetic. Panel developer: atur favicon, foto bot, foto loading bar, dan musik web. Zip `roxy_ai_obsurcate.zip` dipakai sebagai sumber menu, foto bot, dan musik.
5. Hapus simbol bintang (diganti lingkaran).
6. Hapus kategori Cpanel, lalu kategori Owner dari menu Fitur.
7. Bug loading bar (persen minus, macet di 0%): `loader()` di `app.js` sekarang pakai `setInterval` + `performance.now()` dengan batas bawah 0, dan pengaman `setTimeout(finish,7000)`.
8. Panel wajib username + password (env var). Lalu batas percobaan login jadi 3x. Halaman lama `/fitur`, `/terkait`, `/developer` diganti redirect ke bagian yang sesuai. Dibuat README serah-terima ini dan `tools/bundle-preview.py`.

## 10. Masalah diketahui / To-do
- Panel belum pernah dilihat lewat screenshot (hanya API server yang dites). Cek tampilannya di HP.
- Loading bar sudah dites di browser desktop simulasi; belum dikonfirmasi di HP pemilik setelah perbaikan.
- Jumlah "1500+ fitur" di judul/meta adalah klaim pemilik; daftar perintah di `menus.js` ada sekitar 400-an (hanya yang tampil di menu bot).
- Opsional: versi serverless untuk panel di Vercel; tautan kecil ke panel di footer (belum ada, sengaja disembunyikan).
- Hapus `_backup_lama/` kalau sudah tidak perlu.

## 11. Prompt untuk AI pengganti
> Kamu melanjutkan proyek "Website Roxy AI". Baca README ini dulu, lalu buka `public/index.html`, `assets/js/app.js`, `assets/css/style.css`, `assets/js/panel.js`, dan `server.js`. Pertahankan gaya desain di bagian 3 dan jangan menambah fitur di luar permintaan. Setelah setiap perubahan: jalankan `node --check` pada file JS yang diubah, tes server dengan curl bila menyentuh API, buat pratinjau dengan `tools/bundle-preview.py`, perbarui README ini (status, riwayat permintaan, to-do), lalu kirim ulang zip lengkap. Bahasa balasan: Indonesia santai, singkat.
