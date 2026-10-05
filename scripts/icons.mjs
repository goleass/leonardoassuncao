// Gera os ícones PNG/ICO a partir de public/favicon.svg (ICON-01).
//
// Uso: node scripts/icons.mjs
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const svg = readFileSync("public/favicon.svg");
const png = (size) => sharp(svg, { density: 72 * (size / 48) }).resize(size, size).png().toBuffer();

writeFileSync("public/apple-touch-icon.png", await png(180));
writeFileSync("public/icon-192.png", await png(192));
writeFileSync("public/icon-512.png", await png(512));

// ICO com uma única entrada PNG 48×48: cabeçalho de 6 bytes + diretório de 16 bytes + imagem.
const image = await png(48);
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2); // tipo: ícone
header.writeUInt16LE(1, 4); // quantidade de imagens
header.writeUInt8(48, 6); // largura
header.writeUInt8(48, 7); // altura
header.writeUInt16LE(1, 10); // planos de cor
header.writeUInt16LE(32, 12); // bits por pixel
header.writeUInt32LE(image.length, 14);
header.writeUInt32LE(22, 18); // posição da imagem
writeFileSync("public/favicon.ico", Buffer.concat([header, image]));
