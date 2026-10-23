# Mission : construire et mettre en ligne le site de vente « Coût Réel »

Tu vas construire le site de vente d'un produit numérique B2B, à partir d'une maquette existante, puis le préparer pour la mise en ligne. Travaille en français pour tout ce qui est visible par les visiteurs.

## 1. Le contexte

- **Produit** : « Coût Réel », un kit qui aide les marques e-commerce à choisir leur logisticien en comparant les devis sur un vrai coût par commande.
- **Cible** : fondateurs et responsables opérations de marques e-commerce françaises. Ce sont des professionnels, et tous les prix sont HT.
- **Vendeur** : Alexis, consultant indépendant en opérations et supply chain.
- **Offres** :
  - Kit à télécharger : 190 € HT en prix de lancement pour les 20 premiers acheteurs, puis 290 € HT.
  - Revue de devis : 690 € HT, kit inclus.
  - Appel d'offres accompagné : à partir de 1 500 € HT, sur devis.

## 2. Les fichiers fournis (dans ce dossier)

- `maquette-page-produit.dc.html` : **la maquette de référence**. C'est un fichier HTML au format « Design Component ». Les styles sont en ligne, les `{{trous}}` sont des valeurs calculées, et la classe JS en bas du fichier contient la logique du calculateur. Reprends-en fidèlement **tout le texte, l'ordre des sections, les couleurs, la typographie et la mise en page**. Tu dois la porter en code propre, pas la recopier telle quelle.
- `produit/` (s'il est présent) : les fichiers vendus. **Ne les publie jamais dans le site** : ils sont livrés par la plateforme de paiement, pas par une URL publique.

Commence par lire la maquette en entier avant d'écrire du code.

## 3. La stack technique

- **Astro** (dernière version stable), en site 100 % statique, avec TypeScript.
- Le CSS est dans des fichiers de composants Astro, avec des variables CSS pour les couleurs. Pas de Tailwind, sauf si tu as une raison solide de l'ajouter.
- Le seul JavaScript côté client est celui du calculateur, en JS natif, chargé uniquement dans son composant.
- **Polices auto-hébergées** via `@fontsource/inter` et `@fontsource/inter-tight`. N'appelle pas Google Fonts : le site doit éviter tout transfert de données vers un tiers sans nécessité.
- **Hébergement** : configure le projet pour Vercel, avec un `vercel.json` si nécessaire. Le build doit aussi fonctionner sur Netlify sans modification.
- **Tests** : Vitest pour la logique du calculateur, et Playwright pour 2 captures d'écran de contrôle.

## 4. Le paiement et la livraison

Le site ne gère **ni paiement, ni compte client, ni fichier**. Chaque bouton d'achat renvoie vers une page de paiement hébergée par une plateforme qui encaisse, gère la TVA, émet la facture et livre le fichier. Les choix possibles sont Lemon Squeezy, Paddle, Gumroad ou un lien de paiement Stripe. Le choix n'est pas encore fait : **toutes les URL doivent venir d'un seul fichier de configuration**.

Crée `src/config.ts` :

```ts
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
```

Règles d'affichage :

- Quand `launchActive` vaut `true`, affiche 190 € HT et la mention « Prix de lancement pour les 20 premiers acheteurs. Ensuite : 290 € HT. ». Sinon, affiche seulement 290 € HT, sans aucune mention de remise.
- Tant qu'une URL de paiement contient encore un crochet `[`, le bouton correspondant pointe vers `mailto:` avec un objet prérempli. Le build affiche alors un avertissement dans la console, mais ne doit pas échouer.
- Tous les montants sont formatés en `fr-FR`, avec une espace insécable avant « € ».

## 5. Les pages à créer

| Route | Contenu |
| --- | --- |
| `/` | La page de vente, fidèle à la maquette (section 6) |
| `/merci` | Page de remerciement après paiement : où trouver le fichier (e-mail de la plateforme), comment l'ouvrir (Excel ou Google Sheets via Fichier > Importer), proposition de revue de devis, contact. Balise `noindex`. |
| `/mentions-legales` | Mentions légales d'un site professionnel français (éditeur, statut, SIRET, contact, hébergeur, propriété intellectuelle), à partir de `site.legal` |
| `/cgv` | CGV de vente de contenu numérique aux professionnels (voir section 8) |
| `/confidentialite` | Politique de confidentialité courte : aucune donnée collectée par le site lui-même, paiement chez un tiers, mesure d'audience sans cookie si elle est activée |
| `/404` | Page simple qui renvoie vers l'accueil |

Ajoute un pied de page commun à toutes les pages, avec les liens légaux. Ce pied de page remplace les liens `#top` de la maquette.

## 6. La page d'accueil : fidélité à la maquette

Reprends les sections dans cet ordre : en-tête et navigation, hero avec l'extrait du comparatif, « Deux devis ne se comparent jamais », le calculateur, le contenu du kit, la méthode en 5 étapes, « pour vous si / pas pour vous si », les 3 offres, « Qui a conçu le kit », la FAQ, l'appel à l'action final, le pied de page.

- **Le texte** : reprends le texte mot pour mot. N'ajoute ni témoignage, ni statistique, ni logo client, ni compteur de stock, ni compte à rebours. Ce qui n'est pas dans la maquette n'existe pas.
- **Les couleurs** : encre `#1F2A44`, accent `#0F766E`, fond `#F7F7F4`, accent clair `#7FD1C5`, alerte `#B54708`, fond d'alerte `#FEEBC8`, texte secondaire `#3D4760` et `#5B6478`, bordures `#E4E2DA`.
- **Les ancres** : les liens de navigation pointent vers les ancres de la page, avec un défilement fluide (sauf si `prefers-reduced-motion` est activé).
- **Les boutons** : « Obtenir le kit », « Acheter le kit », « Réserver une revue » et « En parler 20 minutes » pointent vers les URL de `config.ts`. Les deux premiers mènent à l'offre kit, les deux autres à la revue et au rendez-vous.
- **Le responsive** : la page doit être parfaite à 390 px de large, sans défilement horizontal. Au-dessous de 760 px, la navigation passe dans un menu repliable accessible (`<button aria-expanded>`).
- **La FAQ** : garde les `<details>`/`<summary>` natifs.

## 7. Le calculateur (le cœur de la page)

Isole la logique dans une fonction pure, `src/lib/calculator.ts`, testée avec Vitest :

```
entrées : orders, itemsPerOrder, price, extraItemPrice, otherMonthlyFees, monthlyMinimum
           (une saisie vide, négative ou invalide vaut 0 ; la virgule est acceptée comme séparateur décimal)
variable  = orders × price + orders × max(itemsPerOrder − 1, 0) × extraItemPrice + otherMonthlyFees
invoice   = max(monthlyMinimum, variable)
perOrder  = orders > 0 ? invoice / orders : 0
ratio     = price > 0 ? perOrder / price : 0
wasted    = max(0, monthlyMinimum − variable)
```

- **Valeurs par défaut** : 1000, 1.6, 2, 1, 1500, 5000. Avec ces valeurs, le calcul doit donner perOrder = 5,00 €, ratio = 2,5 et wasted = 900 €. C'est le premier test.
- **Tests** : couvre au minimum les cas orders = 0, minimum non atteint, un seul article par commande, et la saisie « 1,6 » avec une virgule.
- **Affichage** : mise à jour à chaque frappe, sans bouton. Utilise des `<input type="number">` avec un `<label>` relié, et une zone de résultats en `aria-live="polite"`. Le paragraphe d'explication sous les résultats reprend les deux phrases de la maquette, selon que le minimum s'applique ou non.
- Sans JavaScript, le calculateur affiche les résultats des valeurs par défaut, rendus au build.

## 8. Le juridique : des brouillons, clairement signalés

Rédige les pages légales à partir des variables de `site.legal`. Ajoute en haut de chacune un encadré visible uniquement en développement, `import.meta.env.DEV` : « Brouillon à faire valider par un juriste ». Il ne doit jamais apparaître en production.

Les CGV doivent couvrir au minimum :

- l'objet : la vente de contenus numériques et de prestations de conseil ;
- les clients : des professionnels ;
- les prix HT et la TVA ;
- la commande et le paiement via la plateforme tierce ;
- la livraison par téléchargement ;
- la licence d'usage interne, sans revente ;
- la propriété intellectuelle ;
- la responsabilité : un outil d'aide à la décision, qui ne remplace pas un conseil juridique ;
- le droit de rétractation : il ne s'applique pas entre professionnels. Si un consommateur achète, il perd ce droit pour un contenu numérique fourni immédiatement, à condition d'avoir donné son accord exprès et reconnu cette perte (article L221-28, 13° du Code de la consommation). Écris-le, puis signale-moi que ce point doit être vérifié dans le tunnel de paiement de la plateforme ;
- la politique de remboursement, avec `site.refundPolicy` ;
- la médiation et le droit applicable.

## 9. Le référencement et le partage

- `<html lang="fr">`, un titre et une meta description par page. Pour l'accueil : titre « Coût Réel · Comparez vos devis de logisticien e-commerce », description de 150 à 160 caractères tirée du hero.
- Une URL canonique, `sitemap.xml` (via `@astrojs/sitemap`) et `robots.txt`.
- Une image Open Graph de 1200 × 630 générée au build ou en SVG statique : « Le devis dit 2 € par commande. Le vrai coût, c'est 6,15 €. » sur fond `#1F2A44`, avec la marque.
- Des données structurées JSON-LD `Product` avec `Offer` pour le kit : prix courant, `priceCurrency` EUR, et la mention HT dans la description. N'ajoute **aucun** `aggregateRating` : il n'y a pas d'avis.
- Une favicon en SVG avec le monogramme « CR ».

## 10. La qualité attendue

- Lighthouse mobile : au moins 95 en performance, accessibilité, bonnes pratiques et SEO.
- Contrastes WCAG AA, focus visible, navigation au clavier complète, zones cliquables d'au moins 44 px.
- Aucune requête vers un domaine tiers au chargement de la page, sauf Plausible si `plausibleDomain` est renseigné.
- Images en SVG ou en AVIF/WebP, avec des dimensions explicites.
- Le HTML de l'accueil doit faire moins de 60 Ko, hors polices.

## 11. Comment travailler

1. Lis la maquette, puis présente-moi en 10 lignes maximum ton plan : arborescence du projet, composants, points d'incertitude. Attends mon accord avant de coder.
2. Initialise le projet, `git init`, et fais un premier commit vide.
3. Construis composant par composant, avec un commit par étape logique.
4. Lance `npm run build`, `npm run test` et une vérification des types : tout doit passer sans erreur.
5. Fais 2 captures Playwright de `/`, à 390 px et à 1440 px, enregistre-les dans `docs/screenshots/` et compare-les à la maquette. Corrige les écarts visibles.
6. Écris un `README.md` en français qui explique :
   - comment changer un prix, une URL de paiement ou passer la fin du prix de lancement (`launchActive: false`) ;
   - comment lancer le site en local ;
   - comment déployer sur Vercel (GitHub → Vercel → domaine) ;
   - la liste de tous les `[PLACEHOLDERS]` restant à remplir.
7. Termine par un résumé de 10 lignes maximum : ce qui est fait, ce qui reste à remplir, et ce que je dois vérifier moi-même.

**Ce qui est interdit sans mon accord** : créer un compte sur un service, acheter un domaine, déployer en production, pousser vers un dépôt distant, installer un outil payant, ou inventer une information légale ou commerciale. En cas de doute sur un contenu, mets un `[PLACEHOLDER]` et signale-le.
