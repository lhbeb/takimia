const fs = require('fs');
const path = require('path');
const sharp = require(path.resolve(__dirname, '../../bricoc.com/node_modules/sharp'));

const takimiaDir = path.resolve(__dirname, '..');
const svgRaw = fs.readFileSync(path.join(takimiaDir, 'public/logosvg.svg'), 'utf8');

const innerSvg = svgRaw
  .replace(/<\?xml[\s\S]*?<svg[^>]*>/, '')
  .replace(/<\/svg>/, '');

const whiteInnerSvg = innerSvg.replace(/fill:\s*#2e3868/g, 'fill: #ffffff');

// Canvas 800x800
// Logo is 395.98 x 105.15
// Scale = 520 / 395.98 ≈ 1.3132
// Width = 520, Height = 105.15 * 1.3132 ≈ 138.08
// X offset = (800 - 520) / 2 = 140
// Y offset = (800 - 138.08) / 2 = 330.96

const pdpSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <rect width="800" height="800" fill="#2e3868"/>
  <g transform="translate(140, 330.96) scale(1.3132)">
    ${whiteInnerSvg}
  </g>
</svg>`;

async function run() {
  const buf = Buffer.from(pdpSvg);

  const pngBuf = await sharp(buf).png().toBuffer();
  fs.writeFileSync(path.join(takimiaDir, 'public/pdp.png'), pngBuf);
  fs.writeFileSync(path.join(takimiaDir, 'public/profile-picture.png'), pngBuf);

  const jpegBuf = await sharp(buf).jpeg({ quality: 95 }).toBuffer();
  fs.writeFileSync(path.join(takimiaDir, 'public/pdp.jpeg'), jpegBuf);

  // Test circle crop preview at 160x160 (retina 80x80)
  const circleMask = Buffer.from('<svg width="160" height="160"><circle cx="80" cy="80" r="80" fill="#fff"/></svg>');
  await sharp(pngBuf)
    .resize(160, 160)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toFile(path.join(takimiaDir, 'public/test-pdp-circle.png'));

  console.log('Successfully created Takimia Instagram profile pictures and circle preview');
}

run().catch(console.error);
