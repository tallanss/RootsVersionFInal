import CityLanding from './CityLanding';

const cityData = {
  name: 'Dieppe',
  slug: 'dieppe',
  postalCode: '76200',
  geo: { lat: 49.9229, lng: 1.0775 },
  areas: ['Dieppe', 'Pourville-sur-Mer', 'Hautot-sur-Mer', 'Arques-la-Bataille', 'Saint-Aubin-sur-Scie'],
  localContext: `Dieppe, c'est la ville la plus authentique de la Côte d'Albâtre : un port de pêche en activité, un château fort qui surveille la Manche depuis le XVe siècle, des falaises blanches qui s'étirent vers Pourville et Varengeville, et une plage de galets bordée par la fameuse "pelouse" — l'une des plus longues d'Europe. Cet ADN balnéaire et maritime imprègne profondément les événements dieppois : on s'y marie face à la mer, on y célèbre des anniversaires sur les hauteurs des falaises, on y organise des séminaires d'entreprise au son des mouettes.

Notre photobooth s'adapte parfaitement à cette ambiance bord de mer. Nous proposons des fonds personnalisables aux couleurs de la Côte d'Albâtre — bleu profond, blanc falaise, gris galet — et savons travailler dans les conditions parfois capricieuses du climat normand : vent de Manche, embruns, humidité. Notre matériel est protégé pour les installations sous tonnelle ou en terrasse face mer.

Intervenir à Dieppe, c'est aussi connaître les particularités logistiques d'une ville construite entre falaises et port. Les accès aux quartiers du Pollet ou aux hauteurs du Bout-du-Quai demandent une certaine anticipation, surtout les soirs de marée haute ou en période de festivals (Foire aux Harengs, Festival International de Cerfs-Volants). Nous gérons ces aspects en amont avec vous.

PhotoRoots est l'un des rares photoboothes vraiment basés en Seine-Maritime à monter régulièrement à Dieppe et sur la Côte d'Albâtre. Cette proximité — environ 1h depuis nos locaux — nous permet d'inclure le déplacement gratuitement dans le 76200 et les communes voisines, là où d'autres prestataires factureraient un déplacement "longue distance". Tarifs à partir de 99€, sans surprise.`,
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
    'Château d\'Arques-la-Bataille',
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
      q: 'Travaillez-vous au Casino de Dieppe ou au Manoir d\'Ango ?',
      a: "Oui, ce sont deux lieux où nous sommes intervenus à plusieurs reprises. Au Casino Partouche, nous connaissons les zones de chargement et l'équipe technique. Au Manoir d'Ango (Varengeville, à 10 min de Dieppe), nous savons gérer les contraintes d'un monument historique : pas de perçage, accès limité aux véhicules, etc.",
    },
    {
      q: "Le photobooth résiste-t-il au climat venteux de la Côte d'Albâtre ?",
      a: "Notre matériel est conçu pour fonctionner en intérieur. Pour une installation en extérieur ou semi-couverte (terrasse, tonnelle, chapiteau), nous prévoyons des lests pour stabiliser la borne et protégeons les composants sensibles. En cas de vent fort annoncé, nous adaptons toujours l'installation avec vous le matin de l'événement.",
    },
    {
      q: 'Combien de temps à l\'avance réserver pour un mariage à Dieppe ?',
      a: "Les week-ends d'été (juin-août) sur la Côte d'Albâtre sont très demandés. Nous recommandons de réserver 5 à 7 mois à l'avance pour un mariage. Pour un anniversaire en semaine ou un événement d'entreprise hors saison, 3 à 4 semaines de préavis sont généralement suffisantes.",
    },
  ],
};

export default function Dieppe() {
  return <CityLanding cityData={cityData} />;
}
