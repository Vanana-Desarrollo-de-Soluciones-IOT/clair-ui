const fs = require('node:fs');
const path = require('node:path');

function parseDotEnv(contents) {
  const result = {};
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;
    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  throw new Error('Missing `.env` file. Create it in the project root.');
}

const env = parseDotEnv(fs.readFileSync(envPath, 'utf8'));
const target = env.CLAIR_BACKEND_BASE_URL;

if (!target) {
  throw new Error(
    'Missing CLAIR_BACKEND_BASE_URL in `.env`. Example: CLAIR_BACKEND_BASE_URL=http://localhost:8080'
  );
}

module.exports = {
  '/api': {
    target,
    secure: false,
    changeOrigin: true,
    logLevel: 'warn',
  },
};

