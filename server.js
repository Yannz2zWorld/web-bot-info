// Server statis + API panel developer (tanpa dependensi). Jalankan: PANEL_PASSWORD=xxx node server.js
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const PORT = process.env.PORT || 3000;
const PASS = process.env.PANEL_PASSWORD || '';
const ENABLED = PASS.length >= 8 && PASS !== 'ganti-password-ini';
const PUB = path.join(__dirname, 'public');
const CFG = path.join(PUB, 'data', 'config.json');
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.webp': 'image/webp', '.txt': 'text/plain' };
const tokens = new Map(), fails = new Map();

const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };
const readBody = req => new Promise((ok, no) => { let b = ''; req.on('data', c => { b += c; if (b.length > 60000) { req.destroy(); no(new Error('big')); } }); req.on('end', () => ok(b)); req.on('error', no); });
const authed = req => { const t = (req.headers.authorization || '').replace(/^Bearer /, ''); const e = tokens.get(t); if (e && e > Date.now()) return true; tokens.delete(t); return false; };
const same = (a, b) => { const x = crypto.createHash('sha256').update(a).digest(), y = crypto.createHash('sha256').update(b).digest(); return crypto.timingSafeEqual(x, y); };

const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
const url = v => { try { const u = new URL(String(v).trim()); return /^https?:$/.test(u.protocol) ? u.href : ''; } catch (e) { return ''; } };
const handle = v => str(v, 40).replace(/^@/, '').replace(/[^A-Za-z0-9_.]/g, '');
function sanitize(c) {
  const out = { botName: str(c.botName, 40), dev: str(c.dev, 40), telegram: handle(c.telegram), tiktok: handle(c.tiktok) };
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
  if (p === '/api/ping') return send(res, 200, { ok: true, enabled: ENABLED });
  if (!ENABLED) return send(res, 503, { error: 'Panel dikunci: atur PANEL_PASSWORD' });
  try {
    if (p === '/api/login' && req.method === 'POST') {
      const ip = req.socket.remoteAddress, f = fails.get(ip) || { n: 0, t: 0 };
      if (f.n >= 5 && Date.now() - f.t < 300000) return send(res, 429, { error: 'Terlalu banyak percobaan, coba lagi 5 menit' });
      const { password } = JSON.parse(await readBody(req) || '{}');
      if (!same(String(password || ''), PASS)) { fails.set(ip, { n: f.n + 1, t: Date.now() }); return send(res, 401, { error: 'Password salah' }); }
      fails.delete(ip);
      const t = crypto.randomBytes(24).toString('hex'); tokens.set(t, Date.now() + 8 * 3600e3);
      return send(res, 200, { token: t });
    }
    if (p === '/api/config' && req.method === 'POST') {
      if (!authed(req)) return send(res, 401, { error: 'Belum masuk' });
      const clean = sanitize(JSON.parse(await readBody(req)));
      const tmp = CFG + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(clean, null, 2)); fs.renameSync(tmp, CFG);
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
      res.writeHead(200, h); res.end(req.method === 'HEAD' ? undefined : d);
    });
  });
}).listen(PORT, () => console.log('Roxy site: http://localhost:' + PORT + (ENABLED ? '' : '  (panel terkunci: set PANELPASSWORD minimal 8 karakter)')));
