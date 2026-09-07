const fs = require('fs');
const path = require('path');
const sharp = require(path.resolve(__dirname, '../../bricoc.com/node_modules/sharp'));

const takimiaDir = path.resolve(__dirname, '..');
const svgRaw = fs.readFileSync(path.join(takimiaDir, 'public/logosvg.svg'), 'utf8');

const innerSvg = svgRaw
  .replace(/<\?xml[\s\S]*?<svg[^>]*>/, '')
  .replace(/<\/svg>/, '');

const whiteInnerSvg = innerSvg.replace(/fill:\s*#2e3868/g, 'fill: #ffffff');

// Primary Master SVG (512x512) with Takimia brand navy (#2e3868) and white Takimia logo capsule
const masterSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="112" fill="#2e3868"/>
  <g transform="translate(16, 192.3) scale(1.212)">
    ${whiteInnerSvg}
  </g>
</svg>`;

function createIco(items) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(items.length, 4);

  let offset = 6 + items.length * 16;
  const entries = [];
  for (const item of items) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(item.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += item.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...items.map(b => b.buffer)]);
}

async function build() {
  const masterBuf = Buffer.from(masterSvg);

  // 1. 512x512 high-res favicon.png and icon.png
  const png512 = await sharp(masterBuf).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(takimiaDir, 'public/favicon.png'), png512);
  fs.writeFileSync(path.join(takimiaDir, 'public/icon.png'), png512);
  fs.writeFileSync(path.join(takimiaDir, 'src/app/icon.png'), png512);

  // 2. 180x180 apple-touch-icon
  const png180 = await sharp(masterBuf).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(takimiaDir, 'public/apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(takimiaDir, 'src/app/apple-icon.png'), png180);

  // 3. Multi-resolution ICO (16x16, 32x32, 48x48)
  const png16 = await sharp(masterBuf).resize(16, 16).png().toBuffer();
  const png32 = await sharp(masterBuf).resize(32, 32).png().toBuffer();
  const png48 = await sharp(masterBuf).resize(48, 48).png().toBuffer();

  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 },
  ]);

  fs.writeFileSync(path.join(takimiaDir, 'public/favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(takimiaDir, 'src/app/favicon.ico'), icoBuffer);

  // Clean up temporary test files
  const toClean = [
    'public/test-favicon1.png',
    'public/test-favicon2.png',
    'public/favicon-opt1.png',
    'public/favicon-opt2.png',
    'public/favicon-opt3.png',
    'public/favicon-opt4.png',
    'public/favicon-opt5.png',
    'public/favicon-opt6.png',
    'public/test-32-opt1.png',
    'public/test-32-opt2.png',
    'public/test-32-opt4.png',
    'public/preview-32-navy.png',
    'public/preview-32-white.png',
    'public/preview-32-trans.png',
  ];
  for (const f of toClean) {
    const p = path.join(takimiaDir, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  console.log('Successfully built all Takimia favicons from the official logo!');
}

build().catch(console.error);
