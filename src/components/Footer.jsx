import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import EditableBlock from './admin/EditableBlock';
import { RENTAL_OPTIONS_ENABLED } from '../config/features';
import { processBooking } from '../services/emailService';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Formulaire newsletter du pied de page (#62). En attendant une connexion Brevo,
// chaque inscription est notifiée au propriétaire via le script e-mail existant.
const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | done | error

  const submit = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) { setStatus('error'); return; }
    // Anti-abus : 1 inscription max / 60s par session (évite le spam de l'e-mail
    // propriétaire et l'envoi de confirmations à des adresses arbitraires).
    const last = sessionStorage.getItem('pr_newsletter_last');
    if (last && Date.now() - Number(last) < 60000) { setStatus('done'); return; }
    sessionStorage.setItem('pr_newsletter_last', String(Date.now()));
    setStatus('loading');
    try {
      await processBooking({ type: 'message', name: 'Inscription newsletter', email, message: `Nouvelle inscription à la newsletter (pied de page) : ${email}` });
    } catch { /* no-cors : on ne peut pas lire la réponse, on considère l'envoi OK */ }
    setStatus('done');
    setEmail('');
  };

  if (status === 'done') {
    return (
      <p style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '15px', margin: 0 }}>
        <CheckCircle2 size={18} /> Merci, votre inscription est bien prise en compte !
      </p>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ minWidth: '220px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px' }}>Restez informé</h3>
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0 }}>Nos actus, offres et inspirations photobooth, de temps en temps.</p>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1, minWidth: '260px', maxWidth: '420px', justifyContent: 'flex-end' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
          placeholder="Votre email"
          aria-label="Votre email pour la newsletter"
          className="form-input"
          style={{ flex: 1, minWidth: '180px' }}
        />
        <button type="submit" disabled={status === 'loading'} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '12px 20px', fontWeight: 800, whiteSpace: 'nowrap' }}>
          <Send size={16} /> {status === 'loading' ? '…' : "S'inscrire"}
        </button>
        {status === 'error' && <span style={{ width: '100%', textAlign: 'right', color: '#ef4444', fontSize: '12px' }}>Veuillez saisir un email valide.</span>}
      </div>
    </form>
  );
};

const safeUrl = (url) => {
  if (!url) return '#';
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:' ? url : '#';
  } catch {
    return '#';
  }
};

const Footer = () => {
  const { content, updateContent } = useContent();
  const currentYear = new Date().getFullYear();
  // L'onglet « Prestations » n'apparaît que s'il y a au moins une prestation active.
  const hasActiveProducts = (content.products || []).some((p) => p.visible !== false);

  return (
    <footer style={{ 
      background: '#faf7f2', 
      borderTop: '1px solid rgba(197, 160, 89, 0.15)',
      padding: '60px 24px 120px', // Extra bottom padding for BottomNav
      marginTop: 'auto',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
        
        {/* BRAND & DESC */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img 
              src={content.theme?.logoUrl || "/logo-gold.png"} 
              alt="PhotoRoots Logo" 
              style={{ height: '60px', width: 'auto', objectFit: 'contain' }} 
            />
          </Link>
          <EditableBlock
            label="Description"
            modalTitle="Description Bas de Page"
            fields={[
              { key: 'footerDesc', label: 'Texte', type: 'textarea', value: content.footerDesc || "L'excellence du photobooth premium en Normandie. Sublimez vos événements avec nos bornes photos innovantes et élégantes." }
            ]}
            onSave={(vals) => updateContent(vals)}
          >
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, maxWidth: '300px' }}>
              {content.footerDesc || "L'excellence du photobooth premium en Normandie. Sublimez vos événements avec nos bornes photos innovantes et élégantes."}
            </p>
          </EditableBlock>
          <div style={{ display: 'flex', gap: '12px' }}>
            {content.socials?.instagram && <a href={safeUrl(content.socials.instagram)} className="social-icon" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>}
            {content.socials?.facebook && <a href={safeUrl(content.socials.facebook)} className="social-icon" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>}
          </div>
        </div>

        {/* QUICK LINKS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>Navigation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {content.navigation
              ?.filter(item => hasActiveProducts || (item.id !== 'prestations' && item.path !== '/prestations'))
              .map(item => (
                <Link key={item.id} to={item.path} style={linkStyle}>{item.label}</Link>
              ))}
            {/* Liens fixes — masqués si le client les a déjà ajoutés à son menu (anti-doublon) */}
            {!content.navigation?.some(i => i.path === '/photobooth') && <Link to="/photobooth" style={linkStyle}>Photobooth</Link>}
            {!content.navigation?.some(i => i.path === '/blog') && <Link to="/blog" style={linkStyle}>Blog &amp; conseils</Link>}
            {RENTAL_OPTIONS_ENABLED && !content.navigation?.some(i => i.path === '/options-a-louer') && <Link to="/options-a-louer" style={linkStyle}>Options à louer</Link>}
          </div>
        </div>

        {/* ZONES DESSERVIES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>Zones desservies</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/location-photobooth-le-havre" style={linkStyle}>Photobooth Le Havre</Link>
            <Link to="/location-photobooth-montivilliers" style={linkStyle}>Photobooth Montivilliers</Link>
            <Link to="/location-photobooth-harfleur" style={linkStyle}>Photobooth Harfleur</Link>
            <Link to="/location-photobooth-fecamp" style={linkStyle}>Photobooth Fécamp</Link>
            <Link to="/location-photobooth-etretat" style={linkStyle}>Photobooth Étretat</Link>
            <Link to="/location-photobooth-bolbec" style={linkStyle}>Photobooth Bolbec</Link>
            <Link to="/location-photobooth-lillebonne" style={linkStyle}>Photobooth Lillebonne</Link>
            <Link to="/location-photobooth-yvetot" style={linkStyle}>Photobooth Yvetot</Link>
            <Link to="/location-photobooth-saint-romain-de-colbosc" style={linkStyle}>Photobooth St-Romain-de-Colbosc</Link>
            <Link to="/location-photobooth-rouen" style={linkStyle}>Photobooth Rouen</Link>
            <Link to="/location-photobooth-dieppe" style={linkStyle}>Photobooth Dieppe</Link>
          </div>
        </div>

        {/* CONTACT INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>Contact</h3>
          <EditableBlock
            label="Infos Contact"
            modalTitle="Informations de Contact"
            fields={[
              { key: 'phone', label: 'Téléphone', type: 'text', value: content.contact?.phone || "06 03 16 36 21" },
              { key: 'email', label: 'Email', type: 'text', value: content.contact?.email || "contact@photoroots.fr" },
              { key: 'location', label: 'Zone', type: 'text', value: content.contact?.location || "Normandie : Le Havre, Rouen, Dieppe" },
            ]}
            onSave={(vals) => updateContent({ contact: { ...content.contact, ...vals } })}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href={`tel:${(content.contact?.phone || "06 03 16 36 21").replace(/\s/g, '')}`} style={{ ...infoStyle, color: 'inherit', textDecoration: 'none' }}><Phone size={16} /> {content.contact?.phone || "06 03 16 36 21"}</a>
              <a href={`mailto:${content.contact?.email || "contact@photoroots.fr"}`} style={{ ...infoStyle, color: 'inherit', textDecoration: 'none' }}><Mail size={16} /> {content.contact?.email || "contact@photoroots.fr"}</a>
              <a href="https://www.google.com/search?q=photoroots" target="_blank" rel="noopener noreferrer" style={{ ...infoStyle, color: 'inherit', textDecoration: 'none' }}><MapPin size={16} /> {content.contact?.zone || content.contact?.location || "Normandie : Le Havre, Rouen, Dieppe"}</a>
            </div>
          </EditableBlock>
        </div>
      </div>

      {/* NEWSLETTER (#62) */}
      <div className="container" style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border-light)' }}>
        <NewsletterForm />
      </div>

      {/* BOTTOM BAR */}
      <div className="container" style={{
        marginTop: '40px',
        paddingTop: '24px',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          © {currentYear} PhotoRoots. Tous droits réservés.
        </div>
        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', alignItems: 'center' }}>
          <Link to="/mentions-legales" style={linkStyle}>Mentions Légales</Link>
          <Link to="/admin" style={{ ...linkStyle, opacity: 0.6, fontSize: '11px', border: '1px solid var(--border-light)', padding: '2px 8px', borderRadius: '4px' }}>Admin</Link>
        </div>
      </div>

      <style>{`
        .social-icon { 
          width: 40px; 
          height: 40px; 
          border-radius: 50%; 
          background: rgba(255, 255, 255, 0.05); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: var(--text-main);
          border: 1px solid var(--border-light);
          transition: all 0.3s ease;
        }
        .social-icon:hover {
          color: var(--primary);
          border-color: var(--primary);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px var(--accent-glow);
        }
      `}</style>
    </footer>
  );
};

const linkStyle = {
  color: 'var(--text-muted)',
  textDecoration: 'none',
  fontSize: '14px',
  transition: 'color 0.2s',
};

const infoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: 'var(--text-muted)',
  fontSize: '14px'
};

export default Footer;
