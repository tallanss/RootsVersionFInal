import { Phone } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

const ContactButton = () => {
  const { content } = useContent();
  const { pathname } = useLocation();
  const phone = (content?.contact?.phone || '0603163621').replace(/\s/g, '');

  // Sur la page Contact/devis, le bouton flottant est redondant (formulaire,
  // « Appelez-nous » et numéro déjà présents) et recouvrait les champs/puces.
  // On le masque donc là pour ne plus gêner la saisie.
  if (pathname === '/contact') return null;

  return (
    <a
      href={`tel:${phone}`}
      aria-label="Nous appeler"
      title="Appelez-nous"
      className="contact-float"
    >
      <Phone size={24} color="white" />
      <span className="contact-pulse" />
    </a>
  );
};

export default ContactButton;
