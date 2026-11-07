// Server statis + API panel developer. Penyimpanan: file lokal, atau Vercel Blob bila BLOB_READ_WRITE_TOKEN ada (wajib di Vercel karena filesystem hanya-baca). Jalankan: PANEL_USER=xxx PANEL_PASSWORD=xxx node server.js
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const PORT = process.env.PORT || 3000;
const PASS = process.env.PANEL_PASSWORD || '';
const USERN = process.env.PANEL_USER || '';
const ENABLED = PASS.length >= 8 && PASS !== 'ganti-password-ini' && USERN.length >= 3 && USERN !== 'admin';
const PUB = path.join(__dirname, 'public');
const CFG = path.join(PUB, 'data', 'config.json');
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.webp': 'image/webp', '.gif': 'image/gif', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.m4a': 'audio/mp4', '.txt': 'text/plain' };
const fails = new Map();
// token login tanpa state (aman untuk serverless: tiap instance bisa memverifikasi sendiri)
const SECRET = crypto.createHash('sha256').update('roxy|' + USERN + '|' + PASS).digest();
const sign = e => crypto.createHmac('sha256', SECRET).update(e).digest('hex');
const mkToken = () => { const e = String(Date.now() + 8 * 3600e3); return e + '.' + sign(e); };
// penyimpanan Vercel Blob (opsional)
let blob = null;
try { if (process.env.BLOB_READ_WRITE_TOKEN) blob = require('@vercel/blob'); } catch (e) { console.log('Paket @vercel/blob belum terpasang (jalankan npm install)'); }
const NEED_BLOB = 'Hosting ini hanya-baca (Vercel). Buat Vercel Blob (tab Storage), hubungkan ke project ini, lalu deploy ulang.';
const isRO = e => e && (e.code === 'EROFS' || e.code === 'EACCES' || e.code === 'EPERM');
let cache = { t: 0, v: '' };
async function readCfg() {
  if (blob) {
    if (cache.v && Date.now() - cache.t < 10000) return cache.v;
    try {
      const { blobs } = await blob.list({ prefix: 'roxy/config.json', limit: 1 });
      if (blobs[0]) { const r = await fetch(blobs[0].url + '?t=' + Date.now()); if (r.ok) { const v = await r.text(); JSON.parse(v); cache = { t: Date.now(), v }; return v; } }
    } catch (e) { console.error('Gagal baca config dari Blob:', e.message); }
  }
  return fs.readFileSync(CFG, 'utf8');
}
async function writeCfg(clean) {
  const text = JSON.stringify(clean, null, 2);
  if (blob) { await blob.put('roxy/config.json', text, { access: 'public', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json', cacheControlMaxAge: 60 }); cache = { t: Date.now(), v: text }; return; }
  try { const tmp = CFG + '.tmp'; fs.writeFileSync(tmp, text); fs.renameSync(tmp, CFG); } catch (e) { throw isRO(e) ? new Error(NEED_BLOB) : e; }
}

const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };
const readBigBody = (req, max) => new Promise((ok, no) => { let b = '', n = 0; req.on('data', c => { n += c.length; if (n > max) { req.destroy(); no(new Error('File terlalu besar')); return; } b += c; }); req.on('end', () => ok(b)); req.on('error', no); });
const UP = { image: { ext: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'ico'], max: 3 * 1024 * 1024 }, audio: { ext: ['mp3', 'ogg', 'wav', 'm4a'], max: 10 * 1024 * 1024 } };
const readBody = req => new Promise((ok, no) => { let b = ''; req.on('data', c => { b += c; if (b.length > 60000) { req.destroy(); no(new Error('big')); } }); req.on('end', () => ok(b)); req.on('error', no); });
const authed = req => { const [e, g] = (req.headers.authorization || '').replace(/^Bearer /, '').split('.'); if (!e || !g || !(Number(e) > Date.now())) return false; const ok = sign(e); return g.length === ok.length && crypto.timingSafeEqual(Buffer.from(g), Buffer.from(ok)); };
const same = (a, b) => { const x = crypto.createHash('sha256').update(a).digest(), y = crypto.createHash('sha256').update(b).digest(); return crypto.timingSafeEqual(x, y); };

const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
const url = v => { try { const u = new URL(String(v).trim()); return /^https?:$/.test(u.protocol) ? u.href : ''; } catch (e) { return ''; } };
const handle = v => str(v, 40).replace(/^@/, '').replace(/[^A-Za-z0-9_.]/g, '');
function sanitize(c) {
  const asset = v => { v = String(v == null ? '' : v).trim().slice(0, 300); if (!v) return ''; if (/^\/(assets|uploads)\/[\w.\-\/]+$/.test(v) && !v.includes('..')) return v; return url(v); };
  const out = { botName: str(c.botName, 40), dev: str(c.dev, 40), telegram: handle(c.telegram), tiktok: handle(c.tiktok),
    favicon: asset(c.favicon), botImg: asset(c.botImg), loadImg: asset(c.loadImg), music: asset(c.music),
    musicOn: c.musicOn !== false, musicVol: Math.min(1, Math.max(0, Number(c.musicVol) || 0.4)) };
  if (!out.botName) throw new Error('Nama bot wajib diisi');
  const site = (o, name) => { const u = url(o && o.url); if (!u) throw new Error('URL ' + name + ' tidak valid'); return { label: str(o.label, 40) || name, url: u }; };
  out.store = site(c.store, 'webstore'); out.api = site(c.api, 'REST API');
  const list = (a, label) => (Array.isArray(a) ? a : []).slice(0, 30).map(x => {
    const u = url(x && x.url); if (!u || !str(x.name, 40)) throw new Error('Data ' + label + ' tidak lengkap'); return { name: str(x.name, 40), url: u };
  });
  out.channels = list(c.channels, 'saluran'); out.groups = list(c.groups, 'grup');
  out.owners = (Array.isArray(c.owners) ? c.owners : []).slice(0, 10).map(x => {
    const wa = str(x && x.wa, 20).replace(/\D/g, ''); if (wa.length < 8 || wa.length > 15 || !str(x.label, 30)) throw new Error('Data owner tidak valid'); return { label: str(x.label, 30), wa };
  });
  return out;
}

async function api(req, res, p) {
  if (p === '/api/ping') return send(res, 200, { ok: true, enabled: ENABLED, storage: blob ? 'blob' : 'file' });
  if (p === '/api/config' && req.method === 'GET') { try { res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); return res.end(await readCfg()); } catch (e) { return send(res, 404, { error: 'config tidak ada' }); } }
  if (!ENABLED) return send(res, 503, { error: 'Panel dikunci: atur PANEL_USER dan PANEL_PASSWORD' });
  try {
    if (p === '/api/login' && req.method === 'POST') {
      const ip = req.socket.remoteAddress, f = fails.get(ip) || { n: 0, t: 0 };
      if (f.n >= 3 && Date.now() - f.t < 300000) return send(res, 429, { error: 'Terlalu banyak percobaan, coba lagi 5 menit' });
      const { username, password } = JSON.parse(await readBody(req) || '{}');
      const okU = same(String(username || ''), USERN), okP = same(String(password || ''), PASS);
      if (!(okU && okP)) { fails.set(ip, { n: f.n + 1, t: Date.now() }); return send(res, 401, { error: 'Username atau password salah' }); }
      fails.delete(ip);
      return send(res, 200, { token: mkToken() });
    }
    if (p === '/api/upload' && req.method === 'POST') {
      if (!authed(req)) return send(res, 401, { error: 'Belum masuk' });
      const d = JSON.parse(await readBigBody(req, 15 * 1024 * 1024)), rule = UP[d.type];
      if (!rule) throw new Error('Jenis file tidak dikenal');
      const ext = String(d.name || '').split('.').pop().toLowerCase();
      if (!rule.ext.includes(ext)) throw new Error('Format .' + ext + ' tidak didukung');
      const buf = Buffer.from(String(d.data || ''), 'base64');
      if (!buf.length || buf.length > rule.max) throw new Error('Ukuran file tidak valid (maks ' + rule.max / 1048576 + ' MB)');
      const fn = d.type + '-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex') + '.' + ext;
      if (blob) { const r = await blob.put('roxy/uploads/' + fn, buf, { access: 'public', addRandomSuffix: false, contentType: MIME['.' + ext] }); return send(res, 200, { path: r.url }); }
      try { const dir = path.join(PUB, 'uploads'); fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, fn), buf); } catch (e) { throw isRO(e) ? new Error(NEED_BLOB) : e; }
      return send(res, 200, { path: '/uploads/' + fn });
    }
    if (p === '/api/config' && req.method === 'POST') {
      if (!authed(req)) return send(res, 401, { error: 'Belum masuk' });
      const clean = sanitize(JSON.parse(await readBody(req)));
      await writeCfg(clean);
      return send(res, 200, { ok: true });
    }
  } catch (e) { return send(res, 400, { error: e.message || 'Permintaan tidak valid' }); }
  send(res, 404, { error: 'Tidak ditemukan' });
}

http.createServer((req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('X-Frame-Options', 'DENY'); res.setHeader('Referrer-Policy', 'same-origin');
  let p; try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch (e) { res.writeHead(400); return res.end(); }
  if (p.startsWith('/api/')) return api(req, res, p);
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
  if (p === '/data/config.json') return readCfg().then(t => { res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(t); }, () => { res.writeHead(404); res.end(); });
  let f = path.normalize(path.join(PUB, p));
  if (!f.startsWith(PUB)) { res.writeHead(403); return res.end(); }
  fs.stat(f, (e, s) => {
    if (!e && s.isDirectory()) {
      if (!p.endsWith('/')) { res.writeHead(301, { Location: p + '/' + (new URL(req.url, 'http://x').search) }); return res.end(); }
      f = path.join(f, 'index.html');
    }
    fs.readFile(f, (err, d) => {
      if (err) { res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end('<h1>404</h1><p>Halaman tidak ditemukan.</p><a href="/">Kembali</a>'); }
      const ext = path.extname(f), h = { 'Content-Type': MIME[ext] || 'application/octet-stream' };
      if (f === CFG) h['Cache-Control'] = 'no-store';
      const rg = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
      if (rg && h['Content-Type'].startsWith('audio/')) {
        const a = rg[1] === '' ? Math.max(0, d.length - Number(rg[2])) : Number(rg[1]), z = rg[1] !== '' && rg[2] !== '' ? Math.min(Number(rg[2]), d.length - 1) : d.length - 1;
        if (a > z || a >= d.length) { res.writeHead(416, { 'Content-Range': 'bytes */' + d.length }); return res.end(); }
        h['Content-Range'] = 'bytes ' + a + '-' + z + '/' + d.length; h['Accept-Ranges'] = 'bytes'; h['Content-Length'] = z - a + 1;
        res.writeHead(206, h); return res.end(req.method === 'HEAD' ? undefined : d.subarray(a, z + 1));
      }
      if (h['Content-Type'].startsWith('audio/')) h['Accept-Ranges'] = 'bytes';
      res.writeHead(200, h); res.end(req.method === 'HEAD' ? undefined : d);
    });
  });
}).listen(PORT, () => console.log('Roxy site: http://localhost:' + PORT + (ENABLED ? '' : '  (panel terkunci: set PANEL_USER minimal 3 karakter dan PANEL_PASSWORD minimal 8 karakter)')));
