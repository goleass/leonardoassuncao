// Mede CLS e Performance com Lighthouse 12 mobile (PERF-05, PERF-06, PERF-07). Manual, fora do `npm test`:
//   npm run build && node scripts/lighthouse.mjs
// Serve o dist/ numa porta livre, roda 3× em cada página e sai com 1 se algum CLS > 0,1 ou Performance < 95.
import { execFile } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join, normalize } from "node:path";
import { promisify } from "node:util";

const STATIC = join(process.cwd(), "dist");
const PAGES = ["/", "/criacao-de-sites/"];
const RUNS = 3;
const MAX_CLS = 0.1;
const MIN_PERFORMANCE = 0.95;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

if (!existsSync(join(STATIC, "index.html"))) {
  console.error("dist/ sem index.html: rode `npm run build` antes.");
  process.exit(1);
}

const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
  let file = join(STATIC, normalize(path));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!file.startsWith(STATIC) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  res.end(readFileSync(file));
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const out = mkdtempSync(join(tmpdir(), "lighthouse-"));

let failed = false;
try {
  for (const page of PAGES) {
    for (let run = 1; run <= RUNS; run++) {
      const report = join(out, "report.json");
      // Assíncrono: o servidor acima roda neste mesmo processo e precisa do event loop livre.
      await promisify(execFile)(
        "npx",
        [
          "-y",
          "lighthouse@12",
          origin + page,
          "--only-categories=performance",
          "--form-factor=mobile",
          "--output=json",
          `--output-path=${report}`,
          "--chrome-flags=--headless=new --no-sandbox",
          "--quiet",
        ],
        { env: { CHROME_PATH: "/usr/bin/google-chrome", ...process.env }, maxBuffer: 64 * 1024 * 1024 },
      );
      const lhr = JSON.parse(readFileSync(report, "utf8"));
      const cls = lhr.audits["cumulative-layout-shift"].numericValue;
      const performance = lhr.categories.performance.score;
      const ok = cls <= MAX_CLS && performance >= MIN_PERFORMANCE;
      failed ||= !ok;
      console.log(
        `${ok ? "ok  " : "FALHA"} ${page} run ${run}: CLS ${cls.toFixed(3)} | Performance ${Math.round(performance * 100)}`,
      );
    }
  }
} finally {
  server.close();
  rmSync(out, { recursive: true, force: true });
}

process.exit(failed ? 1 : 0);
