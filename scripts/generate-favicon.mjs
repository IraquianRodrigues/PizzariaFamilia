#!/usr/bin/env node
// Generate favicon.ico and app icons from an existing logo image.
// Looks for the best candidate in public/assets: 'logo nova.png', 'logo.jpeg', 'logo.png'.
// Outputs to Next.js App Router locations under src/app/.

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const appDir = path.resolve(root, 'src', 'app');
const publicAssets = path.resolve(root, 'public', 'assets');

const candidates = [
  'logo nova.png',
  'logo.png',
  'logo.jpeg',
  'logo.jpg',
  'logo.svg'
];

function findLogo() {
  for (const name of candidates) {
    const p = path.join(publicAssets, name);
    if (fs.existsSync(p)) return p;
  }
  // As a fallback, scan for first png/jpeg in assets
  const files = fs.existsSync(publicAssets) ? fs.readdirSync(publicAssets) : [];
  const first = files.find(f => /\.(png|jpg|jpeg|svg)$/i.test(f));
  if (first) return path.join(publicAssets, first);
  return null;
}

async function ensureSharp() {
  try {
    const m = await import('sharp');
    return m.default || m;
  } catch (e) {
    console.error('Dependência "sharp" ausente. Rode: npm i -D sharp');
    process.exit(1);
  }
}

async function toIco(buffers) {
  try {
    const toIco = (await import('png-to-ico')).default;
    return await toIco(buffers);
  } catch (e) {
    console.error('Dependência "png-to-ico" ausente. Rode: npm i -D png-to-ico');
    process.exit(1);
  }
}

async function run() {
  const logoPath = findLogo();
  if (!logoPath) {
    console.error('Logo não encontrada em public/assets. Coloque um arquivo como "logo nova.png".');
    process.exit(1);
  }
  const Sharp = await ensureSharp();

  fs.mkdirSync(appDir, { recursive: true });

  // Target sizes for icons
  const iconPngPath = path.join(appDir, 'icon.png'); // 512x512 default
  const appleIconPath = path.join(appDir, 'apple-icon.png'); // 180x180
  const faviconIcoPath = path.join(appDir, 'favicon.ico'); // multi-size

  // Prepare a squared canvas with padding and transparent background
  const base = Sharp(logoPath).resize({
    width: 1024,
    height: 1024,
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  });

  const icon512 = await base.clone().png({ compressionLevel: 9 }).resize(512, 512).toBuffer();
  const apple180 = await base.clone().png({ compressionLevel: 9 }).resize(180, 180).toBuffer();

  // Favicon ICO: include common sizes
  const sizes = [16, 32, 48, 64];
  const icoPngs = [];
  for (const s of sizes) {
    const buf = await base.clone().png({ compressionLevel: 9 }).resize(s, s).toBuffer();
    icoPngs.push(buf);
  }
  const ico = await toIco(icoPngs);

  fs.writeFileSync(iconPngPath, icon512);
  fs.writeFileSync(appleIconPath, apple180);
  fs.writeFileSync(faviconIcoPath, ico);

  console.log('✔ Ícones gerados:');
  console.log(' -', path.relative(root, iconPngPath));
  console.log(' -', path.relative(root, appleIconPath));
  console.log(' -', path.relative(root, faviconIcoPath));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
