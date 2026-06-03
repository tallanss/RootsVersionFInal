import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, Camera, ArrowRight } from 'lucide-react';

const NotFound = () => (
  <div className="animate-in">
    <Helmet>
      <title>Page introuvable — PhotoRoots</title>
      <meta name="description" content="Cette page n'existe pas. Retournez à l'accueil ou réservez votre photobooth." />
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>

    <section className="container" style={{
      minHeight: '70vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', textAlign: 'center',
    }}>
      {/* Illustration */}
      <div style={{
        width: '96px', height: '96px', borderRadius: '50%',
        background: 'var(--bg-secondary)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: '24px', border: '2px solid var(--border-light)',
      }}>
        <Camera size={40} color="var(--primary)" />
      </div>

      {/* Code */}
      <div style={{
        fontSize: '72px', fontWeight: 900, lineHeight: 1,
        color: 'var(--primary)', marginBottom: '16px',
        letterSpacing: '-4px',
      }}>
        404
      </div>

      <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '10px', color: 'var(--text-main)' }}>
        Cette page est introuvable
      </h1>
      <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '320px', lineHeight: 1.6 }}>
        L'URL demandée n'existe pas ou a été déplacée.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/">
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px' }}>
            <Home size={16} />
            Retour à l'accueil
          </button>
        </Link>
        <Link to="/contact">
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px' }}>
            Obtenir un devis
            <ArrowRight size={16} />
          </button>
        </Link>
      </div>
    </section>
  </div>
);

export default NotFound;
