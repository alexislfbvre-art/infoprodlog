# Coût Réel : site de vente

Site statique (Astro + TypeScript) du kit « Coût Réel ». Le site ne gère ni paiement, ni compte client, ni fichier : chaque bouton d'achat renvoie vers la page de paiement de la plateforme choisie (Lemon Squeezy, Paddle, Gumroad ou lien Stripe), qui encaisse, gère la TVA, facture et livre le fichier.

**Tout se règle dans un seul fichier : `src/config.ts`.**

## Changer un prix, une URL ou terminer le prix de lancement

Ouvrez `src/config.ts`, modifiez la valeur, puis faites un commit et un push. Vercel redéploie tout seul.

| Pour…                                   | Modifier                                                       |
| --------------------------------------- | -------------------------------------------------------------- |
| changer le prix du kit                  | `offers.kit.launchPrice` (lancement) ou `offers.kit.regularPrice` |
| **terminer le prix de lancement**       | `offers.kit.launchActive: false`                               |
| changer le prix de la revue             | `offers.review.price`                                          |
| changer le prix plancher de l'appel d'offres | `offers.tender.priceFrom`                                 |
| brancher la page de paiement du kit     | `offers.kit.checkoutUrl`                                       |
| brancher la page de paiement de la revue | `offers.review.checkoutUrl`                                   |
| brancher la prise de rendez-vous        | `offers.tender.bookingUrl`                                     |
| activer la mesure d'audience Plausible  | `analytics.plausibleDomain: "votre-domaine.fr"`                |

- Avec `launchActive: true`, le site affiche 190 € HT et la mention « Prix de lancement pour les 20 premiers acheteurs. Ensuite : 290 € HT. ». Avec `false`, il affiche seulement 290 € HT, partout : hero, offres, appel à l'action final, CGV et données structurées.
- Tant qu'une URL contient encore un crochet `[`, le bouton ouvre un e-mail prérempli vers `contactEmail`, et `npm run build` affiche un avertissement, sans échouer.
- Dans la plateforme de paiement, réglez la page de confirmation sur `https://votre-domaine/merci`.

## Lancer le site en local

Il faut Node.js 22.22 ou plus récent.

```bash
npm install
npm run dev          # http://localhost:4321, avec l'encadré « Brouillon » sur les pages légales
npm run build        # génère le site dans dist/
npm run preview      # sert dist/ en local
npm run test         # tests Vitest du calculateur
npm run check        # vérification des types
npm run screenshots  # captures Playwright de / à 390 et 1440 px, dans docs/screenshots/
npm run og           # régénère public/og.png (image de partage 1200 × 630)
```

## Déployer sur Vercel

1. **GitHub** : poussez le dépôt sur GitHub (il peut rester privé).
2. **Vercel** : sur vercel.com, choisissez *Add New… > Project*, importez le dépôt, puis *Deploy*. Vercel détecte Astro, et `vercel.json` règle le reste : commande `npm run build`, dossier `dist`, URL sans `.html`.
3. **Domaine** : dans *Settings > Domains*, ajoutez votre domaine et créez chez votre registraire les enregistrements DNS indiqués par Vercel.
4. Renseignez `url: "https://votre-domaine.fr"` dans `src/config.ts`. Ce réglage sert à l'URL canonique, au sitemap, à `robots.txt` et à l'image de partage. Faites ensuite un commit et un push.
5. Reportez dans `legal.host` les coordonnées de l'hébergeur, telles que Vercel les publie.

Le build fonctionne aussi sur Netlify sans modification (`netlify.toml` fourni).

## `[PLACEHOLDERS]` restant à remplir

Tous se trouvent dans `src/config.ts` :

| Champ                     | Placeholder                                   | Où il apparaît                         |
| ------------------------- | --------------------------------------------- | -------------------------------------- |
| `url`                     | `[DOMAINE]`                                   | canonique, sitemap, robots.txt, OG     |
| `contactEmail`            | `[EMAIL]`                                     | pied de page, boutons de repli, pages légales |
| `legal.owner`             | `[NOM ET PRÉNOM OU RAISON SOCIALE]`           | pied de page, mentions, CGV            |
| `legal.status`            | `[STATUT, ex. entrepreneur individuel]`       | mentions, CGV                          |
| `legal.siret`             | `[SIRET]`                                     | pied de page, mentions, CGV            |
| `legal.address`           | `[ADRESSE OU DOMICILIATION]`                  | mentions, CGV, confidentialité         |
| `legal.vat`               | `[N° TVA INTRACOM OU « TVA non applicable… »]` | mentions, CGV                         |
| `legal.host`              | `[HÉBERGEUR : raison sociale, adresse, téléphone]` | mentions                          |
| `legal.paymentPlatform`\* | `[PLATEFORME DE PAIEMENT]`                    | merci, mentions, CGV, confidentialité  |
| `legal.mediator`\*        | `[MÉDIATEUR DE LA CONSOMMATION]`              | CGV                                    |
| `legal.court`\*           | `[VILLE DU TRIBUNAL COMPÉTENT]`               | CGV                                    |
| `offers.kit.checkoutUrl`  | `[URL_PAIEMENT_KIT]`                          | « Obtenir le kit », « Acheter le kit » |
| `offers.review.checkoutUrl` | `[URL_PAIEMENT_REVUE]`                      | « Réserver une revue »                 |
| `offers.tender.bookingUrl` | `[URL_PRISE_DE_RDV]`                         | « En parler 20 minutes »               |
| `refundPolicy`            | `[POLITIQUE DE REMBOURSEMENT]`                | FAQ, CGV                               |

\* Ces champs ont été ajoutés au modèle de configuration initial, parce que les CGV en ont besoin.

Pour vérifier qu'il ne reste plus rien à remplir : `grep -n "\[" src/config.ts`.

## Pages légales

Les mentions légales, les CGV et la politique de confidentialité sont des **brouillons à faire valider par un juriste**. Un encadré le rappelle en développement (`npm run dev`), et il n'apparaît jamais dans le site publié.

## Structure

```
src/
  config.ts              prix, URL, informations légales
  lib/calculator.ts      logique du calculateur (fonction pure, testée)
  lib/format.ts          formatage fr-FR des montants
  lib/offers.ts          prix affichés et liens des boutons
  layouts/               Base (head, SEO, polices) et Page (pages secondaires)
  components/            une section de la page d'accueil par composant
  pages/                 /, /merci, /mentions-legales, /cgv, /confidentialite, /404, robots.txt
tests/                   tests Vitest
e2e/                     tests et captures Playwright
public/                  favicon.svg, og.png
```

Les fichiers vendus ne doivent jamais être placés dans `public/` : la plateforme de paiement les livre. Le dossier `produit/` est exclu du dépôt par `.gitignore`.
