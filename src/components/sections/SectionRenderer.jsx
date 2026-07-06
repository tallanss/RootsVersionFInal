import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Star,
  ChevronDown,
  CheckCircle2,
  Phone,
  ArrowRight,
  BadgeCheck,
  Type,
  Image as ImageIcon,
  LayoutGrid,
  Megaphone,
  HelpCircle,
  MessageSquareQuote,
  Tag,
  Mail,
  Heading1,
  Images,
  Share2,
  Check,
} from 'lucide-react';
import PremiumImage from '../PremiumImage';
import AnimatedButton from '../AnimatedButton';
import { useContent } from '../../context/ContentContext';
import { formatPrice } from '../../utils/galleryFormat';

/* ============================================================
 * Bibliothèque de blocs des « Pages libres » (CMS)
 * ------------------------------------------------------------
 * Chaque bloc réutilise les classes CSS existantes du site
 * (section-tag, section-title, cta-section, faq-*, testimonial-*,
 * pricing-*, gallery-grid…) pour rester 100% cohérent visuellement.
 *
 * SECTION_LIBRARY est la source de vérité partagée entre le rendu
 * public (SectionRenderer) et l'éditeur admin (PageBuilder).
 * ============================================================ */

/* ── Blocs ── */

const HeroBlock = ({ tag, title, subtitle, image, ctaLabel, ctaLink }) => (
  <section className="container" style={{ padding: '48px 24px 16px' }}>
    {tag && <div className="section-tag"><Sparkles size={14} /> {tag}</div>}
    {title && <h1 className="section-title" style={{ fontSize: '32px' }}>{title}</h1>}
    {subtitle && <p className="section-subtitle">{subtitle}</p>}
    {image && (
      <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginTop: '20px', boxShadow: 'var(--shadow-md)' }}>
        <PremiumImage src={image} alt={title || ''} />
      </div>
    )}
    {ctaLabel && (
      <div style={{ marginTop: '24px' }}>
        <AnimatedButton to={ctaLink || '/contact'} className="btn-primary" style={{ width: 'auto', padding: '14px 32px' }}>
          {ctaLabel} <ArrowRight size={17} />
        </AnimatedButton>
      </div>
    )}
  </section>
);

const RichTextBlock = ({ title, body }) => (
  <section className="container" style={{ padding: '24px' }}>
    {title && <h2 className="section-title" style={{ fontSize: '24px' }}>{title}</h2>}
    <div style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8 }}>
      {String(body || '').split(/\n\s*\n/).filter(Boolean).map((p, i) => (
        <p key={i} style={{ marginBottom: '14px', whiteSpace: 'pre-line' }}>{p}</p>
      ))}
    </div>
  </section>
);

const ImageBlock = ({ src, alt, caption }) => (
  <section className="container" style={{ padding: '16px 24px' }}>
    {src && (
      <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
        <PremiumImage src={src} alt={alt || caption || ''} />
      </div>
    )}
    {caption && <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-light)', marginTop: '10px' }}>{caption}</p>}
  </section>
);

const ImageGridBlock = ({ title, images }) => (
  <section className="container" style={{ padding: '24px' }}>
    {title && <h2 className="section-title" style={{ fontSize: '24px' }}>{title}</h2>}
    <div className="gallery-grid" style={{ marginTop: '16px' }}>
      {(images || []).filter((im) => im && im.src).map((im, i) => (
        <div key={i} className="gallery-item">
          <PremiumImage src={im.src} alt={im.alt || ''} />
        </div>
      ))}
    </div>
  </section>
);

const CtaBlock = ({ title, desc, btnLabel, btnLink }) => (
  <section className="container" style={{ padding: '24px 20px' }}>
    <div className="cta-section">
      {title && <h2>{title}</h2>}
      {desc && <p>{desc}</p>}
      {btnLabel && (
        <AnimatedButton
          to={btnLink || '/contact'}
          className="btn-primary"
          style={{ background: '#ffffff', color: 'var(--primary)', width: 'auto', padding: '16px 36px', fontWeight: 800 }}
        >
          {btnLabel} <ArrowRight size={18} />
        </AnimatedButton>
      )}
    </div>
  </section>
);

const FaqBlock = ({ title, items }) => {
  const [open, setOpen] = useState(null);
  const faqs = (items || []).filter((f) => f && f.q);
  if (faqs.length === 0) return null;
  return (
    <section className="container" style={{ padding: '24px' }}>
      {title && <h2 className="section-title" style={{ fontSize: '24px' }}>{title}</h2>}
      <div style={{ marginTop: '8px' }}>
        {faqs.map((faq, i) => (
          <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
            <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
              <span>{faq.q}</span>
              <ChevronDown size={18} />
            </button>
            {open === i && <div className="faq-answer">{faq.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

const TestimonialsBlock = ({ title, items }) => {
  const reviews = (items || []).filter((t) => t && t.text);
  if (reviews.length === 0) return null;
  return (
    <section className="container" style={{ padding: '24px' }}>
      {title && <h2 className="section-title" style={{ fontSize: '24px' }}>{title}</h2>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '16px' }}>
        {reviews.map((t, i) => (
          <div key={i} className="testimonial-card">
            <div className="testimonial-stars" aria-hidden="true" style={{ display: 'flex', gap: '2px' }}>
              {[0, 1, 2, 3, 4].map((s) => (
                <Star key={s} size={14} fill="var(--primary)" color="var(--primary)" strokeWidth={0} />
              ))}
            </div>
            <p className="testimonial-text">"{t.text}"</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>
              <BadgeCheck size={13} color="var(--primary)" /> Avis vérifié
            </span>
            <div className="testimonial-author">
              <div className="testimonial-avatar">{(t.name || '?').charAt(0).toUpperCase()}</div>
              <div>
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const PricingTableBlock = ({ title, planIds }) => {
  const { content } = useContent();
  const all = content.pricing_plans || [];
  const plans = (Array.isArray(planIds) && planIds.length > 0) ? all.filter((p) => planIds.includes(p.id)) : all;
  if (plans.length === 0) return null;
  return (
    <section className="container" style={{ padding: '24px 0' }}>
      {title && (
        <div style={{ padding: '0 24px' }}>
          <h2 className="section-title" style={{ fontSize: '24px' }}>{title}</h2>
        </div>
      )}
      <div className="pricing-grid">
        {plans.map((plan) => {
          const isFeatured = Boolean(plan.featured);
          const card = (
            <div className={`pricing-card${isFeatured ? ' featured' : ''}`}>
              <div className="pricing-name">{plan.name}</div>
              <div className="pricing-price">{formatPrice(plan.price)}</div>
              <div className="pricing-desc">{plan.desc}</div>
              <ul className="pricing-features">
                {(plan.features || []).slice(0, 3).map((f, j) => (
                  <li key={j}>
                    <span className="pricing-check"><CheckCircle2 size={14} /></span>{f}
                  </li>
                ))}
              </ul>
              <AnimatedButton
                to={`/tarifs?pack=${plan.id}`}
                className={isFeatured ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%' }}
              >
                Choisir ce pack
              </AnimatedButton>
            </div>
          );
          return isFeatured
            ? <div key={plan.id} className="animated-border-wrapper">{card}</div>
            : <div key={plan.id}>{card}</div>;
        })}
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/tarifs" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          Voir tous les tarifs <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};

const ContactCtaBlock = ({ title, desc, btnLabel }) => {
  const { content } = useContent();
  const phone = content.contact?.phone || '06 03 16 36 21';
  return (
    <section className="container" style={{ padding: '24px 20px' }}>
      <div className="cta-section">
        {title && <h2>{title}</h2>}
        {desc && <p>{desc}</p>}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <AnimatedButton
            to="/contact"
            className="btn-primary"
            style={{ background: '#ffffff', color: 'var(--primary)', width: 'auto', padding: '16px 36px', fontWeight: 800 }}
          >
            {btnLabel || 'Obtenir un devis'}
          </AnimatedButton>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontWeight: 700, textDecoration: 'none', padding: '14px 20px' }}
          >
            <Phone size={18} /> {phone}
          </a>
        </div>
      </div>
    </section>
  );
};

// Accepte une URL simple OU un code d'intégration <iframe …> : dans ce dernier
// cas on en extrait UNIQUEMENT l'attribut src (on n'injecte jamais le HTML brut
// collé → anti-XSS). Seules les URL http(s) sont autorisées.
const safeIframeUrl = (input) => {
  let raw = String(input || '').trim();
  if (/<iframe/i.test(raw)) {
    const m = raw.match(/\ssrc\s*=\s*["']([^"']+)["']/i);
    raw = m ? m[1].replace(/&amp;/g, '&').trim() : '';
  }
  try {
    const x = new URL(raw);
    return (x.protocol === 'https:' || x.protocol === 'http:') ? x.href : null;
  } catch {
    return null;
  }
};

// Largeur de l'iframe selon le nombre de photos par ligne souhaité.
// fotoshare adapte sa grille à la largeur disponible → moins large = moins
// de colonnes. Largeurs mesurées sur les albums du client (photos grandes) :
// ~480px = 1 · ~720px = 2 · ~880px = 3 photos par ligne.
const PER_ROW_WIDTH = { 1: 480, 2: 720, 3: 880 };
const PER_ROW_OPTIONS = [1, 2, 3];

const IframeBlock = ({ url, height }) => {
  const src = safeIframeUrl(url);
  const h = Number(height) || 720;
  const [shared, setShared] = useState(false);
  const [perRow, setPerRow] = useState(3); // 1 | 2 | 3 photos par ligne

  // Partage l'adresse PhotoRoots de CETTE page (et non le lien fotoshare) :
  // menu de partage natif sur mobile, sinon copie du lien dans le presse-papier.
  const shareGallery = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title: document.title, url: shareUrl }); } catch (_) { /* partage annulé */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch (_) {
      window.prompt('Copiez le lien de la galerie :', shareUrl);
    }
  };

  if (!src) {
    return (
      <section className="container" style={{ padding: '24px' }}>
        <div style={{ textAlign: 'center', padding: '40px 24px', border: '1px dashed var(--border-medium)', borderRadius: '18px', color: 'var(--text-muted)' }}>
          Galerie à venir — l'adresse n'a pas encore été renseignée.
        </div>
      </section>
    );
  }

  const rowBtn = (active) => ({
    minWidth: '34px', padding: '7px 13px', borderRadius: '999px', border: 'none', cursor: 'pointer',
    fontSize: '13px', fontWeight: 700, lineHeight: 1,
    background: active ? 'var(--primary)' : 'transparent',
    color: active ? '#fff' : 'var(--text-muted)',
    transition: 'background 0.2s ease, color 0.2s ease',
  });

  return (
    <section className="gallery-iframe-wrap">
      {/* Barre au-dessus de la galerie : choix du nombre de photos par ligne + partage */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '9px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Photos par ligne</span>
          <div style={{ display: 'inline-flex', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '999px', padding: '3px', gap: '3px' }}>
            {PER_ROW_OPTIONS.map((n) => (
              <button key={n} type="button" onClick={() => setPerRow(n)} style={rowBtn(perRow === n)} aria-label={`${n} photos par ligne`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={shareGallery}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: shared ? 'rgba(34,197,94,0.12)' : 'var(--primary)',
            color: shared ? '#16a34a' : '#fff',
            border: 'none', borderRadius: '999px', padding: '10px 20px',
            fontWeight: 700, fontSize: '14px', cursor: 'pointer',
            boxShadow: shared ? 'none' : '0 4px 14px var(--accent-glow)',
            transition: 'background 0.2s ease, color 0.2s ease',
          }}
        >
          {shared ? <Check size={16} /> : <Share2 size={16} />}
          {shared ? 'Lien copié !' : 'Partager la galerie'}
        </button>
      </div>

      {/* Galerie : la largeur pilote le nombre de photos par ligne côté fotoshare */}
      <div style={{ maxWidth: `${PER_ROW_WIDTH[perRow]}px`, width: '100%', margin: '0 auto' }}>
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)', background: 'var(--bg-card)' }}>
          <iframe
            src={src}
            title="Galerie photos"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox allow-downloads"
            allow="fullscreen; web-share; clipboard-write"
            style={{ width: '100%', height: `${h}px`, border: 0, display: 'block' }}
          />
        </div>
      </div>
    </section>
  );
};

/* ── Registre des blocs ──
 * fields : props plates éditées via EditModal (les types text/textarea/image
 * correspondent aux champs supportés par EditModal).
 * list : props de type liste, éditées via l'ItemListEditor du PageBuilder.
 */
export const SECTION_LIBRARY = {
  iframe: {
    label: 'Galerie (intégration)',
    hint: "Colle le lien OU le code d'intégration (iframe) de la galerie",
    icon: Images,
    Component: IframeBlock,
    defaultProps: { url: '', height: 720 },
    fields: [
      { key: 'url', label: "Lien OU code d'intégration (iframe) de la galerie", type: 'textarea' },
      { key: 'height', label: 'Hauteur en pixels (ex : 720)', type: 'text' },
    ],
  },
  hero: {
    label: 'En-tête de page',
    hint: 'Tag, titre, sous-titre, image et bouton (tous optionnels)',
    icon: Heading1,
    Component: HeroBlock,
    defaultProps: { tag: 'PhotoRoots', title: 'Titre de la page', subtitle: '', image: '', ctaLabel: '', ctaLink: '/contact' },
    fields: [
      { key: 'tag', label: 'Tag (petit texte au-dessus du titre)', type: 'text' },
      { key: 'title', label: 'Titre', type: 'text' },
      { key: 'subtitle', label: 'Sous-titre', type: 'textarea' },
      { key: 'image', label: 'Image (optionnelle)', type: 'image' },
      { key: 'ctaLabel', label: 'Texte du bouton (vide = pas de bouton)', type: 'text' },
      { key: 'ctaLink', label: 'Lien du bouton (ex: /contact)', type: 'text' },
    ],
  },
  richText: {
    label: 'Bloc de texte',
    hint: 'Titre + paragraphes (séparés par une ligne vide)',
    icon: Type,
    Component: RichTextBlock,
    defaultProps: { title: '', body: 'Votre texte ici…' },
    fields: [
      { key: 'title', label: 'Titre (optionnel)', type: 'text' },
      { key: 'body', label: 'Texte (ligne vide = nouveau paragraphe)', type: 'textarea' },
    ],
  },
  image: {
    label: 'Image seule',
    hint: 'Une grande image avec légende optionnelle',
    icon: ImageIcon,
    Component: ImageBlock,
    defaultProps: { src: '', alt: '', caption: '' },
    fields: [
      { key: 'src', label: 'Image', type: 'image' },
      { key: 'alt', label: 'Description (SEO/accessibilité)', type: 'text' },
      { key: 'caption', label: 'Légende (optionnelle)', type: 'text' },
    ],
  },
  imageGrid: {
    label: "Grille d'images",
    hint: 'Plusieurs images en grille (comme la galerie)',
    icon: LayoutGrid,
    Component: ImageGridBlock,
    defaultProps: { title: '', images: [] },
    fields: [{ key: 'title', label: 'Titre (optionnel)', type: 'text' }],
    list: {
      key: 'images',
      label: 'Images',
      itemLabel: 'image',
      itemFields: [
        { key: 'src', label: 'Image', type: 'image' },
        { key: 'alt', label: 'Description', type: 'text' },
      ],
    },
  },
  cta: {
    label: "Bandeau d'action",
    hint: 'Bandeau doré avec titre, texte et bouton',
    icon: Megaphone,
    Component: CtaBlock,
    defaultProps: { title: 'Prêt à créer des souvenirs ?', desc: '', btnLabel: 'Obtenir un devis', btnLink: '/contact' },
    fields: [
      { key: 'title', label: 'Titre', type: 'text' },
      { key: 'desc', label: 'Texte (optionnel)', type: 'textarea' },
      { key: 'btnLabel', label: 'Texte du bouton', type: 'text' },
      { key: 'btnLink', label: 'Lien du bouton (ex: /contact)', type: 'text' },
    ],
  },
  faq: {
    label: 'Questions fréquentes',
    hint: 'Accordéon de questions/réponses',
    icon: HelpCircle,
    Component: FaqBlock,
    defaultProps: { title: 'Questions fréquentes', items: [] },
    fields: [{ key: 'title', label: 'Titre', type: 'text' }],
    list: {
      key: 'items',
      label: 'Questions',
      itemLabel: 'question',
      itemFields: [
        { key: 'q', label: 'Question', type: 'text' },
        { key: 'a', label: 'Réponse', type: 'textarea' },
      ],
    },
  },
  testimonials: {
    label: 'Avis clients',
    hint: 'Cartes d\'avis avec étoiles',
    icon: MessageSquareQuote,
    Component: TestimonialsBlock,
    defaultProps: { title: 'Ils nous ont fait confiance', items: [] },
    fields: [{ key: 'title', label: 'Titre', type: 'text' }],
    list: {
      key: 'items',
      label: 'Avis',
      itemLabel: 'avis',
      itemFields: [
        { key: 'name', label: 'Nom', type: 'text' },
        { key: 'role', label: 'Événement (ex: Mariage au Havre)', type: 'text' },
        { key: 'text', label: 'Témoignage', type: 'textarea' },
      ],
    },
  },
  pricingTable: {
    label: 'Formules & tarifs',
    hint: 'Vos formules actuelles (gérées dans Tarifs & Plans)',
    icon: Tag,
    Component: PricingTableBlock,
    defaultProps: { title: 'Nos formules', planIds: [] },
    fields: [{ key: 'title', label: 'Titre', type: 'text' }],
  },
  contactCta: {
    label: 'Contact / devis',
    hint: 'Bandeau avec bouton devis + téléphone cliquable',
    icon: Mail,
    Component: ContactCtaBlock,
    defaultProps: { title: 'Parlons de votre événement', desc: 'Réponse sous 24h, devis gratuit et sans engagement.', btnLabel: 'Obtenir un devis' },
    fields: [
      { key: 'title', label: 'Titre', type: 'text' },
      { key: 'desc', label: 'Texte (optionnel)', type: 'textarea' },
      { key: 'btnLabel', label: 'Texte du bouton', type: 'text' },
    ],
  },
};

/* ── Rendu public d'une liste de sections ── */
const SectionRenderer = ({ sections }) => (
  <>
    {(sections || [])
      .filter((s) => s && s.visible !== false)
      .map((s) => {
        const def = SECTION_LIBRARY[s.type];
        if (!def) return null; // type inconnu (donnée ancienne/future) → ignoré
        const Block = def.Component;
        return <Block key={s.id} {...(s.props || {})} />;
      })}
  </>
);

export default SectionRenderer;
