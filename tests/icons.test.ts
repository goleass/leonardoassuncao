import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const file = (name: string) => readFileSync(join(process.cwd(), "public", name));

// Largura e altura ficam nos bytes 16–23 do cabeçalho IHDR de todo PNG.
const pngSize = (buf: Buffer) => ({ width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) });

// Cada entrada do diretório ICO tem 16 bytes a partir do byte 6; largura/altura 0 significa 256.
function icoSizes(buf: Buffer): string[] {
  return Array.from({ length: buf.readUInt16LE(4) }, (_, i) => {
    const w = buf[6 + i * 16] || 256;
    const h = buf[7 + i * 16] || 256;
    return `${w}x${h}`;
  });
}

describe("Ícones do site (ICON-01)", () => {
  it("favicon.ico contém uma imagem 48×48", () => {
    expect(icoSizes(file("favicon.ico"))).toContain("48x48");
  });

  it("favicon.svg é um SVG quadrado", () => {
    const svg = file("favicon.svg").toString();
    expect(svg).toMatch(/^<svg[^>]+viewBox="0 0 48 48"/);
  });

  it("apple-touch-icon.png tem 180×180", () => {
    expect(pngSize(file("apple-touch-icon.png"))).toEqual({ width: 180, height: 180 });
  });

  it("icon-512.png tem 512×512", () => {
    expect(pngSize(file("icon-512.png"))).toEqual({ width: 512, height: 512 });
  });
});
