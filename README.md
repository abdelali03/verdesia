# Verdesia — Greenouala

Site en **HTML, CSS et JavaScript**, sans framework et sans dépendance à installer.

## Ouvrir le site

Ouvrir `index.html` directement dans un navigateur, ou lancer `npm start`, puis accéder à **http://localhost:5173**. Node.js est nécessaire pour le serveur local.

## Pages

- `index.html` : accueil, thème et disposition Sauvaje.
- `amenager-mon-jardin.html` : même contenu que l’accueil, comme demandé.
- `realisations.html` : structure Paysage M, 4 exemples affichés directement sans filtres, 2 photos par projet, diaporama indépendant et visionneuse.
- `devis.html` : grande photo de jardin avec titre superposé et formulaire simplifié, avec neuf prestations et envoi par WhatsApp.
- `contact.html` : grande photo de patio végétalisé avec titre superposé, téléphone, WhatsApp, formulaire de message, adresse et carte.

Toutes les pages partagent la barre flottante, le menu latéral avec Instagram/Facebook/WhatsApp, un pied de page minimaliste et les boutons flottants WhatsApp/retour en haut.

## Modifier puis reconstruire

Les pages HTML complètes sont générées à partir de sources faciles à modifier :

- `data/site.json` : téléphone, réseaux sociaux, adresse et position GPS.
- `data/projects.json` : textes, catégories et photographies des projets.
- `pages/accueil.html` : contenu commun à l’accueil et à « Aménager mon jardin ».
- `pages/hero-devis.html` et `pages/form-devis.html` : introduction et formulaire du devis.
- `scripts/build-pages.cjs` : barre, menu, pied de page et composition des pages Contact et Réalisations.
- `css/reference.css` : base visuelle Sauvaje et polices locales.
- `css/styles.css` et `css/pages.css` : adaptations Verdesia et nouvelles pages.
- `js/main.js` : navigation, galerie, visionneuse et témoignages.
- `js/pages.js` : projets, filtres, formulaires et retour en haut.

Après une modification de contenu ou de structure, lancer `npm run build`. Pour vérifier les fichiers, liens, coordonnées et scripts : `npm run check`.

## Fonctionnement des formulaires

Les champs sont validés dans le navigateur.

**Devis :** seuls le nom, le prénom, la ville, le téléphone et la prestation sont obligatoires. L’adresse email et la description sont facultatives. Le choix de prestation comprend les neuf services transmis par le client. Un récapitulatif prépare le message pour WhatsApp au **+212 660 273737** ; le visiteur doit encore appuyer sur Envoyer dans WhatsApp. Les champs facultatifs vides sont omis du message. L’envoi par email a été retiré.

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

Le titre, les textes de présentation et d’expertise, les quatre étapes, les six témoignages et la photo principale de l’oiseau de paradis ont été fournis par le client et intégrés dans `pages/accueil.html`. La photo se trouve dans `assets/images/oiseau-de-paradis.jpg`. Le témoignage de Mohammed Magroud, envoyé deux fois, n’apparaît qu’une fois.

Les autres photographies de démonstration, les projets et la base de présentation proviennent temporairement de [Sauvaje](https://www.sauvaje.fr/amenagement-jardins-exterieurs), de sa [page de devis](https://www.sauvaje.fr/contact) et de [Paysage M](https://paysagem.ma/projets/). Les références de projets et les visuels encore provisoires devront être remplacés par ceux du client avant publication commerciale. `assets/asset-sources.json` conserve la provenance des images et polices.

Les liens sociaux sont ceux fournis par le client : Instagram `greenouala`, Facebook `Greenouala`, WhatsApp `212660273737`. Aucun ancien contact de Sauvaje n’est conservé.

La version de présentation reste en `noindex,nofollow`, sans données structurées d’avis. La carte Google Maps et les liens sociaux utilisent des services externes ; les images, styles, polices et scripts de l’interface sont locaux.
# verdesia
