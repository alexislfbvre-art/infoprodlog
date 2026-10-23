export const site = {
  brand: "Coût Réel",
  url: "https://[DOMAINE]",
  contactEmail: "[EMAIL]",
  legal: {
    owner: "[NOM ET PRÉNOM OU RAISON SOCIALE]",
    status: "[STATUT, ex. entrepreneur individuel]",
    siret: "[SIRET]",
    address: "[ADRESSE OU DOMICILIATION]",
    vat: "[N° TVA INTRACOM OU « TVA non applicable, art. 293 B du CGI »]",
    host: "[HÉBERGEUR : raison sociale, adresse et téléphone, tels qu'indiqués par l'hébergeur choisi]",
  },
  offers: {
    kit: { launchPrice: 190, regularPrice: 290, launchActive: true, checkoutUrl: "[URL_PAIEMENT_KIT]" },
    review: { price: 690, checkoutUrl: "[URL_PAIEMENT_REVUE]" },
    tender: { priceFrom: 1500, bookingUrl: "[URL_PRISE_DE_RDV]" },
  },
  refundPolicy: "[POLITIQUE DE REMBOURSEMENT]",
  analytics: { plausibleDomain: "" }, // vide = aucune mesure d'audience
};
