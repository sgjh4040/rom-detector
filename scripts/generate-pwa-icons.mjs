// PWA 아이콘 생성 — favicon.svg → 192/512/maskable PNG
// 임시 아이콘. 추후 새 디자인으로 교체 시 동일 스크립트 재실행
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcSvg = resolve(__dirname, '../public/favicon.svg');
const outDir = resolve(__dirname, '../public/icons');
mkdirSync(outDir, { recursive: true });

const svg = readFileSync(srcSvg);
const PRIMARY = { r: 92, g: 107, b: 192, alpha: 1 }; // #5C6BC0
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

async function gen() {
  // 192: 흰 배경 + 가운데 svg (any purpose)
  await sharp(svg, { density: 512 })
    .resize(168, 168, { fit: 'contain', background: WHITE })
    .extend({ top: 12, bottom: 12, left: 12, right: 12, background: WHITE })
    .png()
    .toFile(`${outDir}/icon-192.png`);

  // 512: 동일, 더 큰 사이즈
  await sharp(svg, { density: 1024 })
    .resize(448, 448, { fit: 'contain', background: WHITE })
    .extend({ top: 32, bottom: 32, left: 32, right: 32, background: WHITE })
    .png()
    .toFile(`${outDir}/icon-512.png`);

  // 512 maskable: 보라 배경 + 안전영역 안에 svg (Android adaptive icon)
  await sharp(svg, { density: 1024 })
    .resize(320, 320, { fit: 'contain', background: PRIMARY })
    .extend({ top: 96, bottom: 96, left: 96, right: 96, background: PRIMARY })
    .png()
    .toFile(`${outDir}/icon-512-maskable.png`);

  // Apple touch icon: 180x180, 흰 배경
  await sharp(svg, { density: 512 })
    .resize(160, 160, { fit: 'contain', background: WHITE })
    .extend({ top: 10, bottom: 10, left: 10, right: 10, background: WHITE })
    .png()
    .toFile(`${outDir}/apple-touch-icon.png`);

  console.log('✓ icons generated:', outDir);
}

gen().catch((e) => { console.error(e); process.exit(1); });
