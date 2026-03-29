import React from 'react';

const WhatsAppButton = () => {
  const phoneNumber = '33612345678';
  const message = encodeURIComponent('Bonjour ! Je souhaite réserver votre photobooth pour mon événement.');
  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous contacter sur WhatsApp"
      className="whatsapp-float"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="white">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.132 6.744 3.052 9.376L1.056 31.2l6.04-1.94A15.9 15.9 0 0016.004 32C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.31 22.608c-.39 1.098-1.932 2.01-3.184 2.276-.856.182-1.972.326-5.732-1.232-4.808-1.994-7.9-6.876-8.14-7.194-.23-.318-1.932-2.576-1.932-4.912s1.222-3.482 1.656-3.96c.434-.48.948-.6 1.264-.6.316 0 .632.002.908.016.292.016.682-.11 1.066.814.39.942 1.326 3.246 1.442 3.48.116.234.194.508.038.814-.156.318-.234.508-.468.786-.234.278-.492.62-.702.832-.234.234-.478.488-.206.958s1.214 2.004 2.606 3.248c1.79 1.598 3.298 2.094 3.768 2.328.468.234.742.194 1.014-.118.278-.312 1.178-1.37 1.492-1.842.316-.468.628-.39 1.06-.234.434.156 2.738 1.292 3.206 1.526.468.234.782.352.898.546.116.194.116 1.126-.274 2.224z"/>
      </svg>
      <span className="whatsapp-pulse" />
    </a>
  );
};

export default WhatsAppButton;
