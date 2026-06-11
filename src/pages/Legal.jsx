import { Link } from 'react-router-dom';
import { Shield, FileText, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useContent } from '../context/ContentContext';
import EditableBlock from '../components/admin/EditableBlock';

const h3Style = { fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '20px', marginBottom: '8px' };
const cardStyle = { background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '28px', border: '1px solid var(--border-light)' };
const h2Style = { fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' };

const sectionFields = (s) => [
  { key: 'title', label: 'Titre', type: 'text', value: s?.title || '' },
  { key: 'body', label: 'Texte', type: 'textarea', value: s?.body || '' },
];

const Legal = () => {
  const { content, updateContent } = useContent();
  const legal = content.legal || { mentions: [], cgv: [] };

  const saveSection = (listKey, idx) => (vals) => {
    const next = [...(legal[listKey] || [])];
    next[idx] = { ...next[idx], ...vals };
    updateContent({ legal: { ...legal, [listKey]: next } });
  };
  const deleteSection = (listKey, idx) => () => {
    updateContent({ legal: { ...legal, [listKey]: (legal[listKey] || []).filter((_, i) => i !== idx) } });
  };
  const addSection = (listKey) => (vals) => {
    updateContent({ legal: { ...legal, [listKey]: [...(legal[listKey] || []), { title: vals.title || 'Nouvelle section', body: vals.body || '' }] } });
  };

  const renderSections = (listKey) => (legal[listKey] || []).map((s, i) => (
    <EditableBlock
      key={`${listKey}-${i}`}
      label={s.title}
      modalTitle={`Modifier « ${s.title} »`}
      fields={sectionFields(s)}
      onSave={saveSection(listKey, i)}
      onDelete={deleteSection(listKey, i)}
    >
      <h3 style={h3Style}>{s.title}</h3>
      <p style={{ whiteSpace: 'pre-line' }}>{s.body}</p>
    </EditableBlock>
  ));

  return (
    <div className="animate-in">
      <Helmet>
        <title>Mentions Légales & CGV | PhotoRoots</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <section className="container" style={{ padding: '32px 20px 80px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--primary)', fontWeight: 600, marginBottom: '24px', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>

        <div className="section-tag"><Shield size={14} /> Informations légales</div>
        <EditableBlock
          label="Titre de la page"
          modalTitle="Titre de la page"
          fields={[{ key: 'title', label: 'Titre', type: 'text', value: legal.title || 'Mentions Légales & CGV' }]}
          onSave={(vals) => updateContent({ legal: { ...legal, ...vals } })}
        >
          <h1 className="section-title" style={{ fontSize: '28px', marginBottom: '32px' }}>{legal.title || 'Mentions Légales & CGV'}</h1>
        </EditableBlock>

        {/* Mentions Légales */}
        <div style={{ ...cardStyle, marginBottom: '20px' }}>
          <EditableBlock
            label="Mentions légales"
            modalTitle="Titre de la carte"
            fields={[{ key: 'mentionsTitle', label: 'Titre', type: 'text', value: legal.mentionsTitle || 'Mentions Légales' }]}
            onSave={(vals) => updateContent({ legal: { ...legal, ...vals } })}
            onAdd={{ label: 'Ajouter une section', fields: sectionFields(), onSave: addSection('mentions') }}
          >
            <h2 style={h2Style}>
              <FileText size={20} color="var(--primary)" /> {legal.mentionsTitle || 'Mentions Légales'}
            </h2>
          </EditableBlock>

          <div style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-muted)' }}>
            {renderSections('mentions')}
          </div>
        </div>

        {/* CGV */}
        <div style={cardStyle}>
          <EditableBlock
            label="CGV"
            modalTitle="Titre de la carte"
            fields={[{ key: 'cgvTitle', label: 'Titre', type: 'text', value: legal.cgvTitle || 'Conditions Générales de Vente' }]}
            onSave={(vals) => updateContent({ legal: { ...legal, ...vals } })}
            onAdd={{ label: 'Ajouter un article', fields: sectionFields(), onSave: addSection('cgv') }}
          >
            <h2 style={h2Style}>
              <Shield size={20} color="var(--primary)" /> {legal.cgvTitle || 'Conditions Générales de Vente'}
            </h2>
          </EditableBlock>

          <div style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-muted)' }}>
            {renderSections('cgv')}
          </div>
        </div>

        <EditableBlock
          label="Dernière mise à jour"
          modalTitle="Dernière mise à jour"
          fields={[{ key: 'lastUpdated', label: 'Texte (ex: Mars 2026)', type: 'text', value: legal.lastUpdated || '' }]}
          onSave={(vals) => updateContent({ legal: { ...legal, ...vals } })}
        >
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-light)', marginTop: '24px' }}>
            Dernière mise à jour : {legal.lastUpdated || '—'}
          </p>
        </EditableBlock>
      </section>
    </div>
  );
};

export default Legal;
