const NBSP = " ";

/** Formate un nombre en fr-FR. Les séparateurs de milliers deviennent des espaces insécables. */
export function formatNumber(value: number, minDecimals = 0, maxDecimals = minDecimals): string {
  return value
    .toLocaleString("fr-FR", { minimumFractionDigits: minDecimals, maximumFractionDigits: maxDecimals })
    .replace(/[   ]/g, NBSP);
}

/** Montant en euros, avec une espace insécable avant « € » : « 1 500 € ». */
export function formatEuro(value: number, decimals = 0): string {
  return `${formatNumber(value, decimals)}${NBSP}€`;
}
