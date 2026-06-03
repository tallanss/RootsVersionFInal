import { Phone } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const ContactButton = () => {
  const { content } = useContent();
  const phone = (content?.contact?.phone || '0603163621').replace(/\s/g, '');

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
