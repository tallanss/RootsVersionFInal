import CityLanding from './CityLanding';

const cityData = {
  name: 'Le Havre',
  slug: 'le-havre',
  postalCode: '76600',
  geo: { lat: 49.4944, lng: 0.1079 },
  areas: ['Le Havre', 'Sainte-Adresse', 'Octeville-sur-Mer', 'Montivilliers', 'Harfleur', "Gonfreville-l'Orcher"],
  localContext: `Implantés au cœur de la Seine-Maritime, nous connaissons Le Havre comme notre poche : du quartier Saint-François aux plages de Sainte-Adresse, en passant par les façades en béton signées Auguste Perret classées au patrimoine mondial de l'UNESCO. Cette identité unique — entre architecture d'après-guerre, port de commerce et front de mer — donne à chaque événement havrais un cachet particulier que nous adorons mettre en valeur dans nos décors photobooth.

Le Havre, c'est aussi une ville de fêtes. Entre les soirées d'entreprise des grands groupes installés sur la zone industrielle, les mariages dans les villas de la Côte ou les anniversaires sur les hauteurs du Havre, nous intervenons toute l'année dans le 76600 et ses environs. Notre proximité géographique nous permet d'arriver en moins de 30 minutes depuis nos locaux, sans frais de déplacement supplémentaires.

Choisir PhotoRoots au Havre, c'est s'assurer une équipe locale qui connaît les contraintes de chaque salle havraise : la luminosité particulière des espaces face à la mer, les accès parfois étroits du centre Perret, la logistique des grandes salles type Pasino ou Carré des Docks. Nous arrivons préparés, jamais en repérage, ce qui garantit une installation rapide et sans accroc.

Enfin, parce que nous travaillons quasi-exclusivement en Seine-Maritime, nos prix restent très compétitifs sur la zone du Havre : pas de surcoût kilométrique, pas de marge de "déplacement exceptionnel", juste un tarif transparent à partir de 99€ pour un photobooth premium installé chez vous.`,
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
    'Hôtel Vent d\'Ouest — quartier Saint-François',
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
};

export default function LeHavre() {
  return <CityLanding cityData={cityData} />;
}
