import CityLanding from './CityLanding';

const cityData = {
  name: 'Rouen',
  slug: 'rouen',
  postalCode: '76000',
  geo: { lat: 49.4432, lng: 1.0993 },
  areas: ['Rouen', 'Sotteville-lès-Rouen', 'Bois-Guillaume', 'Mont-Saint-Aignan', 'Bonsecours', 'Le Mesnil-Esnard'],
  localContext: `Rouen, capitale historique de la Normandie, est sans doute la ville la plus chargée de patrimoine de toute la région. La cathédrale Notre-Dame, immortalisée par Monet, le Gros-Horloge, les ruelles à colombages du centre médiéval ou encore l'abbatiale Saint-Ouen : autant de décors qui donnent à un mariage ou un événement rouennais une dimension cinématographique. Notre photobooth s'intègre dans cette élégance avec des fonds personnalisables qui peuvent reprendre les codes graphiques de la ville aux cent clochers.

Le tissu événementiel rouennais est particulièrement riche : grands hôtels de réception en centre-ville, châteaux des coteaux nord (Bois-Guillaume, Mont-Saint-Aignan), domaines viticoles autour du Mesnil-Esnard, salles modernes en bord de Seine côté rive gauche. Nous intervenons sur tous ces formats, du mariage intimiste de 50 invités au gala d'entreprise de 400 personnes pour les sièges sociaux rouennais (Matmut, Crédit Agricole Normandie-Seine, etc.).

Travailler à Rouen, c'est aussi maîtriser les particularités de circulation et de stationnement du centre-ville historique, classé secteur sauvegardé. Notre équipe locale connaît les arrêtés municipaux, les zones piétonnes du quartier Vieux-Marché et les accès logistiques aux salles classées. Cette expertise terrain évite bien des mauvaises surprises le jour J.

PhotoRoots est l'un des rares prestataires photobooth réellement basés en Seine-Maritime à intervenir aussi régulièrement sur le bassin rouennais. Cela nous permet d'offrir des tarifs cohérents — à partir de 99€ — sans la majoration "Paris-Rouen" appliquée par les loueurs franciliens qui se déplacent en région.`,
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
};

export default function Rouen() {
  return <CityLanding cityData={cityData} />;
}
