// Gera public/og.png (1200×630) na identidade do site (SEO-02).
//
// Uso: node scripts/og-image.mjs <display.ttf> <texto.ttf>
//
// O FreeType do sharp não lê woff2, então as fontes entram como TTF estáticos gerados a partir de
// node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2 com o fontTools
// (pip: fonttools + brotli), instanciando o eixo variável e renomeando a família:
//   OGDisplay: wght 700, wdth 118 (títulos do site)  ·  OGText: wght 450, wdth 100 (texto corrido)
import sharp from "sharp";

const [displayFont, textFont] = process.argv.slice(2);
if (!displayFont || !textFont) {
  console.error("Uso: node scripts/og-image.mjs <display.ttf> <texto.ttf>");
  process.exit(1);
}

const W = 1200;
const H = 630;
const PAD = 80;
const DEEP = "#0A1A33";
const MARK = "#5B95FF";
const ON_DARK = "#EEF3FA";

/** Texto renderizado pelo Pango com a fonte indicada, como camada PNG transparente. */
async function text(markup, font, fontfile, size, { alpha = "100%", tracking = 0 } = {}) {
  const { data, info } = await sharp({
    text: { text: `<span foreground="${ON_DARK}" alpha="${alpha}" letter_spacing="${Math.round(tracking * size * 1024)}">${markup}</span>`, font: `${font} ${size}`, fontfile, rgba: true, dpi: 72 },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { input: data, width: info.width, height: info.height };
}

// Mesmo tracking dos títulos do site (--tracking-display: -0.045em).
const wordmark = await text("Leonardo Gomes\nAssunção", "OGDisplay", displayFont, 108, { tracking: -0.045 });
const tagline = await text("Sites, sistemas web e integrações", "OGText", textFont, 38, { alpha: "74%" });
const domain = await text("leonardoassuncao.com.br", "OGText", textFont, 24, { alpha: "64%" });

const lineY = H - PAD - tagline.height - 36;
const wordmarkTop = lineY - 48 - wordmark.height;

const base = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${DEEP}"/>
  <rect x="${PAD}" y="${PAD}" width="20" height="20" fill="${MARK}"/>
  <rect x="${PAD}" y="${lineY}" width="${W - PAD * 2}" height="1" fill="#FFFFFF" fill-opacity="0.2"/>
</svg>`);

await sharp(base)
  .composite([
    { input: domain.input, left: W - PAD - domain.width, top: PAD - 4 },
    { input: wordmark.input, left: PAD - 6, top: wordmarkTop },
    { input: tagline.input, left: PAD, top: H - PAD - tagline.height },
  ])
  .png({ compressionLevel: 9 })
  .toFile("public/og.png");

console.log(`public/og.png ${W}×${H}; wordmark ${wordmark.width}px de largura`);
