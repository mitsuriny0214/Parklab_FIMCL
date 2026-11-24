// 관리자 화면에서 올린 큰 사진을 가로세로 최대 2000px로 줄입니다. (선택 기능)
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DIR = process.argv[2] || 'images/uploads';
const MAX = 2000, MAX_BYTES = 1.5 * 1024 * 1024;
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);

let changed = 0;
for (const f of walk(DIR)) {
  const ext = path.extname(f).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
  const size = fs.statSync(f).size;
  const meta = await sharp(f).metadata();
  const big = Math.max(meta.width || 0, meta.height || 0) > MAX;
  if (!big && size <= MAX_BYTES) continue;
  let p = sharp(f).rotate().resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true });
  p = ext === '.png' ? p.png({ compressionLevel: 9 }) : ext === '.webp' ? p.webp({ quality: 82 }) : p.jpeg({ quality: 82, mozjpeg: true });
  const out = await p.toBuffer();
  if (out.length < size || big) { fs.writeFileSync(f, out); changed++; console.log(`축소: ${f} ${(size / 1024) | 0}KB -> ${(out.length / 1024) | 0}KB`); }
}
console.log(changed ? `${changed}개 사진을 줄였어요.` : '줄일 사진이 없어요.');
