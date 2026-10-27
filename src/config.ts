// ─────────────────────────────────────────────────────────────────────────────
// TOUT LE SITE SE RÈGLE ICI.
// Remplace chaque valeur entre [CROCHETS], puis « Commit changes » sur GitHub :
// Vercel republie le site tout seul en 1 à 2 minutes.
// Sécurité : tant qu'une information légale ou le lien de paiement du kit
// contient encore un crochet, la mise en production sur Vercel est bloquée
// (les aperçus restent possibles). Voir en bas de ce fichier.
// ─────────────────────────────────────────────────────────────────────────────
export const site = {
  brand: "Coût Réel",
  url: "https://[DOMAINE]", // ex. https://cout-reel.vercel.app en attendant un vrai domaine
  contactEmail: "[EMAIL]", // l'adresse qui reçoit les questions et les demandes de revue
  legal: {
    owner: "[NOM ET PRÉNOM OU RAISON SOCIALE]",
    status: "[STATUT, ex. entrepreneur individuel]",
    siret: "[SIRET]",
    address: "[ADRESSE OU DOMICILIATION]",
    vat: "[N° TVA INTRACOM OU « TVA non applicable, art. 293 B du CGI »]",
    host: "[HÉBERGEUR : raison sociale, adresse et téléphone, tels qu'indiqués par l'hébergeur choisi]",
    paymentPlatform: "Gumroad",
    mediator: "[MÉDIATEUR DE LA CONSOMMATION : nom et site internet]",
    court: "[VILLE DU TRIBUNAL COMPÉTENT]",
  },
  offers: {
    // checkoutUrl du kit : le lien du produit Gumroad, ex. https://xxxx.gumroad.com/l/cout-reel
    kit: { launchPrice: 190, regularPrice: 290, launchActive: true, checkoutUrl: "[URL_PAIEMENT_KIT]" },
    // Laisser les crochets = le bouton ouvre un e-mail prérempli vers contactEmail (suffisant au lancement)
    review: { price: 690, checkoutUrl: "[URL_PAIEMENT_REVUE]" },
    tender: { priceFrom: 1500, bookingUrl: "[URL_PRISE_DE_RDV]" },
  },
  refundPolicy:
    "Le kit est un contenu numérique disponible immédiatement après le paiement : il n'est pas remboursé une fois téléchargé. Si un fichier ne s'ouvre pas ou contient une erreur, écrivez-nous : nous le corrigeons, ou nous vous remboursons, sous 7 jours.",
  analytics: { plausibleDomain: "" }, // vide = aucune mesure d'audience
};

// ─── Garde-fou de mise en production ────────────────────────────────────────
// Sur Vercel, un déploiement de production (branche main) échoue tant que ces
// champs contiennent encore un crochet. Les déploiements d'aperçu ne sont pas bloqués.
const requiredForLaunch: Record<string, string> = {
  "url": site.url,
  "contactEmail": site.contactEmail,
  "legal.owner": site.legal.owner,
  "legal.status": site.legal.status,
  "legal.siret": site.legal.siret,
  "legal.address": site.legal.address,
  "legal.vat": site.legal.vat,
  "legal.host": site.legal.host,
  "legal.mediator": site.legal.mediator,
  "legal.court": site.legal.court,
  "offers.kit.checkoutUrl": site.offers.kit.checkoutUrl,
};
const runtimeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
if (runtimeEnv?.VERCEL_ENV === "production") {
  const missing = Object.entries(requiredForLaunch)
    .filter(([, value]) => value.includes("["))
    .map(([key]) => key);
  if (missing.length > 0) {
    throw new Error(
      `[Coût Réel] Mise en production bloquée : complète ces champs dans src/config.ts : ${missing.join(", ")}`,
    );
  }
}
