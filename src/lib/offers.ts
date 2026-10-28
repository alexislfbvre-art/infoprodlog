import { site } from "../config";
import { formatEuro } from "./format";

const warned = new Set<string>();

export function isPlaceholder(value: string): boolean {
  return value.includes("[");
}

/**
 * Lien d'un bouton d'achat. Tant que l'URL contient un crochet, le bouton pointe vers
 * un e-mail prérempli et le build affiche un avertissement (sans échouer).
 */
export function actionHref(url: string, subject: string, label: string): string {
  if (!isPlaceholder(url)) return url;
  if (!warned.has(label)) {
    warned.add(label);
    console.warn(`[Coût Réel] ${label} : URL non renseignée dans src/config.ts, le bouton renvoie vers un e-mail.`);
  }
  return `mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}`;
}

const { kit, review, tender } = site.offers;

export const kitPrice = kit.launchActive ? kit.launchPrice : kit.regularPrice;
export const kitPriceLabel = formatEuro(kitPrice);
export const launchNotice = `Prix de lancement pour les 20 premiers acheteurs. Ensuite : ${formatEuro(kit.regularPrice)} HT.`;

export const links = {
  kit: () => actionHref(kit.checkoutUrl, "Achat du kit Coût Réel", "Paiement du kit"),
  review: () => actionHref(review.checkoutUrl, "Revue de devis Coût Réel", "Paiement de la revue"),
  tender: () => actionHref(tender.bookingUrl, "Appel d'offres accompagné : prise de rendez-vous", "Prise de rendez-vous"),
  contact: () => `mailto:${site.contactEmail}`,
};
