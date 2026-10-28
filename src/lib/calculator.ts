import { formatNumber } from "./format";

export interface CalculatorInputs {
  orders: number | string;
  itemsPerOrder: number | string;
  price: number | string;
  extraItemPrice: number | string;
  otherMonthlyFees: number | string;
  monthlyMinimum: number | string;
}

export interface CalculatorResult {
  variable: number;
  invoice: number;
  perOrder: number;
  ratio: number;
  wasted: number;
}

export const DEFAULT_INPUTS = {
  orders: 1000,
  itemsPerOrder: 1.6,
  price: 2,
  extraItemPrice: 1,
  otherMonthlyFees: 1500,
  monthlyMinimum: 5000,
} as const satisfies CalculatorInputs;

/** Une saisie vide, négative ou invalide vaut 0. La virgule est acceptée comme séparateur décimal. */
export function parseInput(value: number | string | null | undefined): number {
  const n = typeof value === "number" ? value : parseFloat(String(value ?? "").trim().replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function calculate(inputs: CalculatorInputs): CalculatorResult {
  const orders = parseInput(inputs.orders);
  const items = parseInput(inputs.itemsPerOrder);
  const price = parseInput(inputs.price);
  const extra = parseInput(inputs.extraItemPrice);
  const other = parseInput(inputs.otherMonthlyFees);
  const minimum = parseInput(inputs.monthlyMinimum);

  const variable = orders * price + orders * Math.max(items - 1, 0) * extra + other;
  const invoice = Math.max(minimum, variable);
  const perOrder = orders > 0 ? invoice / orders : 0;
  const ratio = price > 0 ? perOrder / price : 0;
  const wasted = Math.max(0, minimum - variable);

  return { variable, invoice, perOrder, ratio, wasted };
}

/** Valeurs affichées dans la zone de résultats (sans le symbole « € »). */
export function formatResult(result: CalculatorResult) {
  return {
    perOrder: formatNumber(result.perOrder, 2),
    ratio: formatNumber(result.ratio, 0, 1),
    wasted: formatNumber(Math.round(result.wasted)),
  };
}

/** Phrase d'explication sous les résultats, reprise de la maquette. */
export function verdict(inputs: CalculatorInputs, result: CalculatorResult): string {
  if (parseInput(inputs.orders) <= 0) {
    return "Indiquez un nombre de commandes pour lancer le calcul.";
  }
  if (result.wasted > 0) {
    return (
      `Ce mois-ci, vos prestations valent ${formatNumber(Math.round(result.variable))} € HT, ` +
      `mais le minimum vous fait payer ${formatNumber(Math.round(result.invoice))} € HT. ` +
      "Le simulateur du kit vous montre combien de mois par an sont dans ce cas."
    );
  }
  return "Le minimum ne s’applique pas ce mois-ci. Testez votre mois le plus creux : c’est souvent là que l’écart apparaît.";
}
