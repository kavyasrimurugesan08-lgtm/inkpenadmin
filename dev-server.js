import { createServer } from 'http';
import { readFile, readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'fs';
import { join, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseEnvFile(filePath) {
  const out = {};
  if (!existsSync(filePath)) return out;
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const cleaned = line.replace(/^export\s+/, '');
    const eq = cleaned.indexOf('=');
    if (eq === -1) continue;
    const key = cleaned.slice(0, eq).trim();
    let val = cleaned.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    } else {
      val = val.replace(/\s+#.*$/, '').trim();
    }
    if (key) out[key] = val;
  }
  return out;
}

function getEnv() {
  const candidates = [join(__dirname, '..', '.env'), join(__dirname, '.env')]
    .filter(p => existsSync(p))
    .sort((a, b) => statSync(a).mtimeMs - statSync(b).mtimeMs);
  const merged = {};
  for (const p of candidates) Object.assign(merged, parseEnvFile(p));
  return merged;
}

function getAdminCredentials() {
  const env = getEnv();
  return {
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || process.env.VITE_ADMIN_USERNAME || env.ADMIN_USERNAME || env.VITE_ADMIN_USERNAME || 'jawaharkumar',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || env.ADMIN_PASSWORD || env.VITE_ADMIN_PASSWORD || 'admin123'
  };
}

function injectEnvHtml(buffer) {
  const creds = getAdminCredentials();
  const payload = JSON.stringify(creds).replace(/</g, '\\u003c');
  const scriptTag = `<script>window.__INKPEN_ENV__=${payload};</script>`;
  const html = buffer.toString('utf8');
  return html.includes('</head>') ? html.replace('</head>', `${scriptTag}\n</head>`) : `${scriptTag}\n${html}`;
}

const PORT = Number(process.env.PORT || getEnv().ADMIN_PORT || 5174);
const DB_FILE = join(__dirname, '..', 'backend', 'data', 'db.json');

if (!existsSync(dirname(DB_FILE))) {
  mkdirSync(dirname(DB_FILE), { recursive: true });
}

function readDB() {
  try { return JSON.parse(readFileSync(DB_FILE, 'utf8')); }
  catch (e) { return {}; }
}
function writeDB(data) {
  writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', c => { body += c.toString(); });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); } catch (e) { resolve({}); }
    });
  });
}
function sendJSON(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(payload));
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const cleanUrl = req.url.split('?')[0];

  if (cleanUrl === '/api/auth/login' && req.method === 'POST') {
    const { username, password } = await parseBody(req);
    const creds = getAdminCredentials();
    const u = (username || '').trim().toLowerCase();
    if (u === creds.ADMIN_USERNAME.trim().toLowerCase() && password === creds.ADMIN_PASSWORD) {
      return sendJSON(res, 200, {
        ok: true,
        token: 'inkpen-session-token-' + Date.now(),
        user: { username: creds.ADMIN_USERNAME, role: 'admin' }
      });
    }
    return sendJSON(res, 401, { ok: false, error: 'Incorrect username or password.' });
  }

  if (cleanUrl === '/api/state') {
    if (req.method === 'GET') return sendJSON(res, 200, readDB());
    if (req.method === 'PUT' || req.method === 'POST') {
      const next = await parseBody(req);
      const merged = { ...readDB(), ...next };
      writeDB(merged);
      return sendJSON(res, 200, merged);
    }
  }

  const filePath = join(__dirname, cleanUrl === '/' ? 'index.html' : cleanUrl.replace(/^\/+/, ''));

  readFile(filePath, (err, content) => {
    if (err) {
      readFile(join(__dirname, 'index.html'), (err2, fallback) => {
        if (err2) {
          res.writeHead(404);
          return res.end('Not found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(injectEnvHtml(fallback));
      });
      return;
    }
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    if (basename(filePath).toLowerCase() === 'index.html') {
      return res.end(injectEnvHtml(content));
    }
    res.end(content);
  });
}).listen(PORT, () => {
  console.log(`INKPEN Admin Panel running on http://localhost:${PORT}`);
});
