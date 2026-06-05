// Données des pages villes (SEO local PhotoRoots — Seine-Maritime / Normandie).
// Chaque ville possède un contenu UNIQUE (contexte local, cas d'usage, lieux, FAQ)
// afin d'éviter toute pénalité Google pour pages « doorway » dupliquées.
//
// Clé courte (ex. 'le-havre') ; le champ `slug` reprend la forme URL orientée
// mot-clé : `location-photobooth-${clé}`.

export const CITIES = {
  'le-havre': {
    name: 'Le Havre',
    slug: 'location-photobooth-le-havre',
    postalCode: '76600',
    geo: { lat: 49.4944, lng: 0.1079 },
    areas: ['Le Havre', 'Sainte-Adresse', 'Octeville-sur-Mer', 'Montivilliers', 'Harfleur', "Gonfreville-l'Orcher"],
    localContext: `Implantés au cœur de la Seine-Maritime, nous connaissons Le Havre comme notre poche : du quartier Saint-François aux plages de Sainte-Adresse, en passant par les façades en béton signées Auguste Perret classées au patrimoine mondial de l'UNESCO. Cette identité unique — entre architecture d'après-guerre, port de commerce et front de mer — donne à chaque événement havrais un cachet particulier que nous adorons mettre en valeur dans nos décors photobooth.

Le Havre, c'est aussi une ville de fêtes. Entre les soirées d'entreprise des grands groupes installés sur la zone industrielle, les mariages dans les villas de la Côte ou les anniversaires sur les hauteurs du Havre, nous intervenons toute l'année dans le 76600 et ses environs. Notre proximité géographique nous permet d'arriver en moins de 30 minutes depuis nos locaux, sans frais de déplacement supplémentaires.

Choisir PhotoRoots au Havre, c'est s'assurer une équipe locale qui connaît les contraintes de chaque salle havraise : la luminosité particulière des espaces face à la mer, les accès parfois étroits du centre Perret, la logistique des grandes salles type Pasino ou Carré des Docks. Nous arrivons préparés, jamais en repérage, ce qui garantit une installation rapide et sans accroc.

Enfin, parce que nous travaillons quasi-exclusivement en Seine-Maritime, nos prix restent très compétitifs sur la zone du Havre : pas de surcoût kilométrique, pas de marge de "déplacement exceptionnel", juste un tarif transparent à partir de 99€ pour un photobooth premium installé chez vous, livraison et installation incluses.`,
    useCases: [
      'Mariages dans les domaines des hauteurs (Octeville-sur-Mer, Sainte-Adresse) avec leur vue mer imprenable',
      "Soirées d'entreprise sur le port autonome et la zone industrielle de Gonfreville-l'Orcher",
      'Galas et événements corporate au Carré des Docks et au Pasino du Havre',
      "Anniversaires et fêtes privées dans les villas Perret du centre-ville classé UNESCO",
      'Baptêmes et communions à Montivilliers et Harfleur dans les salles paroissiales rénovées',
      "Soirées étudiantes et bals de promo des écoles de commerce et de l'EM Normandie",
    ],
    venues: [
      'Le Pasino du Havre',
      'Carré des Docks — Le Havre Normandie',
      'Domaine de Bellevue à Octeville-sur-Mer',
      'Villa Maritime à Sainte-Adresse',
      "Salle des fêtes d'Harfleur",
      'Espace réception Montivilliers Centre',
      "Salle Lemarchand à Gonfreville-l'Orcher",
      "Hôtel Vent d'Ouest — quartier Saint-François",
      'Domaine du Colmoulins',
      'Manoir de Graville',
    ],
    localFaqs: [
      {
        q: 'Vous déplacez-vous gratuitement au Havre et dans ses environs ?',
        a: "Oui, le déplacement est totalement gratuit dans Le Havre intra-muros (76600), Sainte-Adresse, Octeville-sur-Mer, Montivilliers, Harfleur et Gonfreville-l'Orcher. Au-delà, nous appliquons un forfait kilométrique transparent indiqué dès le devis.",
      },
      {
        q: 'Pouvez-vous installer le photobooth dans une salle classée du quartier Perret ?',
        a: "Absolument. Nous avons l'habitude des contraintes architecturales du centre Perret du Havre : accès étroits, ascenseurs petits, normes de sécurité spécifiques. Un repérage téléphonique en amont avec vous suffit pour anticiper la logistique d'installation.",
      },
      {
        q: "Combien de temps avant l'événement faut-il réserver au Havre ?",
        a: "Pour les mariages havrais en haute saison (mai à septembre), nous recommandons de réserver 4 à 6 mois à l'avance. Pour un anniversaire ou une soirée d'entreprise en semaine, 2 à 3 semaines suffisent généralement. Plus tôt vous nous contactez, plus le choix de dates est large.",
      },
      {
        q: 'Le photobooth fonctionne-t-il en extérieur, sur le front de mer havrais ?',
        a: "Oui, nous installons régulièrement la borne en terrasse ou sous chapiteau sur la Plage du Havre et à Sainte-Adresse. Nous prévoyons une protection contre le vent et l'humidité maritime. Une simple alimentation 220V à proximité (rallonge possible) est nécessaire.",
      },
      {
        q: 'Avez-vous déjà travaillé au Pasino ou au Carré des Docks ?',
        a: "Oui, ce sont deux de nos lieux récurrents au Havre. Nous connaissons les zones de chargement, les contacts techniques sur place et les règles internes. L'installation y est particulièrement fluide.",
      },
    ],
  },

  'rouen': {
    name: 'Rouen',
    slug: 'location-photobooth-rouen',
    postalCode: '76000',
    geo: { lat: 49.4432, lng: 1.0993 },
    areas: ['Rouen', 'Sotteville-lès-Rouen', 'Bois-Guillaume', 'Mont-Saint-Aignan', 'Bonsecours', 'Le Mesnil-Esnard'],
    localContext: `Rouen, capitale historique de la Normandie, est sans doute la ville la plus chargée de patrimoine de toute la région. La cathédrale Notre-Dame, immortalisée par Monet, le Gros-Horloge, les ruelles à colombages du centre médiéval ou encore l'abbatiale Saint-Ouen : autant de décors qui donnent à un mariage ou un événement rouennais une dimension cinématographique. Notre photobooth s'intègre dans cette élégance avec des fonds personnalisables qui peuvent reprendre les codes graphiques de la ville aux cent clochers.

Le tissu événementiel rouennais est particulièrement riche : grands hôtels de réception en centre-ville, châteaux des coteaux nord (Bois-Guillaume, Mont-Saint-Aignan), domaines viticoles autour du Mesnil-Esnard, salles modernes en bord de Seine côté rive gauche. Nous intervenons sur tous ces formats, du mariage intimiste de 50 invités au gala d'entreprise de 400 personnes pour les sièges sociaux rouennais (Matmut, Crédit Agricole Normandie-Seine, etc.).

Travailler à Rouen, c'est aussi maîtriser les particularités de circulation et de stationnement du centre-ville historique, classé secteur sauvegardé. Notre équipe locale connaît les arrêtés municipaux, les zones piétonnes du quartier Vieux-Marché et les accès logistiques aux salles classées. Cette expertise terrain évite bien des mauvaises surprises le jour J.

PhotoRoots est l'un des rares prestataires photobooth réellement basés en Seine-Maritime à intervenir aussi régulièrement sur le bassin rouennais. Cela nous permet d'offrir des tarifs cohérents — à partir de 99€, livraison et installation incluses — sans la majoration "Paris-Rouen" appliquée par les loueurs franciliens qui se déplacent en région. Devis personnalisé sous 24h.`,
    useCases: [
      'Mariages dans les châteaux et manoirs des coteaux nord (Bois-Guillaume, Bonsecours, Mont-Saint-Aignan)',
      "Soirées d'entreprise et galas annuels pour les sièges sociaux rouennais (assurance, banque, presse)",
      'Cocktails dînatoires dans les hôtels particuliers du centre médiéval (rue Saint-Romain, Vieux-Marché)',
      "Événements culturels et inaugurations dans l'écosystème création/numérique de la Seine Innopolis",
      'Anniversaires et baptêmes dans les domaines de la vallée du Cailly et du Robec',
      "Bals de promo et galas étudiants pour Neoma Business School, l'INSA et l'Université de Rouen",
    ],
    venues: [
      "Hôtel de Bourgtheroulde — Place du Vieux-Marché",
      'Le Manoir des Tilleuls à Mont-Saint-Aignan',
      'Domaine de Quevilly — bord de Seine',
      'Château du Bois-Guillaume',
      'Espace Saint-Marc — centre Rouen',
      'Salle Saint-Sever — rive gauche',
      'Domaine de Bonsecours',
      "Halle aux Toiles — Rouen centre",
      'Manoir de Villers à Saint-Pierre-de-Manneville',
      'Salle des fêtes du Mesnil-Esnard',
    ],
    localFaqs: [
      {
        q: 'Pouvez-vous installer le photobooth dans le centre médiéval piétonnier de Rouen ?',
        a: "Oui, nous avons l'habitude des contraintes du secteur sauvegardé rouennais (rue du Gros-Horloge, place du Vieux-Marché, rue Saint-Romain). Nous demandons une autorisation de chargement temporaire ou utilisons les accès logistiques privés des salles. Un appel préalable nous permet de planifier l'intervention au mieux.",
      },
      {
        q: 'Intervenez-vous dans les châteaux des coteaux nord (Mont-Saint-Aignan, Bois-Guillaume) ?',
        a: "Régulièrement. Ces communes sont à 15 minutes seulement de notre base et font partie de notre zone de déplacement gratuit. Nous connaissons la plupart des domaines de la région et sommes habitués aux installations dans des salles avec parquet ancien, hauteurs sous plafond particulières ou accès par cour pavée.",
      },
      {
        q: "Combien coûte un photobooth pour un mariage à Rouen ?",
        a: "Nos tarifs démarrent à 99€ pour la formule découverte 2h. Pour un mariage rouennais classique (4-5h d'animation, photos illimitées, accessoires, fond personnalisé), comptez entre 390€ et 590€ selon les options. Devis gratuit et personnalisé sous 24h.",
      },
      {
        q: 'Travaillez-vous avec les wedding planners et traiteurs rouennais ?',
        a: "Oui, nous collaborons régulièrement avec plusieurs wedding planners de Rouen et Mont-Saint-Aignan, ainsi qu'avec des traiteurs locaux qui interviennent dans les châteaux des coteaux. Nous coordonnons systématiquement notre installation avec le timing du traiteur et du DJ pour ne pas perturber le déroulé.",
      },
      {
        q: 'Quel délai pour une réservation à Rouen ?',
        a: "Pour un mariage rouennais en haute saison (mai-septembre), réservez 5 à 6 mois à l'avance car nos disponibilités sur cette zone partent vite. Pour un événement d'entreprise en semaine, 3 à 4 semaines suffisent. Contactez-nous tôt pour sécuriser votre date idéale.",
      },
    ],
  },

  'dieppe': {
    name: 'Dieppe',
    slug: 'location-photobooth-dieppe',
    postalCode: '76200',
    geo: { lat: 49.9229, lng: 1.0775 },
    areas: ['Dieppe', 'Pourville-sur-Mer', 'Hautot-sur-Mer', 'Arques-la-Bataille', 'Saint-Aubin-sur-Scie'],
    localContext: `Dieppe, c'est la ville la plus authentique de la Côte d'Albâtre : un port de pêche en activité, un château fort qui surveille la Manche depuis le XVe siècle, des falaises blanches qui s'étirent vers Pourville et Varengeville, et une plage de galets bordée par la fameuse "pelouse" — l'une des plus longues d'Europe. Cet ADN balnéaire et maritime imprègne profondément les événements dieppois : on s'y marie face à la mer, on y célèbre des anniversaires sur les hauteurs des falaises, on y organise des séminaires d'entreprise au son des mouettes.

Notre photobooth s'adapte parfaitement à cette ambiance bord de mer. Nous proposons des fonds personnalisables aux couleurs de la Côte d'Albâtre — bleu profond, blanc falaise, gris galet — et savons travailler dans les conditions parfois capricieuses du climat normand : vent de Manche, embruns, humidité. Notre matériel est protégé pour les installations sous tonnelle ou en terrasse face mer.

Intervenir à Dieppe, c'est aussi connaître les particularités logistiques d'une ville construite entre falaises et port. Les accès aux quartiers du Pollet ou aux hauteurs du Bout-du-Quai demandent une certaine anticipation, surtout les soirs de marée haute ou en période de festivals (Foire aux Harengs, Festival International de Cerfs-Volants). Nous gérons ces aspects en amont avec vous.

PhotoRoots est l'un des rares photoboothes vraiment basés en Seine-Maritime à monter régulièrement à Dieppe et sur la Côte d'Albâtre. Cette proximité — environ 1h depuis nos locaux — nous permet d'inclure le déplacement gratuitement dans le 76200 et les communes voisines, là où d'autres prestataires factureraient un déplacement "longue distance". Tarifs à partir de 99€, livraison et installation incluses, devis sous 24h, sans surprise.`,
    useCases: [
      'Mariages face à la mer dans les hôtels-restaurants du front de mer dieppois et de Pourville',
      "Soirées d'entreprise et team-buildings sur le port et au Casino de Dieppe",
      'Anniversaires et fêtes de famille dans les domaines de la vallée de la Scie (Saint-Aubin-sur-Scie, Arques-la-Bataille)',
      'Réceptions corporate et inaugurations dans les salles bord de mer aux vues sur les falaises',
      "Galas et soirées thématiques pendant les grands événements dieppois (Foire aux Harengs, festival des Cerfs-Volants)",
      'Baptêmes et communions dans les salles paroissiales rénovées des communes alentours',
    ],
    venues: [
      'Casino Partouche de Dieppe',
      'Hôtel Aguado — front de mer',
      'Domaine du Petit Coudray à Hautot-sur-Mer',
      "Château d'Arques-la-Bataille",
      'Villa Mauresque à Pourville-sur-Mer',
      'Salle Paul-Eluard — Dieppe centre',
      "Manoir d'Ango (Varengeville-sur-Mer, à 10 min)",
      'Domaine de Saint-Aubin-sur-Scie',
      'Salle des fêtes des Quatre-Vents',
      'Restaurant Le Pollet — port de Dieppe',
    ],
    localFaqs: [
      {
        q: 'Pouvez-vous installer le photobooth en bord de mer à Dieppe ou Pourville ?',
        a: "Oui, c'est même l'une de nos spécialités sur la Côte d'Albâtre. Nous installons régulièrement en terrasse, sous chapiteau ou en salle face mer, avec le matériel adapté aux contraintes maritimes (protection contre les embruns et le vent). Une simple prise 220V à moins de 10 mètres suffit ; sinon, nous fournissons une rallonge longue distance.",
      },
      {
        q: 'Le déplacement est-il payant à Dieppe ?',
        a: "Non, Dieppe (76200) et les communes proches (Pourville, Hautot-sur-Mer, Arques-la-Bataille, Saint-Aubin-sur-Scie) font partie de notre zone d'intervention sans surcoût. Nous incluons le trajet aller-retour, l'installation et le démontage dans le tarif annoncé. Pas de mauvaise surprise sur la facture.",
      },
      {
        q: "Travaillez-vous au Casino de Dieppe ou au Manoir d'Ango ?",
        a: "Oui, ce sont deux lieux où nous sommes intervenus à plusieurs reprises. Au Casino Partouche, nous connaissons les zones de chargement et l'équipe technique. Au Manoir d'Ango (Varengeville, à 10 min de Dieppe), nous savons gérer les contraintes d'un monument historique : pas de perçage, accès limité aux véhicules, etc.",
      },
      {
        q: "Le photobooth résiste-t-il au climat venteux de la Côte d'Albâtre ?",
        a: "Notre matériel est conçu pour fonctionner en intérieur. Pour une installation en extérieur ou semi-couverte (terrasse, tonnelle, chapiteau), nous prévoyons des lests pour stabiliser la borne et protégeons les composants sensibles. En cas de vent fort annoncé, nous adaptons toujours l'installation avec vous le matin de l'événement.",
      },
      {
        q: "Combien de temps à l'avance réserver pour un mariage à Dieppe ?",
        a: "Les week-ends d'été (juin-août) sur la Côte d'Albâtre sont très demandés. Nous recommandons de réserver 5 à 7 mois à l'avance pour un mariage. Pour un anniversaire en semaine ou un événement d'entreprise hors saison, 3 à 4 semaines de préavis sont généralement suffisantes.",
      },
    ],
  },

  'montivilliers': {
    name: 'Montivilliers',
    slug: 'location-photobooth-montivilliers',
    postalCode: '76290',
    geo: { lat: 49.5447, lng: 0.1872 },
    areas: ['Montivilliers', 'Épouville', 'Manéglise', 'Saint-Martin-du-Manoir', 'Le Havre'],
    localContext: `Montivilliers est l'une de ces petites villes normandes au charme discret mais profond. Tout y tourne autour de l'Abbaye Notre-Dame, joyau roman et gothique fondé au VIIe siècle, dont le cloître et l'aître restauré accueillent aujourd'hui le parcours muséographique "Cœur d'Abbayes". Se marier ou fêter un événement à Montivilliers, c'est s'offrir un décor médiéval authentique, à deux pas du Havre mais loin de l'agitation portuaire.

La ville s'étire le long de la Lézarde, petite rivière qui serpente entre le centre ancien aux ruelles pavées et les coteaux verdoyants. Ce cadre semi-rural, à la fois patrimonial et apaisant, séduit les familles de l'agglomération havraise qui cherchent un lieu de réception plus intime que les grandes salles du Havre. Nous y installons régulièrement notre photobooth dans les salles communales d'Épouville, Manéglise ou Saint-Martin-du-Manoir, comme dans les espaces de réception du centre montivillon.

Notre atout à Montivilliers, c'est la proximité immédiate : nous sommes sur place en quelques minutes, ce qui rend le déplacement totalement gratuit dans le 76290 et les communes limitrophes. Pas de forfait kilométrique, pas de "supplément campagne" : nous traitons Montivilliers exactement comme le centre du Havre, avec la même réactivité et le même soin d'installation.

Que votre réception se tienne dans une salle des fêtes communale, un gîte de charme des coteaux ou une cour d'abbaye pour un événement d'exception, nous adaptons nos fonds et notre matériel au lieu. À partir de 99€, livraison et installation incluses, avec un devis personnalisé envoyé sous 24h.`,
    useCases: [
      "Mariages dans le cadre patrimonial de l'Abbaye de Montivilliers et de son aître restauré",
      'Réceptions familiales et anniversaires dans les salles communales d\'Épouville et Manéglise',
      'Baptêmes et communions au cœur du centre médiéval montivillon',
      "Fêtes de village et événements associatifs le long de la Lézarde",
      "Soirées d'entreprise pour les sociétés de la zone d'activité Montivilliers / Épouville",
      'Mariages champêtres dans les gîtes et longères des coteaux de Saint-Martin-du-Manoir',
    ],
    venues: [
      "Cœur d'Abbayes — Abbaye de Montivilliers",
      'Salle des fêtes de Montivilliers — Espace Belle-Étoile',
      "Salle polyvalente d'Épouville",
      'Salle communale de Manéglise',
      'Domaine de la Lézarde',
      'Manoir des Coteaux à Saint-Martin-du-Manoir',
      'Gîte du Vallon — Épouville',
      'Salle des fêtes de Saint-Martin-du-Manoir',
      'Longère de la Belle-Étoile',
      'Espace réception du Centre Ancien',
    ],
    localFaqs: [
      {
        q: 'Le déplacement est-il gratuit à Montivilliers ?',
        a: "Oui, totalement. Montivilliers (76290), Épouville, Manéglise et Saint-Martin-du-Manoir sont à quelques minutes de notre base : nous y intervenons sans aucun frais de déplacement, installation et démontage compris dans le tarif annoncé dès le devis.",
      },
      {
        q: "Peut-on installer le photobooth dans un cadre patrimonial comme l'Abbaye ?",
        a: "Oui, lorsque le lieu le permet et avec l'accord du gestionnaire. Nous avons l'habitude des sites historiques : installation sans perçage ni fixation murale, matériel sur pied autoportant, câblage discret. Un échange préalable avec vous et le responsable du site suffit à tout caler.",
      },
      {
        q: "Vos bornes conviennent-elles aux petites salles communales d'Épouville ou Manéglise ?",
        a: "Parfaitement. Notre photobooth occupe environ 1,5 m² au sol et s'adapte aux salles des fêtes de village. Nous adaptons la disposition (fond toile ou structure) à la surface disponible afin de laisser de la place à la piste de danse et au buffet.",
      },
      {
        q: 'Faut-il réserver longtemps à l\'avance pour un mariage à Montivilliers ?',
        a: "Pour un mariage de printemps ou d'été, comptez 4 à 6 mois d'anticipation. Comme nous sommes très proches, nous gardons souvent quelques créneaux de dernière minute pour les anniversaires et baptêmes : n'hésitez pas à nous solliciter même tardivement.",
      },
    ],
  },

  'harfleur': {
    name: 'Harfleur',
    slug: 'location-photobooth-harfleur',
    postalCode: '76700',
    geo: { lat: 49.5067, lng: 0.1981 },
    areas: ['Harfleur', "Gonfreville-l'Orcher", 'Rogerville', 'Le Havre', 'Montivilliers'],
    localContext: `Harfleur garde fièrement les traces de son passé de grand port médiéval, longtemps plus important que Le Havre avant l'ensablement de l'estuaire. Sa silhouette est dominée par l'élégante flèche de l'église Saint-Martin, l'une des plus belles de Normandie, qui s'élance à plus de 80 mètres au-dessus de la cité ancienne. Ses ruelles, ses vestiges de remparts et son centre historique offrent un décor chargé d'histoire pour les mariages et réceptions de l'agglomération havraise.

Mais Harfleur, c'est aussi une ville à deux visages : d'un côté la cité médiévale au bord de la Lézarde, de l'autre la proximité immédiate de la grande zone industrialo-portuaire et de Gonfreville-l'Orcher. Cette dualité fait d'Harfleur un point d'ancrage idéal pour les événements professionnels : séminaires, soirées de fin d'année et inaugurations des entreprises de la pétrochimie et de la logistique y sont fréquents, et nous y intervenons régulièrement avec notre photobooth.

Notre connaissance fine de ce territoire nous permet d'adresser aussi bien les réceptions privées intimistes du centre ancien que les grands rassemblements corporate des sites industriels voisins. Nous savons gérer les contraintes d'accès et de sécurité propres aux zones d'activité de Rogerville et de Gonfreville-l'Orcher, où l'entrée sur site est parfois réglementée.

Située à quelques minutes du Havre, Harfleur (76700) fait partie de notre zone de déplacement gratuit. Vous bénéficiez de la même réactivité que dans le centre havrais, avec des tarifs transparents à partir de 99€, livraison et installation incluses, et un devis personnalisé sous 24h.`,
    useCases: [
      "Soirées de fin d'année et séminaires des entreprises de la zone industrialo-portuaire (Gonfreville-l'Orcher, Rogerville)",
      "Mariages dans le cadre médiéval du centre ancien d'Harfleur et de l'église Saint-Martin",
      'Inaugurations et événements corporate des sites logistiques et pétrochimiques voisins',
      'Anniversaires et fêtes de famille dans les salles municipales harfleuraises',
      "Baptêmes et communions le long de la Lézarde",
      'Réceptions et arbres de Noël du comité d\'entreprise pour les grands employeurs locaux',
    ],
    venues: [
      "Salle des fêtes d'Harfleur — Espace Coty",
      "Salle Lemarchand à Gonfreville-l'Orcher",
      "Manoir de la Lézarde — Harfleur",
      'Salle polyvalente de Rogerville',
      'Espace réception du Centre Ancien Saint-Martin',
      "Domaine des Remparts — Harfleur",
      "Salle municipale de Gonfreville-l'Orcher",
      'Gîte de la Vallée de la Lézarde',
      'Salle des associations harfleuraises',
      'Espace événementiel de la Zone Portuaire',
    ],
    localFaqs: [
      {
        q: "Intervenez-vous pour les événements d'entreprise des zones industrielles près d'Harfleur ?",
        a: "Oui, c'est l'une de nos spécialités sur ce secteur. Nous avons l'habitude des séminaires et soirées corporate des entreprises de Gonfreville-l'Orcher et Rogerville. Nous nous adaptons aux procédures d'accès et de sécurité des sites industriels : badges, horaires de chargement, consignes spécifiques.",
      },
      {
        q: 'Le déplacement à Harfleur est-il facturé ?',
        a: "Non. Harfleur (76700) est limitrophe du Havre et fait partie intégrante de notre zone d'intervention sans surcoût, tout comme Gonfreville-l'Orcher et Rogerville. Trajet, installation et démontage sont inclus dans le tarif communiqué.",
      },
      {
        q: "Pouvez-vous installer le photobooth dans le centre médiéval d'Harfleur ?",
        a: "Oui. Les ruelles du vieux Harfleur peuvent être étroites : nous prévoyons le déchargement au plus près et acheminons le matériel à la main si nécessaire. Un appel préalable nous permet d'anticiper l'accès et le stationnement temporaire.",
      },
      {
        q: 'Proposez-vous des formules adaptées aux arbres de Noël et soirées de comité d\'entreprise ?',
        a: "Oui, nous avons des formules pensées pour les CE et comités sociaux : forfaits demi-journée ou soirée, impressions illimitées personnalisées aux couleurs de l'entreprise, accessoires thématiques de Noël. Devis sur mesure sous 24h selon le nombre de participants.",
      },
    ],
  },

  'fecamp': {
    name: 'Fécamp',
    slug: 'location-photobooth-fecamp',
    postalCode: '76400',
    geo: { lat: 49.7570, lng: 0.3747 },
    areas: ['Fécamp', 'Saint-Léonard', 'Les Loges', 'Yport', 'Senneville-sur-Fécamp'],
    localContext: `Fécamp est une ville de caractère, à la croisée de la mer et de l'histoire. Ancienne capitale des ducs de Normandie, elle abrite l'imposante Abbatiale de la Trinité, presque aussi grande qu'une cathédrale, et le somptueux Palais Bénédictine, ce monument néo-gothique flamboyant où l'on distille encore la célèbre liqueur. Entre falaises vertigineuses, port de pêche à la morue et front de mer animé, Fécamp offre des décors d'événement parmi les plus spectaculaires de la Côte d'Albâtre.

Le port de Fécamp, l'un des plus actifs de Normandie, rythme la vie locale et inspire de nombreuses réceptions : repas de fête au bord des bassins, mariages dans les restaurants face aux chalutiers, séminaires dans les espaces du casino Tranchant. Les amateurs de grand large, eux, privilégient les hauteurs et leurs panoramas sur la Manche, du cap Fagnet aux falaises de Senneville. Notre photobooth s'invite dans tous ces cadres, avec des fonds aux teintes marines qui prolongent l'atmosphère fécampoise.

Travailler à Fécamp suppose de connaître les particularités d'une ville encaissée entre deux falaises, où l'accès aux hauteurs et au port demande de l'anticipation, notamment lors des grands rendez-vous comme le Festival "Fécamp Grand'Escale" ou la fête du hareng. Notre équipe maîtrise ces contraintes et planifie chaque installation en amont pour un montage fluide, même dans les lieux les plus atypiques.

Bien que Fécamp soit un peu plus éloignée de notre base, nous y intervenons régulièrement et incluons le déplacement dans nos tarifs pour le 76400 et les communes voisines (Saint-Léonard, Les Loges, Yport, Senneville). Photobooth premium à partir de 99€, livraison et installation incluses, devis personnalisé sous 24h.`,
    useCases: [
      'Mariages dans les restaurants et hôtels du front de mer fécampois, face au port',
      "Réceptions et séminaires d'exception au Palais Bénédictine et dans ses salons",
      "Soirées d'entreprise et galas au Casino de Fécamp",
      'Mariages avec vue mer sur les hauteurs du cap Fagnet et à Senneville-sur-Fécamp',
      "Fêtes de famille et anniversaires dans les villages de la Valleuse (Yport, Les Loges)",
      "Événements festifs pendant Fécamp Grand'Escale et la fête du hareng",
    ],
    venues: [
      'Palais Bénédictine à Fécamp',
      'Casino de Fécamp',
      'Restaurant du Port — bassin Bérigny',
      'Domaine du Cap Fagnet',
      'Salle des fêtes de Saint-Léonard',
      "Manoir de Senneville-sur-Fécamp",
      "Salle communale d'Yport",
      'Villa des Falaises — Les Loges',
      'Espace réception de la Trinité',
      "Domaine de la Valmont",
    ],
    localFaqs: [
      {
        q: 'Vous déplacez-vous jusqu\'à Fécamp sans surcoût ?',
        a: "Oui, Fécamp (76400) et les communes proches (Saint-Léonard, Les Loges, Yport, Senneville-sur-Fécamp) font partie de notre zone d'intervention. Le déplacement, l'installation et le démontage sont inclus dans le tarif annoncé. Pour les hameaux plus isolés du Pays de Caux, nous le précisons clairement dès le devis, sans surprise.",
      },
      {
        q: 'Peut-on organiser un événement avec photobooth au Palais Bénédictine ?',
        a: "Oui, le Palais Bénédictine accueille des réceptions privées et professionnelles dans ses salons d'exception. Nous y installons notre borne dans le respect du lieu : matériel autoportant sans aucune fixation, câblage discret, montage coordonné avec l'équipe du Palais. Un repérage en amont est recommandé pour ce type de site prestigieux.",
      },
      {
        q: "Comment gérez-vous l'accès aux hauteurs des falaises (cap Fagnet, Senneville) ?",
        a: "Nous anticipons systématiquement. Les routes des hauteurs fécampoises peuvent être étroites et venteuses : nous prévoyons le stationnement, sécurisons le matériel et, en cas d'installation extérieure face mer, ajoutons des lests contre le vent de Manche. Tout est calé avec vous avant le jour J.",
      },
      {
        q: 'Le photobooth peut-il être installé en extérieur sur le front de mer fécampois ?',
        a: "Oui, en terrasse ou sous chapiteau, avec protection contre les embruns et le vent. Une alimentation 220V à proximité est nécessaire ; nous fournissons les rallonges. En cas de météo défavorable annoncée, nous prévoyons toujours une solution de repli à l'abri.",
      },
      {
        q: 'Quel délai de réservation pour un mariage à Fécamp en été ?',
        a: "L'été sur la Côte d'Albâtre est très prisé : nous conseillons 5 à 7 mois d'anticipation pour un mariage entre juin et septembre. Hors saison, ou pour un anniversaire et un événement d'entreprise, 3 à 4 semaines de préavis suffisent généralement.",
      },
    ],
  },

  'etretat': {
    name: 'Étretat',
    slug: 'location-photobooth-etretat',
    postalCode: '76790',
    geo: { lat: 49.7073, lng: 0.2046 },
    areas: ['Étretat', 'Le Tilleul', 'Bénouville', 'Les Loges', 'Bordeaux-Saint-Clair'],
    localContext: `Étretat est tout simplement l'un des plus beaux décors de mariage de France. Ses falaises mondialement célèbres — la Porte d'Aval, l'Aiguille creuse, la Manneporte — dessinent un paysage spectaculaire qui a inspiré Monet, Courbet et Maupassant, et qui fait aujourd'hui rêver les couples du monde entier. Dire « oui » face à ces arches de craie blanche, c'est s'offrir un cadre d'exception, intemporel et photogénique à l'extrême. C'est précisément là que notre photobooth prend tout son sens.

Étretat s'est imposée comme une destination mariage haut de gamme. Entre les Jardins d'Étretat suspendus au-dessus de la mer, le golf et son clubhouse panoramique, les villas Belle Époque et les domaines des hauteurs, les lieux de réception y conjuguent prestige et vue imprenable. Pour ces événements raffinés, nous proposons une borne élégante, des tirages premium et des fonds qui subliment — sans jamais la dénaturer — la beauté naturelle des falaises.

Travailler à Étretat exige une vraie expertise logistique. Le village est petit, très fréquenté en saison, et les accès aux points de vue ou aux domaines des hauteurs (Le Tilleul, Bénouville, Bordeaux-Saint-Clair) demandent de l'anticipation. Pour les séances photo en extérieur face mer, nous prévoyons systématiquement la protection contre le vent et l'humidité, et coordonnons notre installation avec les wedding planners qui orchestrent ces mariages d'exception.

PhotoRoots accompagne régulièrement des mariages prestige à Étretat et sur les communes voisines. Malgré le standing de ces réceptions, nos tarifs restent accessibles — à partir de 99€, livraison et installation incluses — avec un service sur mesure et un devis personnalisé sous 24h. L'élégance d'un photobooth premium au pied des plus belles falaises de Normandie, sans le tarif d'un prestataire parisien.`,
    useCases: [
      "Mariages prestige avec vue sur les falaises et l'Aiguille creuse d'Étretat",
      'Cocktails et réceptions raffinées aux Jardins d\'Étretat, suspendus au-dessus de la mer',
      'Mariages au golf d\'Étretat et dans son clubhouse panoramique face à la Manche',
      'Séances photo en extérieur sur le front de mer et au pied des arches de craie',
      "Réceptions haut de gamme dans les villas Belle Époque et domaines des hauteurs (Le Tilleul, Bénouville)",
      'Demandes en mariage, fiançailles et renouvellements de vœux dans un cadre spectaculaire',
    ],
    venues: [
      "Les Jardins d'Étretat",
      "Golf d'Étretat — Clubhouse panoramique",
      'Domaine Saint-Clair — Le Donjon',
      'Villa Belle Époque — front de mer',
      'Manoir de Bénouville',
      'Domaine du Tilleul',
      'Salle des fêtes d\'Étretat',
      'Clos des Falaises à Bordeaux-Saint-Clair',
      'Hôtel-restaurant Dormy House',
      'Domaine des Loges',
    ],
    localFaqs: [
      {
        q: 'Organisez-vous des photobooths pour les mariages prestige face aux falaises d\'Étretat ?',
        a: "Absolument, c'est l'un de nos cadres préférés. Nous proposons une borne élégante et des tirages premium adaptés aux mariages haut de gamme. Nous coordonnons notre installation avec votre wedding planner et le lieu de réception pour un rendu raffiné, à la hauteur du cadre exceptionnel d'Étretat.",
      },
      {
        q: 'Le photobooth peut-il être installé en extérieur, avec la mer en arrière-plan ?',
        a: "Oui. Pour une installation extérieure face aux falaises, nous sécurisons la borne avec des lests contre le vent, protégeons les composants de l'humidité marine et prévoyons une solution de repli en cas de météo capricieuse. Une alimentation 220V à proximité est nécessaire (rallonges fournies).",
      },
      {
        q: 'Comment gérez-vous la logistique dans un village aussi fréquenté qu\'Étretat ?',
        a: "Nous anticipons l'affluence touristique, surtout en haute saison. Nous planifions le déchargement à l'avance, privilégions une installation en amont de l'événement et adaptons l'accès aux domaines des hauteurs (Le Tilleul, Bénouville, Bordeaux-Saint-Clair), parfois desservis par des routes étroites. Tout est calé en amont avec vous.",
      },
      {
        q: 'Proposez-vous des prestations pour les demandes en mariage ou renouvellements de vœux à Étretat ?',
        a: "Oui, Étretat est un lieu prisé pour ces moments romantiques. Nous pouvons mettre en place une borne discrète et élégante pour immortaliser une demande en mariage, des fiançailles ou un renouvellement de vœux, avec des tirages instantanés en souvenir. Formules sur mesure, devis sous 24h.",
      },
      {
        q: 'Vos tarifs sont-ils plus élevés pour un mariage haut de gamme à Étretat ?',
        a: "Non, notre grille reste la même : à partir de 99€, livraison et installation incluses. Le standing du lieu ne change pas nos prix. Vous bénéficiez d'un service premium et personnalisé sans la majoration appliquée par les prestataires venus de Paris ou d'ailleurs.",
      },
    ],
  },

  'bolbec': {
    name: 'Bolbec',
    slug: 'location-photobooth-bolbec',
    postalCode: '76210',
    geo: { lat: 49.5719, lng: 0.4759 },
    areas: ['Bolbec', 'Lillebonne', 'Gruchet-le-Valasse', 'Nointot', 'Mirville'],
    localContext: `Bolbec porte dans ses pierres la mémoire de la grande aventure textile normande. Au XVIIIe et XIXe siècles, la ville fut l'une des capitales de l'indienne et du coton, et ses fières demeures de négociants, ses anciennes filatures et son patrimoine industriel racontent encore cette prospérité passée. Aujourd'hui, ce caractère authentique et populaire fait de Bolbec une ville chaleureuse, idéale pour des fêtes de famille et des réceptions sans chichis mais pleines de cœur.

Nichée dans la vallée du Commerce, entre plateau de Caux et boucle de Seine, Bolbec bénéficie d'une situation centrale très pratique. À deux pas de l'A29 et de l'échangeur autoroutier, la ville est un carrefour naturel entre Le Havre, Lillebonne et le pays de Caux. Cette accessibilité facilite grandement nos interventions : nous rejoignons rapidement les salles des fêtes et domaines du secteur, qu'il s'agisse de Bolbec même, de Gruchet-le-Valasse, de Nointot ou de Mirville.

Le tissu événementiel local est avant tout familial et convivial : mariages dans les salles communales rénovées, anniversaires et noces dans les domaines de la campagne cauchoise, repas associatifs et fêtes de quartier. Nous y installons notre photobooth avec la même exigence que pour les grands événements urbains, en adaptant nos décors à l'ambiance détendue et bon enfant de la région.

Bolbec (76210) et la vallée du Commerce font pleinement partie de notre zone de couverture en Seine-Maritime. Grâce à la proximité de l'autoroute, nous y intervenons sans surcoût de déplacement, avec des tarifs à partir de 99€, livraison et installation incluses, et un devis personnalisé sous 24h.`,
    useCases: [
      'Mariages et noces dans les salles communales rénovées de la vallée du Commerce',
      "Anniversaires et fêtes de famille dans les domaines de la campagne cauchoise (Nointot, Mirville)",
      "Réceptions dans les demeures de caractère héritées du passé textile bolbécais",
      'Repas associatifs, fêtes de quartier et événements municipaux à Bolbec',
      "Soirées d'entreprise pour les sociétés implantées près de l'échangeur A29",
      'Baptêmes et communions à Gruchet-le-Valasse et dans les villages alentours',
    ],
    venues: [
      'Salle des fêtes de Bolbec — Espace du Manoir',
      'Domaine du Valasse à Gruchet-le-Valasse',
      'Salle polyvalente de Nointot',
      'Manoir de la Vallée du Commerce',
      'Salle communale de Mirville',
      'Domaine des Filatures — Bolbec',
      'Salle des associations de Bolbec',
      "Gîte de la Campagne Cauchoise",
      'Espace réception de Gruchet-le-Valasse',
      'Salle des fêtes de Lillebonne',
    ],
    localFaqs: [
      {
        q: 'Bolbec fait-elle partie de votre zone de déplacement gratuit ?',
        a: "Oui. Grâce à sa position le long de l'A29, Bolbec (76210) et la vallée du Commerce sont facilement accessibles depuis notre base. Le déplacement, l'installation et le démontage sont inclus dans le tarif, sans supplément kilométrique pour Bolbec, Gruchet-le-Valasse, Nointot et Mirville.",
      },
      {
        q: 'Intervenez-vous dans les petites salles des fêtes de village autour de Bolbec ?',
        a: "Tout à fait. Notre photobooth s'adapte aux salles communales de toutes tailles. Nous ajustons la configuration (fond toile, structure, disposition) à la surface disponible pour préserver l'espace dédié au repas et à la danse. Indiquez-nous simplement le lieu, nous anticipons l'installation.",
      },
      {
        q: 'Proposez-vous des décors adaptés aux fêtes de famille conviviales ?',
        a: "Oui, nous disposons d'une large gamme d'accessoires et de fonds, du plus festif au plus élégant. Pour les mariages et anniversaires bolbécais, nous personnalisons l'écran d'accueil et les tirages (prénoms, date, thème) afin de créer un souvenir unique et chaleureux pour vos invités.",
      },
      {
        q: 'Quel délai pour réserver un photobooth à Bolbec ?',
        a: "Pour un mariage en pleine saison (mai à septembre), prévoyez 4 à 5 mois d'anticipation. Pour un anniversaire, un baptême ou une fête associative, 2 à 3 semaines suffisent généralement. Plus vous réservez tôt, plus vous sécurisez votre date et le choix des options.",
      },
    ],
  },

  'lillebonne': {
    name: 'Lillebonne',
    slug: 'location-photobooth-lillebonne',
    postalCode: '76170',
    geo: { lat: 49.5197, lng: 0.5378 },
    areas: ['Lillebonne', 'Bolbec', 'Notre-Dame-de-Gravenchon (Port-Jérôme-sur-Seine)', 'Gruchet-le-Valasse', 'Saint-Antoine-la-Forêt'],
    localContext: `Lillebonne est une ville à l'histoire exceptionnelle, héritière directe de l'antique Juliobona, capitale gallo-romaine du pays cauchois. Elle abrite le plus grand théâtre romain conservé au nord de la Loire, monument spectaculaire qui pouvait accueillir des milliers de spectateurs et qui sert encore aujourd'hui de scène à des événements culturels. À ses côtés, le musée Juliobona et les vestiges du château médiéval ancrent la ville dans plus de deux millénaires d'histoire. Célébrer un événement à Lillebonne, c'est s'inscrire dans ce patrimoine vivant et singulier.

La ville occupe une position stratégique au cœur du Caux maritime, à la jonction du plateau et de la boucle de Seine. Tout près, le pôle industriel de Port-Jérôme-sur-Seine (Notre-Dame-de-Gravenchon) concentre raffineries et grandes industries, employant des milliers de personnes. Cette réalité économique génère un flux régulier d'événements professionnels — séminaires, soirées de cohésion, arbres de Noël — auxquels s'ajoutent les nombreuses fêtes de famille du bassin lillebonnais. Notre photobooth s'invite dans ces deux univers, du plus institutionnel au plus intime.

Intervenir à Lillebonne, c'est savoir naviguer entre un centre ancien riche en patrimoine et les vastes zones industrielles voisines, dont les accès sont parfois soumis à des règles de sécurité strictes. Notre équipe locale connaît bien ce territoire et adapte sa logistique à chaque contexte : installation soignée près du théâtre romain pour une réception culturelle, ou montage encadré sur un site industriel de Port-Jérôme.

Lillebonne (76170) et son bassin (Bolbec, Port-Jérôme, Gruchet-le-Valasse, Saint-Antoine-la-Forêt) font partie de notre zone d'intervention en Seine-Maritime, sans surcoût de déplacement. Tarifs à partir de 99€, livraison et installation incluses, devis personnalisé envoyé sous 24h.`,
    useCases: [
      "Séminaires, soirées de cohésion et arbres de Noël pour les industries de Port-Jérôme-sur-Seine",
      'Événements culturels et réceptions à proximité du théâtre romain de Juliobona',
      'Mariages et noces dans les salles et domaines du bassin lillebonnais',
      "Inaugurations et soirées corporate des entreprises de la vallée de Seine",
      'Anniversaires et fêtes de famille à Lillebonne et Gruchet-le-Valasse',
      "Baptêmes et communions dans les villages du Caux maritime (Saint-Antoine-la-Forêt)",
    ],
    venues: [
      'Salle des fêtes de Lillebonne — Espace Juliobona',
      "Théâtre romain de Lillebonne (événements culturels)",
      'Domaine de Port-Jérôme — Notre-Dame-de-Gravenchon',
      'Salle Jean-Prévost — Lillebonne',
      'Manoir de Saint-Antoine-la-Forêt',
      'Domaine du Valasse à Gruchet-le-Valasse',
      'Espace réception de Port-Jérôme-sur-Seine',
      "Salle polyvalente de Saint-Antoine-la-Forêt",
      "Château médiéval de Lillebonne (cadre extérieur)",
      'Gîte du Caux Maritime',
    ],
    localFaqs: [
      {
        q: "Intervenez-vous pour les soirées d'entreprise des industries de Port-Jérôme ?",
        a: "Oui, régulièrement. Le pôle industriel de Port-Jérôme-sur-Seine (Notre-Dame-de-Gravenchon) génère de nombreux séminaires et soirées de cohésion. Nous maîtrisons les procédures d'accès aux sites industriels (badges, contrôles de sécurité, horaires) et adaptons notre installation en conséquence.",
      },
      {
        q: 'Peut-on installer un photobooth pour un événement près du théâtre romain ?',
        a: "Oui. Le théâtre romain de Juliobona et ses abords accueillent des événements culturels. Selon l'emplacement et avec l'accord du gestionnaire, nous installons notre borne dans le respect du site historique : matériel autoportant, aucune fixation, câblage discret. Un repérage en amont permet de tout organiser.",
      },
      {
        q: 'Le déplacement à Lillebonne est-il facturé ?',
        a: "Non, Lillebonne (76170) et son bassin (Bolbec, Port-Jérôme, Gruchet-le-Valasse, Saint-Antoine-la-Forêt) font partie de notre zone d'intervention en Seine-Maritime. Trajet, installation et démontage sont compris dans le tarif annoncé, sans supplément kilométrique.",
      },
      {
        q: 'Proposez-vous des formules pour les arbres de Noël et événements de comité d\'entreprise ?',
        a: "Oui, nous avons des formules dédiées aux CSE et comités d'entreprise : forfaits soirée ou journée, tirages illimités personnalisés aux couleurs de la société, accessoires thématiques. Idéal pour les grands effectifs des industries lillebonnaises. Devis sur mesure sous 24h.",
      },
      {
        q: 'Quel délai de réservation conseillez-vous à Lillebonne ?',
        a: "Pour un mariage en haute saison, prévoyez 4 à 6 mois d'anticipation. Pour un événement d'entreprise en semaine ou une fête de famille, 3 à 4 semaines suffisent. Les soirées de fin d'année se réservant tôt, anticipez si possible dès la rentrée pour décembre.",
      },
    ],
  },

  'yvetot': {
    name: 'Yvetot',
    slug: 'location-photobooth-yvetot',
    postalCode: '76190',
    geo: { lat: 49.6175, lng: 0.7561 },
    areas: ['Yvetot', 'Allouville-Bellefosse', 'Sainte-Marie-des-Champs', 'Auzebosc', 'Écalles-Alix'],
    localContext: `Yvetot est le cœur battant du Pays de Caux, cette vaste campagne de plateau qui s'étend entre la Seine et la mer. Surnommée la « capitale du Caux », la ville rayonne sur tout un territoire rural grâce à ses marchés réputés, son dynamisme commercial et sa vie associative intense. En son centre s'élève l'étonnante église Saint-Pierre, chef-d'œuvre des années 1950 dont la verrière circulaire — la plus grande de France avec ses 1 046 m² de vitraux — baigne l'édifice d'une lumière unique au monde.

Terre d'agriculture et de traditions, le Pays de Caux yvetotais vit au rythme des fêtes de village, des comices agricoles et des grandes réceptions familiales. Les longères à colombages, les corps de ferme restaurés et les domaines champêtres y offrent des cadres authentiques et chaleureux, très recherchés pour les mariages cauchois. Tout près d'Yvetot, le chêne millénaire d'Allouville-Bellefosse, le plus vieux de France, rappelle l'enracinement profond de ce terroir. Notre photobooth s'intègre naturellement à cette ambiance conviviale et enracinée.

La situation d'Yvetot, à mi-chemin entre Rouen et Le Havre et bien desservie par l'A150 et la ligne ferroviaire, en fait un point de passage central que nous rejoignons aisément. Nous intervenons dans toute la couronne yvetotaise — Sainte-Marie-des-Champs, Auzebosc, Écalles-Alix, Allouville-Bellefosse — pour des événements aussi variés que les mariages champêtres, les anniversaires de ferme rénovée ou les fêtes associatives du plateau.

Yvetot (76190) et le Pays de Caux font pleinement partie de notre zone d'intervention en Seine-Maritime, sans surcoût de déplacement. Vous bénéficiez d'un photobooth premium à partir de 99€, livraison et installation incluses, avec un devis personnalisé sous 24h.`,
    useCases: [
      'Mariages champêtres dans les corps de ferme restaurés et longères du Pays de Caux',
      "Fêtes de village, comices agricoles et événements de la capitale du Caux",
      'Anniversaires et noces dans les domaines ruraux de la couronne yvetotaise',
      'Réceptions familiales à Allouville-Bellefosse, près du chêne millénaire',
      "Soirées associatives et bals du plateau cauchois (Auzebosc, Écalles-Alix)",
      "Soirées d'entreprise pour les commerces et PME du bassin yvetotais",
    ],
    venues: [
      'Salle des fêtes des Vikings — Yvetot',
      'Domaine du Chêne Millénaire à Allouville-Bellefosse',
      'Corps de ferme du Plateau Cauchois',
      'Manoir de Sainte-Marie-des-Champs',
      "Salle polyvalente d'Auzebosc",
      'Longère d\'Écalles-Alix',
      'Domaine des Colombages — Yvetot',
      'Salle communale d\'Allouville-Bellefosse',
      'Espace réception du Pays de Caux',
      'Ferme-auberge du Plateau',
    ],
    localFaqs: [
      {
        q: 'Yvetot et le Pays de Caux sont-ils couverts sans frais de déplacement ?',
        a: "Oui. Yvetot (76190), bien desservie par l'A150, et les communes voisines (Sainte-Marie-des-Champs, Auzebosc, Écalles-Alix, Allouville-Bellefosse) font partie de notre zone d'intervention en Seine-Maritime. Trajet, installation et démontage inclus, sans supplément kilométrique.",
      },
      {
        q: 'Êtes-vous habitués aux mariages champêtres dans les fermes et longères cauchoises ?',
        a: "Tout à fait, c'est un grand classique de notre activité dans le Pays de Caux. Nous installons régulièrement notre photobooth dans des corps de ferme restaurés, des granges et des longères à colombages. Nous adaptons le matériel aux sols (terre battue, pavés, parquet ancien) et aux espaces atypiques.",
      },
      {
        q: 'Peut-on installer le photobooth en extérieur dans un domaine champêtre ?',
        a: "Oui, en terrasse, sous chapiteau ou sous une grange ouverte. Nous prévoyons des lests pour stabiliser la borne en cas de vent de plateau et protégeons les composants de l'humidité. Une alimentation 220V à proximité est nécessaire ; nous fournissons les rallonges adaptées aux grands espaces.",
      },
      {
        q: 'Proposez-vous des prestations pour les fêtes associatives et comices du Caux ?',
        a: "Oui, nous intervenons volontiers pour les fêtes de village, comices agricoles et événements associatifs yvetotais. Nous proposons des formules adaptées à ces rassemblements (forfaits journée, tirages illimités, accessoires variés) et personnalisons les souvenirs aux couleurs de l'événement.",
      },
      {
        q: 'Quel délai de réservation pour un mariage à Yvetot ?',
        a: "Pour un mariage champêtre en haute saison (mai à septembre), comptez 4 à 6 mois d'anticipation, car les beaux domaines cauchois sont très demandés. Pour un anniversaire ou une fête associative, 2 à 3 semaines suffisent généralement. N'hésitez pas à nous contacter tôt.",
      },
    ],
  },

  'saint-romain-de-colbosc': {
    name: 'Saint-Romain-de-Colbosc',
    slug: 'location-photobooth-saint-romain-de-colbosc',
    postalCode: '76430',
    geo: { lat: 49.5314, lng: 0.3625 },
    areas: ['Saint-Romain-de-Colbosc', 'Saint-Gilles-de-Crétot', 'Sandouville', 'La Cerlangue', 'Étainhus'],
    localContext: `Saint-Romain-de-Colbosc est un bourg vivant du plateau de Caux, idéalement posé entre l'agglomération havraise, l'estuaire de la Seine et les célèbres falaises d'Étretat. Petite capitale de canton, la commune conserve une âme rurale et un marché animé, tout en bénéficiant d'une excellente accessibilité grâce à sa proximité avec les grands axes routiers. Cette position de carrefour, à la campagne mais à un quart d'heure de la mer, en fait un point de chute apprécié pour les réceptions et les fêtes de famille de tout le secteur.

Ce qui fait le charme de Saint-Romain-de-Colbosc et de ses environs, c'est la douceur de la campagne cauchoise : prairies bordées de talus plantés, fermes à colombages, hameaux paisibles d'Étainhus, La Cerlangue, Sandouville ou Saint-Gilles-de-Crétot. Ce décor verdoyant et préservé attire de plus en plus de couples en quête d'un mariage champêtre authentique, loin de l'agitation des villes, mais à courte distance du Havre. Notre photobooth y trouve naturellement sa place, dans une ambiance nature et conviviale.

Le territoire mêle vie rurale et activité économique : la plaine alluviale de l'estuaire, vers Sandouville et La Cerlangue, accueille de grands sites industriels et logistiques, sources d'événements professionnels ponctuels. Saint-Romain joue ainsi le rôle de trait d'union entre la campagne du plateau et l'effervescence de la zone portuaire havraise. Nous savons adapter nos prestations à ces deux mondes, du mariage à la ferme au séminaire d'entreprise.

Saint-Romain-de-Colbosc (76430) et son canton font partie intégrante de notre zone d'intervention en Seine-Maritime, à quelques minutes du Havre. Le déplacement est gratuit, avec des tarifs à partir de 99€, livraison et installation incluses, et un devis personnalisé envoyé sous 24h.`,
    useCases: [
      'Mariages champêtres dans les fermes et domaines de la campagne cauchoise',
      "Réceptions familiales et anniversaires dans les hameaux d'Étainhus et Saint-Gilles-de-Crétot",
      "Séminaires et soirées des entreprises de la plaine industrielle de Sandouville et La Cerlangue",
      'Fêtes de village, marchés festifs et événements communaux à Saint-Romain-de-Colbosc',
      'Baptêmes, communions et fêtes de famille dans les salles communales du canton',
      'Mariages nature à mi-chemin entre Le Havre et les falaises d\'Étretat',
    ],
    venues: [
      'Salle des fêtes de Saint-Romain-de-Colbosc',
      'Domaine de la Plaine Cauchoise — Étainhus',
      'Ferme-manoir de Saint-Gilles-de-Crétot',
      'Salle communale de La Cerlangue',
      'Domaine des Prairies — Saint-Romain-de-Colbosc',
      'Grange événementielle de Sandouville',
      "Salle polyvalente d'Étainhus",
      'Corps de ferme du Plateau de Caux',
      'Espace réception du Bourg',
      'Gîte champêtre de Saint-Gilles-de-Crétot',
    ],
    localFaqs: [
      {
        q: 'Saint-Romain-de-Colbosc fait-elle partie de votre zone gratuite ?',
        a: "Oui. Située à quelques minutes seulement du Havre, Saint-Romain-de-Colbosc (76430) et son canton (Étainhus, La Cerlangue, Sandouville, Saint-Gilles-de-Crétot) sont couverts sans aucun frais de déplacement. Trajet, installation et démontage sont inclus dans le tarif annoncé dès le devis.",
      },
      {
        q: 'Êtes-vous habitués aux mariages champêtres dans les fermes du secteur ?',
        a: "Tout à fait. La campagne autour de Saint-Romain est très prisée pour les mariages nature. Nous installons fréquemment notre photobooth dans des corps de ferme, granges et domaines champêtres, en adaptant le matériel aux espaces ruraux, aux sols variés et aux installations en extérieur.",
      },
      {
        q: 'Intervenez-vous aussi pour les entreprises de la zone industrielle de Sandouville ?',
        a: "Oui. La plaine de l'estuaire, vers Sandouville et La Cerlangue, accueille de grands sites industriels et logistiques. Nous intervenons pour leurs séminaires et soirées en respectant les consignes d'accès et de sécurité propres à ces sites (badges, horaires de chargement, contrôles).",
      },
      {
        q: 'Peut-on installer le photobooth en plein air pour un mariage à la campagne ?',
        a: "Oui, en terrasse, sous chapiteau ou sous une grange ouverte. Nous sécurisons la borne avec des lests contre le vent de plateau et protégeons les éléments sensibles de l'humidité. Une prise 220V à proximité est nécessaire ; nous fournissons les rallonges pour les grands espaces ruraux.",
      },
      {
        q: 'Quel délai pour réserver un photobooth à Saint-Romain-de-Colbosc ?',
        a: "Pour un mariage champêtre de printemps ou d'été, prévoyez 4 à 6 mois d'anticipation, les beaux domaines partant vite. Pour un anniversaire, un baptême ou une fête communale, 2 à 3 semaines suffisent en général. Contactez-nous tôt pour garantir votre date.",
      },
    ],
  },
};

export default CITIES;
