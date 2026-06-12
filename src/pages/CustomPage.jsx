import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { EyeOff } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useAdmin } from '../context/AdminContext';
import SectionRenderer from '../components/sections/SectionRenderer';
import NotFound from './NotFound';

/**
 * Page libre créée par le client via le CMS (dashboard → Pages libres).
 * Rendue 100% côté client : non prérendue, noindex par défaut (opt-in par page).
 */
export default function CustomPage() {
  const { slug } = useParams();
  const { content, remoteLoaded } = useContent();
  const { isAdminMode } = useAdmin();

  const page = (content.customPages || []).find((p) => p.slug === slug);

  // Pas encore trouvée mais le contenu distant n'est pas chargé → patienter
  // (évite un flash 404 pour le premier visiteur sans cache local).
  if (!page && !remoteLoaded) {
    return <div style={{ minHeight: '50vh' }} />;
  }
  if (!page) return <NotFound />;

  // Brouillon : invisible pour le public, prévisualisable en mode admin.
  if (page.visible === false && !isAdminMode) return <NotFound />;

  const seoTitle = page.seoTitle || `${page.title} — PhotoRoots`;
  const canonical = `https://photoroots.fr/p/${page.slug}`;

  return (
    <div className="animate-in">
      <Helmet>
        <title>{seoTitle}</title>
        {page.seoDesc && <meta name="description" content={page.seoDesc} />}
        <link rel="canonical" href={canonical} />
        {!page.indexable && <meta name="robots" content="noindex, nofollow" />}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={seoTitle} />
        {page.seoDesc && <meta property="og:description" content={page.seoDesc} />}
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="PhotoRoots" />
      </Helmet>

      {page.visible === false && isAdminMode && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: 'rgba(197,160,89,0.12)', border: '1px solid rgba(197,160,89,0.35)',
          color: 'var(--primary)', fontWeight: 700, fontSize: '13px',
          padding: '10px 16px', margin: '12px 20px', borderRadius: '12px',
        }}>
          <EyeOff size={15} /> Page masquée — seul le mode admin peut la voir. Activez « Page visible » pour la publier.
        </div>
      )}

      <SectionRenderer sections={page.sections} />
    </div>
  );
}
