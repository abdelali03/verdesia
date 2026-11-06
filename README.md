# Verdesia — Greenouala

Site en **HTML, CSS et JavaScript**, sans framework et sans dépendance à installer.

## Ouvrir le site

Ouvrir `index.html` directement dans un navigateur, ou lancer `npm start`, puis accéder à **http://localhost:5173**. Node.js est nécessaire pour le serveur local.

## Pages

- `index.html` : accueil, thème et disposition Sauvaje.
- `amenager-mon-jardin.html` : même contenu que l’accueil, comme demandé.
- `realisations.html` : structure Paysage M, 26 projets, trois catégories plus « Tous les projets », 90 photos, diaporama indépendant par projet et visionneuse.
- `devis.html` : présentation et champs du formulaire Sauvaje, adaptés aux coordonnées de Greenouala.
- `contact.html` : téléphone, WhatsApp, formulaire de message, adresse et carte.

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

Les champs sont validés dans le navigateur. La société n’est obligatoire que pour les clients professionnels. La demande est ensuite présentée dans une fenêtre de vérification. Le bouton « Continuer sur WhatsApp » ouvre un message prérempli au **+212 660 273737** ; le visiteur doit encore appuyer sur Envoyer dans WhatsApp.

Aucune demande n’est envoyée à Sauvaje, aucun faux message de réception n’est affiché, et aucune coordonnée personnelle n’est stockée sur le site. L’envoi automatique par email nécessiterait un service de formulaire ou un serveur à configurer.

## Localisation vérifiée

La [fiche Google Maps fournie](https://maps.app.goo.gl/BjXiTvoBLETxqw9b9?g_st=aw) correspond à **Pépinière Greenouala Bouskoura (Verdésia)** :

- Adresse : Ouled Malek Hamri, Bouskoura 27820, Maroc.
- Position WGS84 : **33.4883929, -7.6462018**.
- Téléphone : **+212 660 273737**.
- Identifiant de lieu : `ChIJa7a4KAAtpg0RKznhhT3B-5Q`.
- Code plus : F9Q3+9G Bouskoura.

Carte et itinéraires utilisent cette fiche, sans clé d’API. Les horaires ne sont pas figés, car la fiche consultée comprenait une fermeture exceptionnelle de jour férié.

## Références et contenus provisoires

À la demande du client, les contenus et photographies de démonstration proviennent temporairement de [Sauvaje](https://www.sauvaje.fr/amenagement-jardins-exterieurs), de sa [page de devis](https://www.sauvaje.fr/contact) et de [Paysage M](https://paysagem.ma/projets/). Les projets, témoignages et images devront être remplacés par les contenus du client avant publication commerciale. `assets/asset-sources.json` conserve la provenance des images et polices.

Les liens sociaux sont ceux fournis par le client : Instagram `greenouala`, Facebook `Greenouala`, WhatsApp `212660273737`. Aucun ancien contact de Sauvaje n’est conservé.

La version de présentation reste en `noindex,nofollow`, sans données structurées d’avis. La carte Google Maps et les liens sociaux utilisent des services externes ; les images, styles, polices et scripts de l’interface sont locaux.
# verdesia
