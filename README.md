# Verdesia — Greenouala

Site en **HTML, CSS et JavaScript**, sans framework et sans dépendance à installer.

## Ouvrir le site

Ouvrir `index.html` directement dans un navigateur, ou lancer `npm start`, puis accéder à **http://localhost:5173**. Node.js est nécessaire pour le serveur local.

## Pages

- `index.html` : accueil, thème et disposition Sauvaje.
- `amenager-mon-jardin.html` : introduction avec photo, trois engagements, quatre étapes illustrées en alternance et invitation finale à prendre contact sur WhatsApp ou demander un devis.
- `realisations.html` : structure Paysage M, 4 exemples affichés directement sans filtres, 2 photos par projet, diaporama indépendant et visionneuse.
- `devis.html` : grande photo de jardin avec titre superposé et formulaire simplifié, avec neuf prestations et envoi par WhatsApp.
- `contact.html` : grande photo de patio végétalisé avec titre superposé, téléphone, WhatsApp, formulaire de message, adresse et carte.

Toutes les pages partagent la barre flottante avec les liens horizontaux sur ordinateur (à partir de 1024 px) et le menu latéral sur mobile. Instagram/Facebook/WhatsApp restent accessibles dans le menu mobile et la barre des grands écrans. Le pied de page est minimaliste et les boutons WhatsApp/retour en haut restent flottants.

## Modifier puis reconstruire

Le bouton **FR / العربية** de la barre du haut bascule les cinq pages entre le français et la darija marocaine en caractères arabes. Le choix est conservé dans le navigateur et propagé dans les liens (`?lang=ar` ou `?lang=fr`). Le changement se fait sans rechargement : les champs remplis et les photos sélectionnées restent en place. Les messages WhatsApp suivent la langue choisie. `js/i18n.js` contient les traductions et `css/i18n.css` les adaptations de lecture de droite à gauche. Les noms des auteurs des avis et la marque restent inchangés.

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

Les autres photographies de démonstration, les projets et la base de présentation proviennent temporairement de [Sauvaje](https://www.sauvaje.fr/amenagement-jardins-exterieurs), de sa [page de devis](https://www.sauvaje.fr/contact) et de [Paysage M](https://paysagem.ma/projets/). Les références de projets et les visuels encore provisoires devront être remplacés par ceux du client avant publication commerciale. `assets/asset-sources.json` conserve la provenance des images et polices.

Les liens sociaux sont ceux fournis par le client : Instagram `greenouala`, Facebook `Greenouala`, WhatsApp `212660273737`. Aucun ancien contact de Sauvaje n’est conservé.

La version de présentation reste en `noindex,nofollow`, sans données structurées d’avis. La carte Google Maps et les liens sociaux utilisent des services externes ; les images, styles, polices et scripts de l’interface sont locaux.
# verdesia
