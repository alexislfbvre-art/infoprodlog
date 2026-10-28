import { describe, expect, it } from "vitest";
import { calculate, DEFAULT_INPUTS, formatResult, parseInput, verdict } from "../src/lib/calculator";
import { formatEuro } from "../src/lib/format";

const base = { ...DEFAULT_INPUTS };

describe("calculate", () => {
  it("donne 5,00 €, × 2,5 et 900 € avec les valeurs par défaut", () => {
    const r = calculate(base);
    expect(r.perOrder).toBeCloseTo(5, 10);
    expect(r.ratio).toBeCloseTo(2.5, 10);
    expect(r.wasted).toBeCloseTo(900, 10);
    expect(formatResult(r)).toEqual({ perOrder: "5,00", ratio: "2,5", wasted: "900" });
  });

  it("renvoie 0 par commande et un message d'invite quand orders = 0", () => {
    const inputs = { ...base, orders: 0 };
    const r = calculate(inputs);
    expect(r.perOrder).toBe(0);
    expect(r.ratio).toBe(0);
    expect(r.wasted).toBe(5000 - 1500);
    expect(verdict(inputs, r)).toBe("Indiquez un nombre de commandes pour lancer le calcul.");
  });

  it("n'applique pas le minimum quand il est déjà dépassé", () => {
    const inputs = { ...base, orders: 3000 };
    const r = calculate(inputs);
    // 3000 × 2 + 3000 × 0,6 × 1 + 1500 = 9300
    expect(r.variable).toBeCloseTo(9300, 10);
    expect(r.invoice).toBeCloseTo(9300, 10);
    expect(r.wasted).toBe(0);
    expect(r.perOrder).toBeCloseTo(3.1, 10);
    expect(verdict(inputs, r)).toMatch(/^Le minimum ne s’applique pas/);
  });

  it("ne facture pas d'article supplémentaire avec un seul article par commande", () => {
    const r = calculate({ ...base, itemsPerOrder: 1, monthlyMinimum: 0 });
    expect(r.variable).toBe(1000 * 2 + 1500);
    expect(r.perOrder).toBeCloseTo(3.5, 10);
  });

  it("accepte la virgule comme séparateur décimal", () => {
    expect(parseInput("1,6")).toBe(1.6);
    const r = calculate({ ...base, itemsPerOrder: "1,6" });
    expect(r.perOrder).toBeCloseTo(5, 10);
  });

  it("traite une saisie vide, négative ou invalide comme 0", () => {
    expect(parseInput("")).toBe(0);
    expect(parseInput("-3")).toBe(0);
    expect(parseInput("abc")).toBe(0);
    expect(parseInput(Number.NaN)).toBe(0);
    const r = calculate({ ...base, price: "", monthlyMinimum: "-10" });
    expect(r.ratio).toBe(0);
    expect(r.wasted).toBe(0);
  });

  it("explique le minimum avec les montants arrondis", () => {
    const r = calculate(base);
    expect(verdict(base, r)).toBe(
      "Ce mois-ci, vos prestations valent 4 100 € HT, mais le minimum vous fait payer 5 000 € HT. " +
        "Le simulateur du kit vous montre combien de mois par an sont dans ce cas.",
    );
  });
});

describe("formatEuro", () => {
  it("met une espace insécable avant € et entre les milliers", () => {
    expect(formatEuro(1500)).toBe("1 500 €");
    expect(formatEuro(6.15, 2)).toBe("6,15 €");
  });
});
