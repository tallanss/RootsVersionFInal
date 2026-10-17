// ============================================================
// Pages événementielles SEO (mariage, entreprise, anniversaire…)
// ------------------------------------------------------------
// Même principe que src/data/cities.js : contenu statique, rendu côté
// serveur (prerender) pour un SEO optimal. Titres/méta/mots-clés issus du
// « Référentiel SEO » du plan d'action. Pour modifier le texte, éditer ce
// fichier (ou demander à Allan). Chaque clé = le slug d'URL de la page.
// ============================================================

export const EVENTS = {
  'photobooth-mariage': {
    name: 'Mariage',
    slug: 'photobooth-mariage',
    icon: 'heart',
    keyword: 'photobooth mariage',
    keywordsSecondary: 'location photobooth mariage, photomaton mariage, animation photobooth mariage, borne photo mariage, prix photobooth mariage',
    seoTitle: 'Photobooth Mariage en Seine-Maritime — Animation & Location | PhotoRoots',
    seoDesc: "Sublimez votre mariage au Havre, à Rouen ou à Dieppe avec notre photobooth premium : impressions instantanées, personnalisation et ambiance garantie. Devis gratuit sous 24h.",
    heroBadge: 'Animation mariage',
    heroTitle: 'Photobooth pour votre Mariage',
    heroHighlight: 'en Seine-Maritime',
    heroSubtitle: "Une borne photo premium pour immortaliser votre mariage au Havre, à Rouen, à Dieppe et partout en Normandie. Impressions instantanées, personnalisation complète et fou rire garantis. Devis gratuit sous 24h.",
    intro: [
      "Le mariage est le jour de tous les souvenirs — et le photobooth est l'animation qui fait sourire tous vos invités, des enfants aux grands-parents. Chez PhotoRoots, nous installons une borne photo haut de gamme au cœur de votre réception : vos invités repartent avec un tirage de qualité professionnelle en quelques secondes, et vous conservez l'intégralité des photos dans une galerie en ligne.",
      "Nous intervenons dans toute la Seine-Maritime : châteaux, domaines, salles de réception et lieux d'exception du Havre, de Rouen, de Dieppe et de leurs environs. Livraison, installation et assistance pendant la soirée sont incluses — vous n'avez rien à gérer, vous profitez simplement de votre journée.",
      "Fonds personnalisés aux couleurs de votre mariage, cadre d'impression sur mesure avec vos prénoms et votre date, accessoires élégants ou décalés : tout est adaptable pour coller à l'ambiance que vous imaginez, du mariage bohème au mariage le plus chic.",
    ],
    benefits: [
      'Tirages instantanés de qualité professionnelle, illimités selon la formule choisie.',
      'Cadre et fond personnalisés avec vos prénoms, votre date et votre thème.',
      'Livre d\'or photo : chaque invité laisse un cliché et un petit mot pour les mariés.',
      'Galerie en ligne privée pour retrouver et télécharger toutes les photos après le mariage.',
      'Livraison, installation et technicien sur place inclus — zéro stress le jour J.',
      'Plusieurs bornes au choix : photobooth classique, Miroir Booth grand format ou Photobooth 360.',
    ],
    faqs: [
      { q: 'Combien de temps installez-vous le photobooth pour un mariage ?', a: "La durée de location s'adapte à votre soirée : de quelques heures pour la formule découverte jusqu'à une présence sur l'ensemble de la réception. Nous arrivons en avance pour installer et tester le matériel avant l'arrivée de vos invités." },
      { q: 'Peut-on personnaliser le cadre des photos à nos couleurs de mariage ?', a: "Oui, totalement. Nous créons un cadre d'impression sur mesure avec vos prénoms, votre date et le thème de votre mariage, ainsi que des fonds assortis à votre décoration." },
      { q: 'Intervenez-vous dans les châteaux et domaines autour du Havre et de Rouen ?', a: "Absolument. Nous nous déplaçons dans tous les lieux de réception de Seine-Maritime — châteaux, domaines, salles et lieux atypiques — au Havre, à Rouen, à Dieppe et dans un large rayon autour, livraison et installation comprises." },
      { q: 'Récupère-t-on toutes les photos du mariage ?', a: "Oui. En plus des tirages instantanés remis à vos invités, vous recevez l'intégralité des photos en haute définition dans une galerie en ligne privée, à télécharger et partager autant que vous le souhaitez." },
    ],
  },

  'photobooth-entreprise': {
    name: 'Entreprise',
    slug: 'photobooth-entreprise',
    icon: 'briefcase',
    keyword: 'photobooth entreprise',
    keywordsSecondary: 'photobooth séminaire, animation team building photobooth, photobooth soirée entreprise, location photobooth professionnel',
    seoTitle: 'Photobooth Entreprise en Seine-Maritime — Séminaires & Team Building | PhotoRoots',
    seoDesc: "Animez vos séminaires, soirées d'entreprise et événements de team building en Seine-Maritime avec un photobooth personnalisable à vos couleurs. Devis sous 24h.",
    heroBadge: 'Événements professionnels',
    heroTitle: 'Photobooth Entreprise',
    heroHighlight: 'Séminaires & Team Building',
    heroSubtitle: "Dynamisez vos séminaires, soirées d'entreprise, inaugurations et team buildings en Seine-Maritime avec une borne photo entièrement personnalisable à vos couleurs. Un outil de cohésion — et de communication — redoutablement efficace.",
    intro: [
      "Le photobooth n'est pas qu'une animation festive : c'est un véritable levier de cohésion et de communication pour votre entreprise. Lors d'un séminaire, d'une soirée de fin d'année ou d'un salon, la borne photo rassemble naturellement les équipes, brise la glace et crée des souvenirs partagés qui renforcent le sentiment d'appartenance.",
      "Chez PhotoRoots, nous personnalisons intégralement l'expérience aux couleurs de votre marque : logo sur les tirages, fonds aux visuels de l'entreprise, interface brandée. Chaque photo partagée par vos collaborateurs ou vos clients devient un support de communication qui prolonge l'événement bien au-delà de la soirée.",
      "Nous accompagnons les entreprises de toute la Seine-Maritime — Le Havre, Rouen, Dieppe et leurs zones d'activité — pour leurs séminaires, lancements de produit, team buildings, soirées de Noël et salons professionnels. Devis clair, facturation entreprise et technicien dédié sur place.",
    ],
    benefits: [
      'Personnalisation complète aux couleurs et au logo de votre entreprise.',
      'Tirages instantanés brandés : chaque photo devient un support de communication.',
      'Idéal pour séminaires, soirées de fin d\'année, inaugurations, salons et team buildings.',
      'Galerie en ligne partageable avec les équipes après l\'événement.',
      'Facturation entreprise, devis détaillé et technicien dédié sur place.',
      'Plusieurs formats disponibles, dont le Photobooth 360 pour un effet spectaculaire.',
    ],
    faqs: [
      { q: 'Peut-on personnaliser le photobooth aux couleurs de notre entreprise ?', a: "Oui, c'est même l'un de nos points forts pour les événements pro : logo sur les tirages, fonds personnalisés à vos visuels et interface à votre image. L'ensemble est préparé en amont avec vous." },
      { q: 'Proposez-vous une facturation entreprise avec devis ?', a: "Bien sûr. Nous établissons un devis détaillé et une facture au nom de votre entreprise, adaptés à vos procédures d'achat." },
      { q: 'Le photobooth convient-il à un séminaire ou un team building ?', a: "Parfaitement. C'est une animation fédératrice qui rassemble les équipes et crée des souvenirs communs. Nous l'installons aussi bien en salle de séminaire que lors d'une soirée ou d'un salon." },
      { q: 'Intervenez-vous sur les zones d\'activité du Havre et de Rouen ?', a: "Oui, nous nous déplaçons dans toute la Seine-Maritime, y compris les zones d'activité et parcs d'affaires du Havre, de Rouen, de Dieppe et de leurs environs." },
    ],
  },

  'photobooth-anniversaire': {
    name: 'Anniversaire',
    slug: 'photobooth-anniversaire',
    icon: 'cake',
    keyword: 'photobooth anniversaire',
    keywordsSecondary: 'location photobooth anniversaire, borne photo anniversaire, animation anniversaire photobooth, photomaton anniversaire',
    seoTitle: 'Photobooth Anniversaire en Seine-Maritime | Location Borne Photo',
    seoDesc: "Animez votre anniversaire au Havre, à Rouen ou à Dieppe avec notre photobooth premium : impressions illimitées, accessoires fun et souvenirs garantis. Devis sous 24h.",
    heroBadge: 'Animation anniversaire',
    heroTitle: 'Photobooth pour votre Anniversaire',
    heroHighlight: 'fun & souvenirs garantis',
    heroSubtitle: "18, 30, 40, 50 ans ou anniversaire surprise : notre borne photo met l'ambiance et fait repartir chaque invité avec un souvenir. Accessoires déjantés, impressions illimitées et galerie en ligne. Au Havre, à Rouen, à Dieppe et alentours.",
    intro: [
      "Un anniversaire réussi, c'est une fête dont on se souvient. Le photobooth est l'animation qui fait le tour de toutes les générations : les enfants adorent les accessoires, les ados multiplient les poses, et les adultes repartent avec un tirage à coller sur le frigo. En quelques secondes, chaque invité a son souvenir en main.",
      "Pour vos 18, 30, 40 ou 50 ans, vos anniversaires surprise ou vos fêtes de famille, nous installons une borne photo premium avec impressions illimitées selon la formule, une large sélection d'accessoires fun et un cadre personnalisable à votre thème (années 80, disco, cabaret, tropical…).",
      "PhotoRoots se déplace dans toute la Seine-Maritime — Le Havre, Rouen, Dieppe et leurs environs — avec livraison et installation incluses. Vous profitez de votre soirée, on s'occupe du reste.",
    ],
    benefits: [
      'Impressions illimitées selon la formule : chacun repart avec son souvenir.',
      'Grande sélection d\'accessoires fun pour tous les âges.',
      'Cadre et fonds personnalisables selon votre thème de fête.',
      'Galerie en ligne pour retrouver toutes les photos de la soirée.',
      'Installation simple et rapide, à domicile ou en salle.',
      'Livraison et installation incluses dans toute la Seine-Maritime.',
    ],
    faqs: [
      { q: 'Le photobooth convient-il à tous les âges ?', a: "Oui ! C'est justement sa force : les enfants, les ados et les adultes s'amusent tous avec les accessoires et les poses. C'est l'animation idéale pour un anniversaire multi-générations." },
      { q: 'Peut-on installer le photobooth à domicile ?', a: "Bien sûr. Notre borne s'installe aussi bien dans une salle des fêtes qu'à domicile, du moment qu'une prise électrique est accessible. L'installation est rapide et nous testons tout avant le début de la fête." },
      { q: 'Les impressions sont-elles illimitées ?', a: "Selon la formule choisie, oui : chaque invité peut imprimer autant de photos qu'il le souhaite. Nous vous conseillons la formule la plus adaptée au nombre de participants." },
      { q: 'Intervenez-vous pour un anniversaire au Havre ou à Rouen ?', a: "Oui, nous couvrons toute la Seine-Maritime — Le Havre, Rouen, Dieppe et alentours — livraison et installation comprises." },
    ],
  },

  'photobooth-bapteme': {
    name: 'Baptême',
    slug: 'photobooth-bapteme',
    icon: 'sparkles',
    keyword: 'photobooth baptême',
    keywordsSecondary: 'location borne photo baptême, photomaton baptême, animation photobooth baptême',
    seoTitle: 'Photobooth Baptême en Seine-Maritime | Location Borne Photo',
    seoDesc: "Immortalisez le baptême de votre enfant au Havre, à Rouen ou à Dieppe avec notre photobooth premium : souvenirs instantanés et animation tout en douceur. Devis sous 24h.",
    heroBadge: 'Animation baptême',
    heroTitle: 'Photobooth pour un Baptême',
    heroHighlight: 'des souvenirs tout en douceur',
    heroSubtitle: "Le baptême de votre enfant mérite des souvenirs à la hauteur de l'émotion. Notre borne photo réunit la famille autour d'une animation douce et élégante, avec tirages instantanés à offrir à chaque invité. En Seine-Maritime.",
    intro: [
      "Le baptême rassemble toutes les générations d'une même famille — parrains, marraines, grands-parents, cousins. Le photobooth devient le point de rencontre convivial de la journée : chacun prend la pose, et repart avec un souvenir imprimé de ce moment unique.",
      "Nous adaptons l'ambiance à la douceur de l'événement : fonds élégants et épurés, cadre personnalisé avec le prénom de l'enfant et la date du baptême, accessoires sobres ou tendres selon vos envies. Le résultat : des photos qui traversent les années.",
      "PhotoRoots intervient dans toute la Seine-Maritime — Le Havre, Rouen, Dieppe et environs — pour vos baptêmes à domicile, en salle ou en lieu de réception. Livraison, installation et galerie en ligne incluses.",
    ],
    benefits: [
      'Ambiance douce et élégante, adaptée à l\'esprit d\'un baptême.',
      'Cadre personnalisé avec le prénom de l\'enfant et la date.',
      'Tirages instantanés à offrir à chaque membre de la famille.',
      'Un souvenir photo pour toutes les générations réunies.',
      'Galerie en ligne privée pour partager les photos avec la famille.',
      'Livraison et installation incluses en Seine-Maritime.',
    ],
    faqs: [
      { q: 'Le photobooth est-il adapté à un baptême en famille ?', a: "Tout à fait. C'est une animation douce qui réunit toutes les générations autour d'un moment convivial, sans être bruyante ni envahissante. Chacun repart avec un souvenir de la journée." },
      { q: 'Peut-on personnaliser les photos au prénom de l\'enfant ?', a: "Oui, nous créons un cadre d'impression personnalisé avec le prénom de l'enfant et la date du baptême, ainsi que des fonds élégants assortis à votre décoration." },
      { q: 'Intervenez-vous à domicile pour un baptême ?', a: "Bien sûr, à domicile comme en salle ou en lieu de réception, partout en Seine-Maritime, avec livraison et installation comprises." },
    ],
  },

  'photobooth-evjf-evg': {
    name: 'EVJF / EVG',
    slug: 'photobooth-evjf-evg',
    icon: 'gift',
    keyword: 'photobooth EVJF EVG',
    keywordsSecondary: 'photo booth evjf, cadre photobooth evjf, animation EVJF photobooth, photobooth evg',
    seoTitle: 'Photobooth EVJF & EVG en Seine-Maritime | Animation Photo',
    seoDesc: "Ajoutez une touche fun à votre EVJF ou EVG en Seine-Maritime avec notre photobooth : accessoires, impressions instantanées et souvenirs entre amis. Devis sous 24h.",
    heroBadge: 'Animation EVJF / EVG',
    heroTitle: 'Photobooth pour EVJF & EVG',
    heroHighlight: 'la touche fun en plus',
    heroSubtitle: "Enterrement de vie de jeune fille ou de garçon : la borne photo, c'est le fou rire assuré et des souvenirs à ne pas montrer aux beaux-parents. Accessoires déjantés, impressions illimitées et cadre personnalisé. En Seine-Maritime.",
    intro: [
      "Un EVJF ou un EVG, ce sont des souvenirs entre amis qu'on veut garder pour la vie (et ressortir le jour du mariage !). Le photobooth transforme votre journée ou votre soirée en session photo délirante : accessoires décalés, poses improbables et tirages instantanés que chacun ramène chez soi.",
      "Nous personnalisons le cadre d'impression au thème de votre EVJF / EVG et à la future mariée ou au futur marié, pour un souvenir unique. La borne s'installe partout : chalet loué, Airbnb, salle, bar privatisé ou domicile.",
      "PhotoRoots se déplace dans toute la Seine-Maritime — Le Havre, Rouen, Dieppe et environs. Devis rapide et formule adaptée à votre groupe d'amis.",
    ],
    benefits: [
      'Accessoires fun et déjantés pour des photos mémorables.',
      'Cadre personnalisé au thème de l\'EVJF / EVG et aux prénoms.',
      'Impressions instantanées : chaque ami repart avec ses souvenirs.',
      'S\'installe partout : location, Airbnb, bar privatisé ou domicile.',
      'Galerie en ligne pour tout partager avec le groupe.',
      'Formule adaptée à la taille de votre groupe d\'amis.',
    ],
    faqs: [
      { q: 'Où peut-on installer le photobooth pour un EVJF / EVG ?', a: "Partout : dans une maison ou un gîte loué, un Airbnb, une salle, un bar privatisé ou à domicile. Il suffit d'une prise électrique. Nous nous déplaçons dans toute la Seine-Maritime." },
      { q: 'Peut-on personnaliser le cadre au thème de l\'enterrement de vie ?', a: "Oui, nous créons un cadre sur mesure au thème de votre EVJF / EVG et au prénom de la future mariée ou du futur marié, pour un souvenir vraiment unique." },
      { q: 'Est-ce adapté à un petit groupe d\'amis ?', a: "Tout à fait. Nous proposons une formule adaptée à la taille de votre groupe, que vous soyez une poignée d'amis ou une grande bande." },
    ],
  },
};
