/* French / Moroccan Darija. Local switching preserves form values and photos. */
(() => {
  'use strict';
  const translations = {
    'Aller au contenu': 'دوز للمحتوى',
    'Verdesia — Accueil': 'فيرديسيا — الرئيسية',
    'Navigation principale': 'القائمة الرئيسية',
    'Accueil': 'الرئيسية',
    'Aménager mon jardin': 'نوجد حديقتي',
    'Nos réalisations': 'خدمتنا',
    'Nous contacter': 'تواصل معانا',
    'Demander un devis': 'طلب تقدير الثمن',
    'Ouvrir le menu': 'حلّ القائمة',
    'Menu de navigation': 'قائمة التصفح',
    'Fermer le menu': 'سدّ القائمة',
    'Création et aménagement de jardins à Bouskoura': 'كنصممو وكنوجدو الحدائق فبوسكورة',
    'Questions fréquentes': 'الأسئلة اللي كتجينا بزاف',
    'Quels types de jardins VERDESIA réalise-t-elle ?': 'شنو أنواع الحدائق اللي كتخدم فيرديسيا؟',
    'VERDESIA conçoit et réalise des jardins sur mesure : tropicaux, contemporains ou méditerranéens, adaptés à vos envies, à votre espace et à son environnement.': 'فيرديسيا كتصمم وكتوجد حدائق على القياس: استوائية، عصرية ولا متوسطية، على حساب الذوق ديالك، المساحة اللي عندك والجو ديالها.',
    'Pouvez-vous transformer un jardin déjà existant ?': 'واش تقدرو تبدلو ليا حديقة موجودة من قبل؟',
    'Oui. Nous intervenons pour réaménager et valoriser les jardins existants, renouveler les plantations, créer de nouveaux massifs et repenser les espaces extérieurs.': 'إييه. كنجدّدو وكننسّقو الحدائق اللي موجودة من قبل، كنبدلو النباتات، كنوجدو أحواض غرس جديدة وكنعاودو نرتبو المساحات الخارجية باش تولّي أحسن.',
    'Fournissez-vous également les plantes ?': 'واش كتوفرو حتى النباتات؟',
    'Oui. Grâce à notre pépinière, nous proposons une sélection de plantes et de végétaux adaptés à chaque projet d’aménagement.': 'إييه. عندنا المشتل ديالنا، وكنوفرو ليك نباتات مختارة على حساب كل مشروع وشنو مناسب ليه.',
    'Comment obtenir un devis pour mon jardin ?': 'كيفاش نقدر نعرف تقدير الثمن للحديقة ديالي؟',
    'Contactez-nous par téléphone ou WhatsApp. Après un premier échange et, si nécessaire, une visite sur place, nous vous proposons une solution adaptée à vos besoins et à votre budget.': 'عيّط لينا ولا كتب لينا فواتساب. من بعد أول هضرة بيناتنا، وإلا كان ضروري نزورو البلاصة، كنقترحو عليك حل مناسب للي محتاج وللميزانية ديالك.',
    'Dans quelles zones intervenez-vous ?': 'فاش من مناطق كتخدمو؟',
    'Nous intervenons principalement à Casablanca, Bouskoura et dans les secteurs environnants.': 'كنخدمو بالأساس فكازا، بوسكورة والمناطق اللي حداهم.',
    'Est-il possible de visiter un jardin réalisé par VERDESIA ?': 'واش نقدر نزور شي حديقة خدمتها فيرديسيا؟',
    'Oui, sur rendez-vous et sous réserve de l’accord de nos clients, nous pouvons organiser la visite de certaines de nos réalisations afin de vous faire découvrir notre savoir-faire.': 'إييه، بموعد من قبل وبموافقة الزبناء ديالنا، نقدرو ننظمو ليك زيارة لبعض الحدائق اللي خدمنا باش تشوف الخدمة ديالنا عن قرب.',
    'Un jardin pensé selon vos envies, votre espace et votre style.': 'حديقة على ذوقك، مناسبة للمساحة ديالك وللي كيعجبك.',
    'Parler de mon projet': 'نهضرو على مشروعي',
    'Chez': 'عند',
    ', nous créons et aménageons des jardins adaptés à vos envies et à votre espace.': '، كنصممو وكنوجدو حدائق على حساب رغبتك والمساحة اللي عندك.',
    'De la conception du projet au choix des plantes, en passant par l’aménagement et la réalisation, nous vous accompagnons à chaque étape pour créer un jardin agréable, harmonieux et facile à entretenir.': 'من التصميم واختيار النباتات حتى للتجهيز والغرس، كنبقاو معاك فكل مرحلة باش نوجدو ليك حديقة زوينة، متناسقة وساهلة فالعناية.',
    'Chaque jardin est réalisé avec soin, en accordant une attention particulière aux détails et au choix des végétaux.': 'كل حديقة كنخدموها بعناية، وكنهتمو بالتفاصيل وباختيار النباتات اللي تناسبها.',
    'L’expertise Verdesia': 'الخبرة ديال فيرديسيا',
    'Conception de jardins sur mesure': 'تصميم حدائق على القياس',
    'Un jardin pensé pour votre espace, votre architecture et vos envies.': 'حديقة مناسبة للمساحة ديالك، لشكل الدار وللي كيعجبك.',
    'Maîtrise du végétal': 'خبرة فالنباتات',
    'Des plantes choisies avec soin, adaptées à votre jardin et à son environnement.': 'كنختارو النباتات بعناية، على حساب حديقتك والجو اللي فيها.',
    'Réalisation et aménagement paysager': 'تجهيز وتنسيق الحدائق',
    'Des plantations aux finitions, chaque détail est réalisé avec soin.': 'من الغرس حتى لآخر لمسة، كنهتمو بكل تفصيلة.',
    'Un accompagnement de A à Z': 'معاك من اللول حتى للخر',
    'Un suivi attentif, des premières idées à la livraison de votre jardin.': 'كنتابعو معاك المشروع، من أول فكرة حتى نكملو ليك الحديقة.',
    'Contactez Verdesia pour votre projet': 'تواصل مع فيرديسيا على ود مشروعك',
    'Appelez-nous ou faites une demande de devis en ligne pour nous présenter votre projet et être recontacté rapidement par nos équipes.': 'عيّط لينا ولا عمّر طلب تقدير الثمن فالموقع، وقول لينا شنو بغيتي نديرو ليك. الفريق ديالنا يرجع يتواصل معاك فأقرب وقت.',
    'Votre projet, en 4 étapes': 'مشروعك فـ 4 مراحل',
    'Échange et découverte': 'نهضرو ونتعرفو على المشروع',
    ': Nous prenons le temps de comprendre vos envies, vos besoins et votre vision du jardin idéal. Cette première étape nous permet de définir les grandes orientations de votre projet.': ': كناخدو الوقت باش نفهمو شنو كيعجبك، شنو محتاج وكيفاش كتصوّر حديقتك. ومن هنا كنحددو معاك الخطوط الرئيسية ديال المشروع.',
    'Conception paysagère': 'تصميم الحديقة',
    ': Nous imaginons un aménagement sur mesure, en tenant compte de votre espace, de son architecture et des végétaux les mieux adaptés. Chaque détail est pensé pour créer un ensemble harmonieux.': ': كنوجدو تصميم على القياس، كنراعيو فيه المساحة، شكل الدار والنباتات المناسبة. كل تفصيلة كنحسبوها باش تجي الحديقة متناسقة.',
    'Préparation et réalisation': 'التحضير والخدمة',
    ': Après validation de votre projet, nous organisons et réalisons les travaux : préparation du terrain, aménagement des espaces, sélection et mise en place des végétaux.': ': من بعد ما نتافقو على المشروع، كننظمو الخدمة: نوجدو الأرض، نرتبو المساحات، نختارو النباتات ونغرسوها.',
    'Livraison de votre jardin': 'حديقتك واجدة',
    ': Nous apportons les dernières finitions pour vous livrer un espace extérieur soigné, harmonieux et prêt à prendre vie.': ': كنزيدو اللمسات الأخيرة باش نسلمو ليك حديقة نقية، متناسقة وواجدة تستمتع بها.',
    'Voir toutes nos réalisations': 'شوف الخدمة ديالنا كاملة',
    'Témoignages clients': 'آراء الزبناء',
    'Les expériences de nos clients': 'تجارب الزبناء ديالنا',
    'Service professionnel et qualité première des plantes.': 'خدمة احترافية ونباتات من النوع المزيان.',
    'Une excellente pépinière avec un très bon rapport qualité-prix. Les plantes sont belles et bien entretenues. Un grand merci à M. Salah qui est très compétent, accueillant et d’excellent conseil.': 'مشتل ممتاز، الجودة مزيانة والثمن مناسب. النباتات زوينة ومعتانيين بها مزيان. شكراً بزاف للسي صلاح، فاهم فخدمتو، كيستقبل الناس مزيان وكيعطي نصائح مفيدة.',
    'Professionnels avec des plantes de hautes qualités, très bonne expérience, je recommande vivement.': 'ناس محترفين والنباتات ديالهم من النوع المزيان. تجربة زوينة بزاف وكننصح بهم.',
    'Magnifique pépinière, plusieurs choix mais le plus agrealble c’est le gérant 👍': 'مشتل زوين بزاف، فيه اختيارات كثيرة، وأحسن حاجة فيه هي المعاملة ديال المول ديالو 👍',
    'Pépinière découverte par hasard sur FB, j’ai été agréablement surpris par le sérieux du propriétaire. Excellents conseils, très bon rapport qualité/prix. J’ai acheté une 20aine de plantes pour agrémenter mon jardin. Merci': 'لقيت هاد المشتل بالصدفة ففيسبوك، وعجباتني الجدية ديال المول ديالو. نصائح مزيانة، وجودة زوينة بثمن مناسب. خديت شي عشرين نبتة باش نزيّن حديقتي. شكراً.',
    'Tres belle réalisation avec Mr salah. Très serviable et attentif. Respect des délais et prestations à la hauteur.': 'خدمة زوينة بزاف مع السي صلاح. متعاون وكيسمع مزيان، احترم الوقت اللي تافقنا عليه والخدمة كانت فالمستوى.',
    'Témoignage précédent': 'الرأي اللي قبل',
    'Témoignage suivant': 'الرأي اللي من بعد',
    'Choisir un témoignage': 'اختار رأي من آراء الزبناء',
    'Mettre en pause le défilement automatique': 'وقف تبديل الآراء بوحدو',
    'Reprendre le défilement automatique': 'رجّع تبديل الآراء بوحدو',
    'Pause': 'وقف',
    'Reprendre': 'كمّل',
    'Voir les avis sur Google': 'شوف آراء الزبناء فـ Google',
    '(nouvel onglet)': '(فصفحة جديدة)',
    'sur WhatsApp (nouvel onglet)': 'فواتساب (فصفحة جديدة)',
    'Vous aussi, donnons vie à votre jardin': 'حتى نتا، نوجدو ليك الحديقة اللي بغيتي',
    'Parlons de vos envies et imaginons ensemble votre futur espace extérieur.': 'قول لينا شنو كيعجبك، ونوجدو مع بعضنا تصور للحديقة ديالك.',
    'Parlons de votre jardin': 'نهضرو على حديقتك',
    'abeille': 'نحلة',
    'Pépinière & aménagement paysager': 'مشتل وتصميم وتجهيز الحدائق',
    'Ouled Malek Hamri': 'ولاد مالك الحمري',
    'Bouskoura 27820, Maroc': 'بوسكورة 27820، المغرب',
    'Navigation du pied de page': 'روابط أسفل الصفحة',
    'Confidentialité': 'الخصوصية',
    'Mentions légales': 'المعلومات القانونية',
    'Nous trouver': 'فين تلقانا',
    'Revenir en haut de la page': 'رجع للفوق',
    'Contacter Verdesia sur WhatsApp': 'تواصل مع فيرديسيا فواتساب',
    'Écrivez-nous': 'كتب لينا',
    'Agrandissement d’une réalisation': 'شوف الخدمة بصورة كبيرة',
    'Fermer la photo': 'سدّ الصورة',
    'Photo précédente': 'الصورة اللي قبل',
    'Média précédent': 'الصورة ولا الفيديو اللي قبل',
    'Média suivant': 'الصورة ولا الفيديو اللي من بعد',
    'Glissez vers le haut pour voir la suite': 'طلع بصبعك للفوق باش تشوف الباقي',
    'Fermer': 'سدّ',
    'Votre demande est prête': 'الطلب ديالك واجد',
    'Vérifiez votre message, puis ouvrez WhatsApp pour le transmettre à notre équipe. Il vous restera à appuyer sur Envoyer dans WhatsApp.': 'راجع الرسالة ديالك، ومن بعد حلّ واتساب باش تصيفطها للفريق ديالنا. خاصك غير تضغط على إرسال فواتساب.',
    'Continuer sur WhatsApp': 'كمّل فواتساب',
    'Un jardin': 'حديقة',
    'à votre image.': 'على ذوقك.',
    'Création, réaménagement, plantations : donnons vie à un extérieur pensé pour vous.': 'تصميم، تجديد وغرس: نوجدو ليك حديقة مناسبة ليك ولرغبتك.',
    'Un premier échange pour partager vos envies.': 'أول هضرة بيناتنا باش نعرفو شنو بغيتي.',
    'Comment se déroule votre projet ?': 'كيفاش غادي يدوز المشروع ديالك؟',
    'Un espace à vivre. Un jardin à aimer.': 'بلاصة ترتاح فيها، وحديقة تعزّ عليك.',
    'Notre accompagnement pour votre jardin': 'كيفاش كنعاونوك توجد حديقتك',
    'Un jardin sur mesure': 'حديقة على القياس',
    'Votre espace, vos envies, notre créativité.': 'المساحة ديالك، الذوق ديالك والأفكار ديالنا.',
    'Le bon végétal': 'النبتة المناسبة',
    'Le savoir-faire de notre pépinière au service de votre jardin.': 'الخبرة ديال المشتل ديالنا فخدمة حديقتك.',
    'À vos côtés, de A à Z': 'معاك من اللول حتى للخر',
    'De la première idée aux dernières plantations.': 'من أول فكرة حتى لآخر نبتة.',
    'Comment ça se passe': 'كيفاش كنخدمو',
    'De votre idée': 'من الفكرة ديالك',
    'à votre jardin.': 'للحديقة اللي بغيتي.',
    'Quatre étapes, un accompagnement attentif.': 'أربع مراحل، وكنبقاو متابعين معاك كل خطوة.',
    'Échange & découverte': 'نهضرو ونتعرفو على المشروع',
    'Vos envies donnent le ton.': 'كنبداو من شنو كيعجبك.',
    'Vous nous présentez votre espace, vos besoins et votre vision du jardin idéal. Nous prenons le temps de vous écouter pour définir ensemble les premières idées.': 'كتوري لينا المساحة ديالك، وكتشرح لينا شنو محتاج وكيفاش بغيتي تكون حديقتك. كنسمعو ليك مزيان باش نخرجو مع بعضنا بأول الأفكار.',
    'Votre espace. Vos envies. Vos priorités.': 'المساحة ديالك. الرغبة ديالك. والأولويات ديالك.',
    'On imagine votre futur jardin.': 'كنتصورو معاك كيفاش غادي تولّي حديقتك.',
    'Nous imaginons un aménagement adapté à votre terrain et à votre architecture. Ambiance, circulation, choix des végétaux : chaque élément trouve sa place dans un ensemble harmonieux.': 'كنصممو حديقة مناسبة للأرض ديالك ولشكل الدار. الأجواء، الممرات واختيار النباتات: كل حاجة كتجي فبلاصتها باش يجي الكل متناسق.',
    'Un projet pensé pour vous, avant sa réalisation.': 'كنوجدو ليك تصور واضح للمشروع قبل ما نبداو الخدمة.',
    'Préparation & réalisation': 'التحضير والخدمة',
    'Place au vivant.': 'دابا وقت الغرس والخدمة.',
    'Après validation du projet, nous préparons le terrain, réalisons les aménagements et mettons en place les végétaux. Votre jardin prend forme, avec rigueur et souci du détail.': 'من بعد ما نتافقو على المشروع، كنوجدو الأرض، كنديرو التجهيزات وكنغرسو النباتات. حديقتك كتبدا تبان، بخدمة مضبوطة واهتمام بالتفاصيل.',
    'Le savoir-faire de la pépinière, sur le terrain.': 'خبرة المشتل كتبان فالخدمة ديال الميدان.',
    'Un jardin prêt à être vécu.': 'حديقتك واجدة باش تستمتع بها.',
    'Nous apportons les dernières finitions pour vous livrer un espace extérieur soigné et harmonieux. Un nouveau lieu pour vous retrouver, recevoir et profiter des beaux jours.': 'كنكملو اللمسات الأخيرة باش نسلمو ليك حديقة نقية ومتناسقة. بلاصة جديدة ترتاح فيها، تجمع فيها مع العائلة والأحباب وتستمتع بالجو الزوين.',
    'Votre projet devient votre quotidien.': 'الفكرة ديالك كتولي بلاصة كتعيش فيها كل نهار.',
    'Découvrir nos réalisations': 'شوف الخدمة ديالنا',
    'Faisons le premier pas': 'نبداو بأول خطوة',
    'Et si on commençait': 'آش بان ليك نبداو',
    'par votre jardin ?': 'بالحديقة ديالك؟',
    'Parlez-nous de votre espace et de vos envies.': 'قول لينا على المساحة ديالك وشنو بغيتي تدير فيها.',
    'Imaginons la suite ensemble.': 'ونوجدو مع بعضنا شنو غادي يجي من بعد.',
    'Parlons de votre projet': 'نهضرو على مشروعك',
    'Nos projets paysagers': 'مشاريع الحدائق ديالنا',
    'Beverly ville verte, Villa 77': 'بيفرلي المدينة الخضراء، فيلا 77',
    'Beverly ville verte, Villa 99': 'بيفرلي المدينة الخضراء، فيلا 99',
    'Ryad Bouskoura': 'رياض بوسكورة',
    'Berrechid': 'برشيد',
    'Bouskoura': 'بوسكورة',
    'Ville :': 'المدينة:',
    'Prestation :': 'الخدمة:',
    'Aménagement paysager.': 'تجهيز وتنسيق الحديقة.',
    'Plantation de palmiers Washingtonia et Syagrus romanzoffiana.': 'غرس نخيل الواشنطونيا والسياغروس رومانزوفيانا.',
    'Photos et vidéos du projet': 'تصاور وفيديوهات المشروع',
    'Choisir une photo ou une vidéo': 'اختار صورة ولا فيديو',
    'Agrandir la vidéo': 'كبّر الفيديو',
    'Présentez-nous votre projet en quelques mots et envoyez votre demande de devis sur WhatsApp grâce au formulaire ci-dessous.': 'قول لينا شنو بغيتي تدير فحديقتك، وعمّر هاد الاستمارة باش تصيفط لينا طلب تقدير الثمن فواتساب.',
    'Vous pouvez aussi nous appeler au +212 660 273737 pour échanger directement avec notre équipe.': 'وتقدر حتى تعيّط لينا على ‎+212 660 273737 باش تهضر مباشرة مع الفريق ديالنا.',
    'Formulaire de demande de devis': 'استمارة طلب تقدير الثمن',
    'Demande de devis': 'طلب تقدير الثمن',
    'Nom *': 'السمية *',
    'Nom': 'السمية',
    'Votre nom': 'السمية ديالك',
    'Ville *': 'المدينة *',
    'Ville': 'المدينة',
    'Votre ville': 'المدينة ديالك',
    'Adresse email (facultatif)': 'الإيميل (ماشي ضروري)',
    'Votre adresse email': 'الإيميل ديالك',
    'Numéro de téléphone *': 'نمرة التيليفون *',
    'Votre numéro de téléphone': 'نمرة التيليفون ديالك',
    'Téléphone': 'التيليفون',
    'Email': 'الإيميل',
    'Type de projet *': 'نوع المشروع *',
    'Type de projet': 'نوع المشروع',
    'Choisissez une prestation': 'اختار الخدمة اللي بغيتي',
    'Création et aménagement de jardins': 'تصميم وتجهيز الحدائق',
    'Réaménagement de jardins existants': 'تجديد وتنسيق حديقة موجودة',
    'Fourniture et vente de végétaux': 'توفير وبيع النباتات',
    'Plantation de végétaux': 'غرس النباتات',
    'Aménagement de terrasses et patios': 'تجهيز التيراسات والباحات الداخلية',
    'Installation de systèmes d’arrosage': 'تركيب نظام السقي',
    'Entretien des espaces verts': 'العناية بالحدائق والمساحات الخضرا',
    'Éclairage paysager et installation de luminaires': 'تجهيز إضاءة الحديقة وتركيب الضو',
    'Installation de pots et jardinières': 'تركيب القواري وأحواض النباتات',
    'Photos du jardin (facultatif)': 'تصاور الحديقة (ماشي ضروري)',
    'Ajoutez plusieurs photos, en une ou plusieurs fois. Jusqu’à 10 Mo par photo. Les photos seront incluses dans le partage si votre appareil le permet.': 'تقدر تزيد كثر من صورة، دفعة وحدة ولا على دفعات. كل صورة ما تفوتش 10 ميغا. التصاور غادي يتشاركو مع الطلب إلا كان الجهاز ديالك كيدعم هاد الخاصية.',
    'Ajouter d’autres photos': 'زيد تصاور خرين',
    'Envoyer par WhatsApp': 'صيفط فواتساب',
    'Les champs marqués d’un * sont obligatoires. Sans photo, votre demande s’ouvre directement dans WhatsApp. Avec des photos, choisissez WhatsApp puis le contact Verdesia (+212 660 273737) dans le menu de partage de votre appareil.': 'الخانات اللي فيها * ضروري تعمرها. بلا تصاور، الطلب ديالك كيتحل مباشرة فواتساب. إلا زدتي تصاور، اختار واتساب ومن بعد فيرديسيا (‎+212 660 273737) من قائمة المشاركة ديال الجهاز ديالك.',
    'Vos coordonnées seront utilisées uniquement pour répondre à votre demande.': 'المعلومات ديالك غادي نستعملوها غير باش نجاوبوك على الطلب ديالك.',
    'En savoir plus.': 'عرف كثر.',
    'Retrouvez-nous à Bouskoura': 'لقانا فبوسكورة',
    'Carte : Pépinière Greenouala Verdesia à Bouskoura': 'الخريطة: مشتل غرينوالا فيرديسيا فبوسكورة',
    'Pépinière Greenouala Bouskoura — Verdesia': 'مشتل غرينوالا بوسكورة — فيرديسيا',
    'Itinéraire': 'الطريق لعندنا',
    'Un projet de jardin, une question sur nos végétaux ou une visite à la pépinière ? Échangeons ensemble et donnons vie à vos envies.': 'باغي توجد حديقتك، عندك شي سؤال على النباتات ولا بغيتي تزور المشتل؟ تواصل معانا ونهضرو على اللي بغيتي.',
    'Coordonnées de Verdesia': 'معلومات التواصل مع فيرديسيا',
    'Appelez-nous': 'عيّط لينا',
    'Écrivez-nous sur WhatsApp': 'كتب لينا فواتساب',
    'Venez nous rencontrer': 'مرحبا بيك عندنا',
    'Laissez-nous un message': 'خلّي لينا رسالة',
    'Votre nom *': 'السمية ديالك *',
    'Votre téléphone *': 'نمرة التيليفون ديالك *',
    'Votre téléphone': 'نمرة التيليفون ديالك',
    'Votre email (facultatif)': 'الإيميل ديالك (ماشي ضروري)',
    'Votre email': 'الإيميل ديالك',
    'Votre sujet *': 'الموضوع *',
    'Choisir un sujet': 'اختار الموضوع',
    'Aménagement de jardin': 'تجهيز الحديقة',
    'Végétaux et pépinière': 'النباتات والمشتل',
    'Entretien de jardin': 'العناية بالحديقة',
    'Visiter la pépinière': 'زيارة المشتل',
    'Autre demande': 'طلب آخر',
    'Votre message *': 'الرسالة ديالك *',
    'Votre message': 'الرسالة ديالك',
    'Sujet': 'الموضوع',
    'Dites-nous comment nous pouvons vous aider…': 'قول لينا كيفاش نقدرو نعاونوك…',
    'J’accepte que mes coordonnées soient utilisées pour répondre à ma demande.': 'موافق تستعملو المعلومات ديالي باش تجاوبوني على الطلب ديالي.',
    'Envoyer mon message': 'صيفط الرسالة ديالي',
    'Votre message sera préparé pour WhatsApp. Vous pourrez le vérifier avant de l’envoyer.': 'الرسالة ديالك غادي توجد لواتساب، وتقدر تراجعها قبل ما تصيفطها.',
    'Pour préparer votre visite et confirmer nos horaires d’ouverture, contactez-nous au': 'باش توجد الزيارة ديالك وتتأكد من أوقات الخدمة، عيّط لينا على',
    'Bonjour Verdesia, je souhaite demander un devis.': 'السلام عليكم فيرديسيا، بغيت نعرف تقدير الثمن للمشروع ديالي.',
    'Bonjour Verdesia, je souhaite vous contacter.': 'السلام عليكم فيرديسيا، بغيت نتواصل معاكم.',
    'Bonjour Verdesia, je souhaite aménager mon jardin. Pouvons-nous parler de mon projet ?': 'السلام عليكم فيرديسيا، بغيت نوجد حديقتي. واش ممكن نهضرو على المشروع ديالي؟',
    'Bonjour Verdesia, je souhaite vous parler de mon projet de jardin.': 'السلام عليكم فيرديسيا، بغيت نهضر معاكم على مشروع الحديقة ديالي.',
    'Retirer': 'حيّد',
    'Aucune photo sélectionnée.': 'ما كاينة حتى صورة مختارة.',
    'Le partage n’a pas pu s’ouvrir. Vos photos sont conservées : réessayez depuis ce bouton.': 'ما تحلاتش المشاركة. التصاور ديالك باقين: عاود جرّب من هاد الزر.',
    'Votre navigateur ne permet pas de transmettre les photos à WhatsApp. Elles ne sont pas envoyées. Utilisez un appareil proposant le partage de fichiers, ou joignez-les dans WhatsApp après ouverture du message.': 'المتصفح ديالك ما كيدعمش تصيفط التصاور لواتساب، وما تصيفطو حتى تصاور. استعمل جهاز كيدعم مشاركة الملفات، ولا زيد التصاور فواتساب من بعد ما تتحل الرسالة.',
    'Les formulaires de devis et de contact préparent un message dans votre navigateur. Vous choisissez ensuite de le transmettre à notre équipe sur WhatsApp. Ce site ne conserve pas vos coordonnées. Google Maps et les réseaux sociaux sont des services externes soumis à leurs propres règles de confidentialité.': 'استمارات تقدير الثمن والتواصل كيوجدو الرسالة فالمتصفح ديالك، ومن بعد كتقدر تصيفطها للفريق ديالنا فواتساب. هاد الموقع ما كيحتافظش بالمعلومات الشخصية ديالك. خرائط Google ومواقع التواصل خدمات خارجية، وكل وحدة عندها قواعد الخصوصية ديالها.',
    'Pépinière Greenouala Bouskoura — Verdesia. Ouled Malek Hamri, Bouskoura 27820, Maroc. Téléphone : +212 660 273737. Les informations juridiques complètes de l’éditeur et de l’hébergeur seront ajoutées avant la publication définitive.': 'مشتل غرينوالا بوسكورة — فيرديسيا. ولاد مالك الحمري، بوسكورة 27820، المغرب. التيليفون: ‎+212 660 273737. المعلومات القانونية الكاملة ديال صاحب الموقع والاستضافة غادي تتزاد قبل النشر النهائي.',
    'Jardin méditerranéen avec piscine, terrasse et végétation luxuriante à l’ombre d’un olivier': 'حديقة متوسطية فيها بيسين وتيراس ونباتات خضرا تحت ظل الزيتونة',
    'Jardin verdoyant avec terrasse, arbres et allées en pierre au milieu de la pelouse': 'حديقة خضرا فيها تيراس وشجر وممرات بالحجر وسط العشب',
    'Un patio accueillant avec deux fauteuils entourés de végétation': 'رياض مريح فيه جوج كراسي دايرين بهم النباتات',
    'Plan paysager illustrant la disposition des végétaux, de la terrasse et des cheminements': 'تصميم كيبين توزيع النباتات والتيراس والممرات فالحديقة',
    'Des mains travaillent la terre au pied d’un jeune plant': 'يدين كيخدمو الأرض حدا نبتة صغيرة',
    'Un jardin méditerranéen aménagé autour d’une piscine et d’une terrasse ombragée': 'حديقة متوسطية منسقة حدا بيسين وتيراس فيه الظل',
    'Terrasse en bois entourée d’arbres et de plantations dans un jardin paysager': 'تيراس بالخشب دايرين به الشجر والنباتات وسط حديقة منسقة',
    'Patio luxuriant avec des plantes, un miroir en arche et un salon de jardin': 'رياض عامر بالنباتات، فيه مراية مقوسة وجلسة ديال الحديقة',
    'Réalisation paysagère': 'خدمة تنسيق الحديقة',
    'carrousel': 'عارض الصور',
    'diapositive': 'صورة من العرض',
    'témoignage': 'رأي زبون',
    'Témoignages clients — Verdesia': 'آراء الزبناء — فيرديسيا',
    'Témoignages clients (traduits)': 'آراء الزبناء (مترجمة)',
  };
  const normalize = value => value.trim().replace(/\s+/g, ' ');
  const reverse = new Map(Object.entries(translations).map(([fr, ar]) => [ar, fr]));
  const staticLocales = document.documentElement.getAttribute?.('data-static-locales') === 'true';
  let language = 'fr';
  try { language = new URL(location.href).searchParams.get('lang') || (staticLocales && new URL(location.href).pathname.startsWith('/ar/') ? 'ar' : localStorage.getItem('verdesia-language')) || 'fr'; } catch {}
  language = language === 'ar' ? 'ar' : 'fr';
  document.documentElement.lang = language === 'ar' ? 'ar-MA' : 'fr';
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

  function arabic(source) {
    if (translations[source]) return translations[source];
    if (source.endsWith(' — Verdesia')) return `${arabic(source.slice(0, -11))} — فيرديسيا`;
    let match;
    if ((match = /^(Instagram|Facebook|Whatsapp) \(nouvel onglet\)$/.exec(source))) return `${({ Instagram: 'إنستغرام', Facebook: 'فيسبوك', Whatsapp: 'واتساب' })[match[1]]} (فصفحة جديدة)`;
    if ((match = /^(\d+) photos(?: · (\d+) vidéo\(s\))?$/.exec(source))) return `${match[1]} تصاور${match[2] ? ` · ${match[2]} فيديو` : ''}`;
    if ((match = /^(Photo|Vidéo) (\d+) sur (\d+)$/.exec(source))) return `${match[1] === 'Photo' ? 'الصورة' : 'الفيديو'} ${match[2]} من ${match[3]}`;
    if ((match = /^Lire le témoignage de (.+)$/.exec(source))) return `قرا الرأي ديال ${match[1]}`;
    if ((match = /^Témoignage (\d+) sur (\d+) — (.+)$/.exec(source))) return `الرأي ${match[1]} من ${match[2]} — ${match[3]}`;
    if ((match = /^(\d+) sur (\d+)$/.exec(source))) return `${match[1]} من ${match[2]}`;
    if ((match = /^(\d+) photo\(s\) sélectionnée\(s\)\.(.*)$/.exec(source))) return `${match[1]} تصاور مختارة.${arabic(match[2].trim()) ? ` ${arabic(match[2].trim())}` : ''}`;
    if ((match = /^Fichiers non ajoutés : (.+)\. Choisissez des images de 10 Mo maximum chacune\.$/.exec(source))) return `هاد الملفات ما تزادوش: ${match[1]}. اختار تصاور ما يفوتوش 10 ميغا للصورة.`;
    if ((match = /^(Retirer|Photo de votre jardin) (?:[:：] )?(.+)$/.exec(source))) return `${match[1] === 'Retirer' ? 'حيّد' : 'صورة ديال حديقتك:'} ${match[2]}`;
    if ((match = /^(.+) — (aménagement paysager|détail des plantations) à (.+)$/.exec(source))) return `${arabic(match[1])} — ${match[2] === 'aménagement paysager' ? 'تجهيز الحديقة' : 'تفاصيل الغرس'} فـ ${arabic(match[3])}`;
    if ((match = /^(Agrandir : )?(.+) — (.+), (photo|vidéo) (\d+)$/.exec(source))) return `${match[1] ? 'كبّر: ' : ''}${arabic(match[2])} — ${arabic(match[3])}، ${match[4] === 'photo' ? 'الصورة' : 'الفيديو'} ${match[5]}`;
    if (source.startsWith('© ')) return source.replace('Verdesia', 'فيرديسيا');
    if (source.startsWith('Pépinière Greenouala Verdesia à Bouskoura :')) return 'مشتل غرينوالا فيرديسيا فبوسكورة: تصميم وتجهيز الحدائق وبيع النباتات. تواصل معانا على ‎+212 660 273737.';
    return source;
  }
  function t(value, targetLanguage = language) {
    const clean = normalize(String(value));
    const original = reverse.get(clean) || clean;
    if (targetLanguage === 'fr') return original;
    const result = arabic(original);
    if (result !== original) reverse.set(result, original);
    return result;
  }
  window.verdesiaI18n = { t, get language() { return language; } };
  const textRecords = new WeakMap();
  const attributeRecords = new WeakMap();
  function localizedPath(url) {
    const filename = url.pathname.split('/').pop() || 'index.html';
    url.pathname = (language === 'ar' ? '/ar/' : '/') + (filename === 'index.html' ? '' : filename);
    url.searchParams.delete('lang');
    return url;
  }
  function syncLocation() {
    try {
      const url = new URL(location.href);
      if (staticLocales) localizedPath(url);
      else url.searchParams.set('lang', language);
      history.replaceState(null, '', url);
      if (staticLocales) {
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.href = 'https://verdesia.ma' + url.pathname;
        const ogURL = document.querySelector('meta[property="og:url"]');
        if (ogURL) ogURL.setAttribute('content', 'https://verdesia.ma' + url.pathname);
      }
    } catch {}
  }
  function translateText(node) {
    if (!node.textContent.trim() || node.parentElement?.closest('script, style, [data-no-translate], #request-summary, .garden-photo-preview figcaption')) return;
    const current = node.textContent;
    let record = textRecords.get(node);
    if (!record || current !== record.last) record = { source: reverse.get(normalize(current)) || normalize(current) };
    const translated = t(record.source);
    const result = current.replace(/\S[\s\S]*\S|\S/, () => translated);
    record.last = result;
    textRecords.set(node, record);
    if (current !== result) node.textContent = result;
  }
  function translateElement(element) {
    if (element.closest('[data-no-translate]')) return;
    let records = attributeRecords.get(element);
    if (!records) { records = new Map(); attributeRecords.set(element, records); }
    for (const name of ['aria-label', 'aria-roledescription', 'placeholder', 'alt', 'title', 'data-caption']) {
      if (!element.hasAttribute(name)) continue;
      const current = element.getAttribute(name);
      let record = records.get(name);
      if (!record || record.last !== current) record = { source: reverse.get(normalize(current)) || current };
      record.last = t(record.source);
      records.set(name, record);
      if (record.last !== current) element.setAttribute(name, record.last);
    }
    if (element.matches('meta[name="description"]')) {
      const content = element.getAttribute('content');
      let record = records.get('content');
      if (!record) { record = { source: content }; records.set('content', record); }
      const result = t(record.source);
      if (content !== result) element.setAttribute('content', result);
    }
    if (element.matches('iframe[src*="maps.google.com"]')) {
      const url = new URL(element.src);
      if (url.searchParams.get('hl') !== language) { url.searchParams.set('hl', language); element.src = url.href; }
    }
    if (element.matches('a[href]')) {
      const href = element.getAttribute('href');
      if (!href || /^(#|tel:|mailto:)/.test(href)) return;
      let url;
      try { url = new URL(href, location.href); } catch { return; }
      if (url.hostname === 'wa.me' && url.searchParams.has('text')) {
        const message = url.searchParams.get('text');
        const translated = t(message);
        if (translated !== message) { url.searchParams.set('text', translated); element.href = url.href; }
      } else if (!/^[a-z]+:/i.test(href) && (/\.html$/.test(url.pathname) || (staticLocales && ['/', '/ar/'].includes(url.pathname)))) {
        if (staticLocales) {
          localizedPath(url);
          const target = url.pathname + url.search + url.hash;
          if (href !== target) element.setAttribute('href', target);
        } else if (url.searchParams.get('lang') !== language) { url.searchParams.set('lang', language); element.setAttribute('href', url.pathname.split('/').pop() + url.search + url.hash); }
      }
    }
  }
  function translateTree(root) {
    if (root.nodeType === 3) { translateText(root); return; }
    if (root.nodeType === 1) translateElement(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (walker.currentNode.nodeType === 3) translateText(walker.currentNode);
      else translateElement(walker.currentNode);
    }
  }
  function updateToggle() {
    document.querySelectorAll('[data-language-toggle]').forEach(button => {
      button.setAttribute('aria-pressed', String(language === 'ar'));
      button.setAttribute('aria-label', language === 'ar' ? 'Passer en français' : 'بدّل للدارجة المغربية');
      button.querySelector('[lang="fr"]').classList.toggle('active-language', language === 'fr');
      button.querySelector('[lang="ar-MA"]').classList.toggle('active-language', language === 'ar');
    });
  }
  function setLanguage(next) {
    language = next;
    document.documentElement.lang = language === 'ar' ? 'ar-MA' : 'fr';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('verdesia-language', language); } catch {}
    syncLocation();
    translateTree(document.documentElement);
    updateToggle();
    document.dispatchEvent(new Event('verdesia:languagechange'));
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-language-toggle]').forEach(button => button.addEventListener('click', () => setLanguage(language === 'fr' ? 'ar' : 'fr')));
    translateTree(document.documentElement);
    updateToggle();
    if (staticLocales) syncLocation();
    const observer = new MutationObserver(records => {
      records.forEach(record => {
        if (record.type === 'characterData') translateText(record.target);
        else if (record.type === 'attributes') translateElement(record.target);
        else record.addedNodes.forEach(translateTree);
      });
    });
    observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'aria-roledescription', 'placeholder', 'alt', 'title', 'data-caption', 'href'] });
  });
})();
