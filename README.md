# Verdesia — Greenouala

Site en **HTML, CSS et JavaScript**, sans framework ni dépendance exécutée chez le visiteur. Trois outils de construction uniquement (`sharp`, `esbuild`, `linkedom`) génèrent le dossier statique optimisé `dist/`.

## Ouvrir le site

Pour consulter les sources sans optimisation, ouvrir `index.html` ou lancer `npm start` (**http://localhost:5173**).

Pour tester la version optimisée avec Node.js 22 : `npm ci`, `npm run build`, `npm run check`, `npm run check:dist`, puis `npm run preview` (**http://localhost:5180**). Les pages de `dist/` utilisent des URL absolues : les consulter avec ce serveur plutôt qu’en ouvrant les fichiers directement.

`npm run build` produit par défaut une prévisualisation non indexable. `npm run build:production` prépare localement un artefact indexable, sans le déployer. Netlify utilise automatiquement ce mode uniquement dans le contexte de production ; les branches et Deploy Previews restent non indexables. Le site ne sera publié qu’après une action de déploiement distincte.

## Pages

- `index.html` : accueil, thème et disposition Sauvaje.
- `amenager-mon-jardin.html` : introduction avec photo, trois engagements, quatre étapes illustrées en alternance et invitation finale à prendre contact sur WhatsApp ou demander un devis.
- `realisations.html` : les quatre projets du client, avec 30 photos et 3 vidéos, carrousels indépendants et visionneuse.
- `devis.html` : grande photo de jardin avec titre superposé et formulaire simplifié, avec neuf prestations et envoi par WhatsApp.
- `contact.html` : grande photo de patio végétalisé avec titre superposé, téléphone, WhatsApp, formulaire de message, adresse et carte.

Toutes les pages partagent la barre flottante avec les liens horizontaux sur ordinateur (à partir de 1024 px) et le menu latéral sur mobile. Instagram/Facebook/WhatsApp restent accessibles dans le menu mobile et la barre des grands écrans. Le pied de page est minimaliste et les boutons WhatsApp/retour en haut restent flottants.

## Modifier puis reconstruire

Le bouton **FR / العربية** de la barre du haut bascule les cinq pages entre le français et la darija marocaine en caractères arabes. Le choix est conservé dans le navigateur et propagé dans les liens (`?lang=ar` ou `?lang=fr` dans les sources ; `/ar/` dans la livraison optimisée). Le changement se fait sans rechargement : les champs remplis et les photos sélectionnées restent en place. Les messages WhatsApp suivent la langue choisie. `js/i18n.js` contient les traductions et `css/i18n.css` les adaptations de lecture de droite à gauche. Les noms des auteurs des avis et la marque restent inchangés.

Les pages HTML complètes sont générées à partir de sources faciles à modifier :

- `data/site.json` : téléphone, réseaux sociaux, adresse et position GPS.
- `data/projects.json` : textes, catégories et photographies des projets.
- `pages/accueil.html` : contenu de l’accueil.
- `pages/jardin.html` : contenu de « Aménager mon jardin », parcours illustré et appels à l’action.
- `pages/hero-devis.html` et `pages/form-devis.html` : introduction et formulaire du devis.
- `scripts/build-pages.cjs` : barre, menu, pied de page et composition des pages Contact et Réalisations.
- `css/reference.css` : base visuelle Sauvaje et polices locales.
- `css/styles.css` et `css/pages.css` : adaptations Verdesia et nouvelles pages.
- `js/main.js` : navigation, galerie, visionneuse et témoignages.
- `js/pages.js` : projets, filtres, formulaires et retour en haut.

Après une modification de contenu ou de structure, lancer `npm run build`. Pour vérifier les fichiers, liens, coordonnées et scripts : `npm run check`.

## Livraison optimisée

Les sources, styles et originaux sont conservés. `scripts/build.cjs` génère des variantes responsives sans recadrage : WebP sans perte lorsque le fichier est plus petit, ou original lorsque c’est plus efficace. Les tailles intermédiaires plus lourdes que l’original sont écartées. Le PNG conservé sous le nom historique `jardin-mediterraneen.jpg` n’est plus livré avec ce mauvais type : ses variantes publiées possèdent l’extension correspondant à leur véritable format.

Les grandes couvertures prioritaires conservent leur résolution native : leur recadrage dépend de la hauteur du texte, et une sélection basée seulement sur la largeur du téléphone pourrait rendre leur portion visible moins nette. Leur optimisation repose donc sur l’encodage sans perte. Les autres images utilisent leurs variantes responsives.

Les fichiers publiés portent une empreinte de contenu pour permettre un cache navigateur d’un an sans conserver une ancienne version lors d’une mise à jour. Les quatre feuilles CSS sont regroupées et minifiées, avec conservation de toutes les règles et des polices. Les scripts sont minifiés et différés. Les vidéos sont conservées sans réencodage, avec lecture à la visibilité et `preload="none"`.

Les dix pages FR/AR sont présentes dans le HTML statique, avec canoniques, liens de langue, métadonnées sociales, sitemap et données d’entreprise vérifiées. Le bouton de langue conserve le changement sans rechargement et les données du formulaire. Netlify publie uniquement `dist/` selon `netlify.toml` ; les sources, caches, originaux inutilisés et outils de construction ne sont pas publiés.

Vérifications : `npm run check:dist` contrôle les routes, les ressources, l’environnement d’indexation et les comportements des scripts construits. `npm run check:images` compare les pixels décodés des variantes à ceux des sources à la même taille de sortie. `node scripts/measure-transfer.cjs` produit une estimation de bande passante ; il ne remplace pas une mesure réseau dans un navigateur. Les rapports et le cache d’images de construction sont dans `.preview/`, ignoré par Git.

## Fonctionnement des formulaires

Les champs sont validés dans le navigateur.

**Devis :** seuls le nom, la ville, le téléphone et le type de projet sont obligatoires. L’adresse email et les photos du jardin sont facultatives. Plusieurs photos peuvent être ajoutées en une ou plusieurs sélections (10 Mo maximum chacune), avec aperçu et suppression individuelle. La soumission ouvre directement WhatsApp pour un message sans photo, ou le menu de partage natif avec toutes les photos retenues lorsque l’appareil le permet. Aucun récapitulatif de confirmation supplémentaire n’est présenté sur le site. Dans le partage natif, le visiteur choisit WhatsApp et le contact Verdesia (**+212 660 273737**) ; l’envoi final reste dans WhatsApp. Si le navigateur ne permet pas le partage de fichiers, le texte s’ouvre dans WhatsApp et le formulaire indique explicitement que les photos n’ont pas été transmises. Un lien WhatsApp ne peut pas joindre automatiquement des fichiers ; un envoi entièrement automatique nécessiterait une intégration serveur à l’API WhatsApp Business. Les champs facultatifs vides sont omis du message.

**Contact :** le message reste présenté dans une fenêtre de vérification avant d’ouvrir WhatsApp au **+212 660 273737** ; le visiteur doit encore appuyer sur Envoyer dans WhatsApp.

Aucune demande n’est envoyée à Sauvaje et aucune coordonnée personnelle n’est conservée sur ce site. Les vérifications utilisent des données fictives et ne transmettent aucun message.

## Localisation vérifiée

La [fiche Google Maps fournie](https://maps.app.goo.gl/BjXiTvoBLETxqw9b9?g_st=aw) correspond à **Pépinière Greenouala Bouskoura (Verdésia)** :

- Adresse : Ouled Malek Hamri, Bouskoura 27820, Maroc.
- Position WGS84 : **33.4883929, -7.6462018**.
- Téléphone : **+212 660 273737**.
- Identifiant de lieu : `ChIJa7a4KAAtpg0RKznhhT3B-5Q`.
- Code plus : F9Q3+9G Bouskoura.

Carte et itinéraires utilisent cette fiche, sans clé d’API. Les horaires ne sont pas figés, car la fiche consultée comprenait une fermeture exceptionnelle de jour férié.

## Références et contenus provisoires

Le titre, les textes de présentation, les quatre étapes et les six témoignages ont été fournis par le client et intégrés dans `pages/accueil.html`. L’introduction commence désormais par « Chez VERDESIA, nous créons et aménageons des jardins adaptés à vos envies et à votre espace. ». La couverture choisie par le client est le jardin méditerranéen avec piscine, enregistré dans `assets/images/jardin-mediterraneen.jpg` ; sa source est consignée dans `assets/asset-sources.json`. L’ancienne photographie de l’oiseau de paradis reste disponible dans les assets. Le témoignage de Mohammed Magroud, envoyé deux fois, n’apparaît qu’une fois.

La section expertise présente quatre icônes SVG au trait fin : crayon et règle, jeune pousse, pelle et fiche de suivi. Chaque icône accompagne un titre de prestation et une courte phrase. La composition comporte deux colonnes sur ordinateur et une colonne sur mobile, sur fond ivoire. Les liens du menu mobile sont présentés sans chevrons.

Les quatre projets et leurs 33 médias proviennent des dossiers du client. Certaines photographies de présentation et la base visuelle proviennent de [Sauvaje](https://www.sauvaje.fr/amenagement-jardins-exterieurs), de sa [page de devis](https://www.sauvaje.fr/contact) et de [Paysage M](https://paysagem.ma/projets/). Vérifier les droits d’utilisation de ces références avant publication commerciale. `assets/asset-sources.json` conserve la provenance des images et polices.

Les liens sociaux sont ceux fournis par le client : Instagram `greenouala`, Facebook `Greenouala`, WhatsApp `212660273737`. Aucun ancien contact de Sauvaje n’est conservé.

Les sources et les constructions de prévisualisation restent en `noindex,nofollow`. La construction de production autorise l’indexation et ajoute les données structurées d’entreprise, sans données structurées d’avis. La carte Google Maps et les liens sociaux utilisent des services externes ; les images, styles, polices et scripts de l’interface sont locaux.
