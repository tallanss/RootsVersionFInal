import { Helmet } from 'react-helmet-async';
import { Sparkles, ArrowRight, MapPin } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import AnimatedButton from '../components/AnimatedButton';
import PremiumImage from '../components/PremiumImage';
import { useContent } from '../context/ContentContext';
import EditableBlock from '../components/admin/EditableBlock';

/**
 * Page /a-propos — présentation du fondateur et de PhotoRoots.
 * Entièrement modifiable via l'admin (texte + photo). Base factuelle connue :
 * création en 2023, formation d'ingénieur généraliste (CESI Rouen).
 */
export default function APropos() {
  const { content, updateContent } = useContent();
  const title = content.aboutTitle || 'À propos de PhotoRoots';
  const intro = content.aboutIntro
    || "PhotoRoots, c'est une aventure normande : des bornes photo haut de gamme, un service de proximité et l'envie de transformer chaque événement en souvenir.";
  const text = content.aboutText
    || "Créée en 2023 par Jimmy, PhotoRoots est née d'une passion pour l'image et d'une formation d'ingénieur généraliste (CESI Rouen). De ce parcours technique vient notre exigence : un matériel fiable et moderne, une installation soignée, et un accompagnement de A à Z. Basés en Seine-Maritime, nous intervenons au Havre, à Rouen, à Dieppe et dans toute la région pour les mariages, anniversaires et événements d'entreprise.";
  const photo = content.aboutPhoto || '';
  const canonical = 'https://photoroots.fr/a-propos';

  return (
    <div className="animate-in">
      <Helmet>
        <title>À propos de PhotoRoots | Jimmy et les bornes photo</title>
        <meta name="description" content="Qui se cache derrière PhotoRoots ? Découvrez Jimmy, notre histoire et notre façon de travailler : des bornes photo premium et un service de proximité en Seine-Maritime." />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content="À propos de PhotoRoots | Jimmy et les bornes photo" />
        <meta property="og:description" content="Notre histoire et notre façon de travailler : des bornes photo premium et un service de proximité en Seine-Maritime." />
        <meta property="og:image" content="https://photoroots.fr/photobooth-hero.png" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="PhotoRoots" />
      </Helmet>

      {/* EN-TÊTE */}
      <section className="container" style={{ padding: '48px 24px 16px' }}>
        <FadeIn direction="down" duration={0.9}>
          <div className="section-tag"><Sparkles size={14} /> À propos</div>
          <EditableBlock
            label="En-tête À propos"
            modalTitle="En-tête — À propos"
            fields={[
              { key: 'aboutTitle', label: 'Titre', type: 'text', value: title },
              { key: 'aboutIntro', label: 'Intro', type: 'textarea', value: intro },
            ]}
            onSave={(vals) => updateContent({ ...content, ...vals })}
          >
            <h1 className="section-title" style={{ fontSize: '32px' }}>{title}</h1>
            <p className="section-subtitle">{intro}</p>
          </EditableBlock>
        </FadeIn>
      </section>

      {/* CORPS : photo + texte */}
      <section className="container" style={{ padding: '8px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', alignItems: 'center' }}>
          <FadeIn direction="right">
            <EditableBlock
              label="Photo du fondateur"
              modalTitle="Photo — À propos"
              fields={[{ key: 'aboutPhoto', label: 'Photo (Jimmy)', type: 'image', value: photo }]}
              onSave={(vals) => updateContent({ ...content, ...vals })}
            >
              <div style={{ aspectRatio: '4 / 5', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--border-light)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {photo
                  ? <PremiumImage src={photo} alt="Jimmy, fondateur de PhotoRoots" style={{ width: '100%', height: '100%' }} />
                  : <span style={{ color: 'var(--text-light)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>Photo à ajouter<br />(admin → À propos)</span>}
              </div>
            </EditableBlock>
          </FadeIn>

          <FadeIn direction="up">
            <EditableBlock
              label="Texte À propos"
              modalTitle="Texte — À propos"
              fields={[{ key: 'aboutText', label: 'Texte', type: 'textarea', value: text }]}
              onSave={(vals) => updateContent({ ...content, ...vals })}
            >
              <p style={{ fontSize: '16px', lineHeight: 1.75, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>{text}</p>
            </EditableBlock>
            <p style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
              <MapPin size={16} color="var(--primary)" /> Le Havre · Rouen · Dieppe — Seine-Maritime
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="container" style={{ padding: '8px 20px 48px' }}>
        <div className="cta-section">
          <h2>Envie de travailler avec nous ?</h2>
          <p>Parlez-nous de votre événement : nous vous répondons sous 24h avec un devis gratuit.</p>
          <AnimatedButton to="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--primary)', width: 'auto', padding: '16px 36px', fontWeight: 800 }}>
            Demander un devis <ArrowRight size={18} />
          </AnimatedButton>
        </div>
      </section>
    </div>
  );
}
