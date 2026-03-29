import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const ContactButton = () => {

  return (
    <Link
      to="/contact"
      aria-label="Nous contacter"
      className="contact-float"
    >
      <Mail size={24} color="white" />
      <span className="contact-pulse" />
    </Link>
  );
};

export default ContactButton;
