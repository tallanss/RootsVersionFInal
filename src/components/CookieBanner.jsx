import React, { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';

const COOKIE_KEY = 'photoroots_cookies_accepted';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_KEY);
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.classList.add('cookie-banner-visible');
    } else {
      document.body.classList.remove('cookie-banner-visible');
    }
    return () => document.body.classList.remove('cookie-banner-visible');
  }, [visible]);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'true');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-content">
        <div className="cookie-banner-icon">
          <Shield size={20} />
        </div>
        <div className="cookie-banner-text">
          <p className="cookie-banner-title">Respect de votre vie privée</p>
          <p className="cookie-banner-desc">
            Nous utilisons des cookies pour améliorer votre expérience. 
            <a href="/mentions-legales" style={{ color: 'var(--primary)', marginLeft: '4px' }}>En savoir plus</a>
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button onClick={decline} className="cookie-btn-decline">Refuser</button>
          <button onClick={accept} className="cookie-btn-accept">Accepter</button>
        </div>
        <button onClick={decline} className="cookie-banner-close" aria-label="Fermer">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
