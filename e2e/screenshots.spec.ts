import { expect, test } from "@playwright/test";

const widths = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

for (const vp of widths) {
  test(`capture de / à ${vp.width} px`, async ({ page }) => {
    const external: string[] = [];
    page.on("request", (req) => {
      const url = new URL(req.url());
      if (!["localhost", "127.0.0.1"].includes(url.hostname) && url.protocol.startsWith("http")) external.push(req.url());
    });

    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    // Aucun défilement horizontal, aucune requête vers un domaine tiers.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(external).toEqual([]);

    // Le calculateur se met à jour à chaque frappe.
    await page.fill("#c-orders", "3000");
    await expect(page.locator('[data-out="wasted"]')).toHaveText("0");
    await page.fill("#c-orders", "1000");
    await expect(page.locator('[data-out="perOrder"]')).toHaveText("5,00");

    await page.locator("#c-orders").blur();
    await page.screenshot({ path: `docs/screenshots/${vp.name}.png`, fullPage: true });
  });
}

test("menu repliable sous 760 px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Menu" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#nav-principale")).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("link", { name: "FAQ" }).click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});
