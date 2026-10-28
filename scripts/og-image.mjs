// Génère public/og.png (1200 × 630) avec les polices auto-hébergées. Lancer : npm run og
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const font = (pkg, file) =>
  readFileSync(fileURLToPath(new URL(`../node_modules/@fontsource/${pkg}/files/${file}`, import.meta.url))).toString("base64");

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
@font-face{font-family:"Inter Tight";font-weight:700;src:url(data:font/woff2;base64,${font("inter-tight", "inter-tight-latin-700-normal.woff2")}) format("woff2")}
@font-face{font-family:Inter;font-weight:600;src:url(data:font/woff2;base64,${font("inter", "inter-latin-600-normal.woff2")}) format("woff2")}
html,body{margin:0;width:1200px;height:630px}
body{background:#1F2A44;color:#F7F7F4;font-family:Inter,sans-serif;display:flex;flex-direction:column;justify-content:space-between;padding:72px 80px;box-sizing:border-box}
.brand{display:flex;align-items:center;gap:18px;font-family:"Inter Tight";font-weight:700;font-size:34px}
.mono{width:60px;height:60px;border-radius:14px;background:#F7F7F4;color:#1F2A44;display:flex;align-items:center;justify-content:center;font-size:27px}
h1{margin:0;font-family:"Inter Tight";font-weight:700;font-size:76px;line-height:1.05;letter-spacing:-0.02em;max-width:1000px}
h1 span{color:#7FD1C5}
p{margin:0;font-weight:600;font-size:26px;color:#C9CFDB}
</style></head><body>
<div class="brand"><div class="mono">CR</div>Coût Réel</div>
<h1>Le devis dit 2&nbsp;€ par commande. <span>Le vrai coût, c'est 6,15&nbsp;€.</span></h1>
<p>Comparez vos devis de logisticien e-commerce sur un vrai coût par commande.</p>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: fileURLToPath(new URL("../public/og.png", import.meta.url)) });
await browser.close();
console.log("public/og.png généré");
