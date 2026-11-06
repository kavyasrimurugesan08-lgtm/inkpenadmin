import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { existsSync, readFileSync, statSync } from 'fs';
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

function resolveBuildCredentials() {
  const candidates = [resolve(__dirname, '..', '.env'), resolve(__dirname, '.env')]
    .filter(p => existsSync(p))
    .sort((a, b) => statSync(a).mtimeMs - statSync(b).mtimeMs);
  const merged = {};
  for (const p of candidates) Object.assign(merged, parseEnvFile(p));
  return {
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || process.env.VITE_ADMIN_USERNAME || merged.ADMIN_USERNAME || merged.VITE_ADMIN_USERNAME || '',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || merged.ADMIN_PASSWORD || merged.VITE_ADMIN_PASSWORD || ''
  };
}

export default defineConfig(() => {
  const creds = resolveBuildCredentials();
  return {
    envPrefix: ['VITE_', 'ADMIN_'],
    define: {
      __INKPEN_BUILD_ENV__: JSON.stringify(creds)
    },
    server: {
      port: 5174,
      proxy: {
        '/api': 'http://localhost:4000'
      }
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          sync: resolve(__dirname, 'sync.html')
        }
      }
    }
  };
});
