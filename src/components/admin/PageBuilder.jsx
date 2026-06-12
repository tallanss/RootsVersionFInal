import { useState } from 'react';
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Plus,
  ExternalLink,
  AlertTriangle,
  Upload,
  Loader2,
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { SECTION_LIBRARY } from '../sections/SectionRenderer';
import EditModal, { uploadImageToSupabase } from './EditModal';
import { SaveBar } from './CMSModules';
import { showToast } from '../Toast';

const newId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const normalizeSlug = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'page';

const inputLabel = { fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' };

/* ── Éditeur des éléments de liste d'un bloc (FAQ, avis, images…) ── */
const ItemListEditor = ({ listDef, items, onChange }) => {
  const [uploadingIdx, setUploadingIdx] = useState(null);

  const setItem = (idx, key, value) => {
    const next = [...items];
    next[idx] = { ...next[idx], [key]: value };
    onChange(next);
  };
  const move = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };
  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));
  const add = () => {
    const blank = {};
    listDef.itemFields.forEach((f) => { blank[f.key] = ''; });
    onChange([...items, blank]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      {items.map((item, idx) => (
        <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
            <button onClick={() => move(idx, -1)} disabled={idx === 0} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: idx === 0 ? '#334155' : '#94a3b8', borderRadius: '6px', padding: '3px', cursor: idx === 0 ? 'default' : 'pointer', display: 'flex' }}>
              <ChevronUp size={12} />
            </button>
            <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: idx === items.length - 1 ? '#334155' : '#94a3b8', borderRadius: '6px', padding: '3px', cursor: idx === items.length - 1 ? 'default' : 'pointer', display: 'flex' }}>
              <ChevronDown size={12} />
            </button>
          </div>
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
            {listDef.itemFields.map((f) => (
              <div key={f.key}>
                <label style={{ ...inputLabel, fontSize: '10px', marginBottom: '4px' }}>{f.label.toUpperCase()}</label>
                {f.type === 'textarea' ? (
                  <textarea className="cms-input" style={{ minHeight: '60px', fontSize: '13px', padding: '8px 10px' }} value={item[f.key] || ''} onChange={(e) => setItem(idx, f.key, e.target.value)} />
                ) : f.type === 'image' ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', background: uploadingIdx === idx ? 'rgba(255,255,255,0.05)' : 'var(--primary)', color: '#fff', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', fontWeight: 700, cursor: uploadingIdx === idx ? 'wait' : 'pointer', flexShrink: 0 }}>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        disabled={uploadingIdx !== null}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingIdx(idx);
                          try {
                            const url = await uploadImageToSupabase(file);
                            setItem(idx, f.key, url);
                            showToast('Image uploadée ✓');
                          } catch (err) {
                            showToast('Erreur upload : ' + err.message, 'error');
                          } finally {
                            setUploadingIdx(null);
                          }
                        }}
                      />
                      {uploadingIdx === idx ? <Loader2 size={13} className="spin" /> : <Upload size={13} />}
                    </label>
                    {item[f.key] && <img src={item[f.key]} alt="" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />}
                    <input type="text" className="cms-input" style={{ fontSize: '12px', padding: '8px 10px' }} placeholder="ou coller une URL" value={item[f.key] || ''} onChange={(e) => setItem(idx, f.key, e.target.value)} />
                  </div>
                ) : (
                  <input type="text" className="cms-input" style={{ fontSize: '13px', padding: '8px 10px' }} value={item[f.key] || ''} onChange={(e) => setItem(idx, f.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
          <button onClick={() => remove(idx)} title="Supprimer" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', flexShrink: 0 }}>
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button onClick={add} style={{ padding: '10px', border: '1px dashed #334155', borderRadius: '10px', background: 'transparent', color: '#94a3b8', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
        + Ajouter {listDef.itemLabel === 'image' ? 'une image' : `un(e) ${listDef.itemLabel}`}
      </button>
    </div>
  );
};

/* ── Éditeur d'une page libre (métadonnées + sections) ── */
const PageBuilder = ({ pageId, onBack }) => {
  const { content, updateContent, saveStatus } = useContent();
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [expandedListId, setExpandedListId] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const pages = content.customPages || [];
  const page = pages.find((p) => p.id === pageId);

  if (!page) {
    return (
      <div style={{ color: '#64748b', padding: '40px', textAlign: 'center' }}>
        Page introuvable.
        <button onClick={onBack} style={{ display: 'block', margin: '16px auto 0', background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Retour</button>
      </div>
    );
  }

  const updatePage = (patch) => {
    updateContent({
      customPages: pages.map((p) => (p.id === pageId ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)),
    });
  };

  const setSections = (sections) => updatePage({ sections });
  const sections = page.sections || [];

  const moveSection = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[idx], next[j]] = [next[j], next[idx]];
    setSections(next);
  };
  const toggleSection = (idx) => {
    const next = [...sections];
    next[idx] = { ...next[idx], visible: next[idx].visible === false };
    setSections(next);
  };
  const deleteSection = (idx) => {
    if (!window.confirm('Supprimer cette section ?')) return;
    setSections(sections.filter((_, i) => i !== idx));
  };
  const addSection = (type) => {
    const def = SECTION_LIBRARY[type];
    setSections([...sections, { id: newId('sec'), type, visible: true, props: { ...def.defaultProps } }]);
    setAddOpen(false);
  };

  const handleSlugBlur = (raw) => {
    const slug = normalizeSlug(raw);
    if (slug === page.slug) return;
    const taken = pages.some((p) => p.id !== pageId && p.slug === slug);
    if (taken) {
      showToast('Ce slug est déjà utilisé par une autre page.', 'error');
      return;
    }
    updatePage({ slug });
  };

  const editingSection = sections.find((s) => s.id === editingSectionId);
  const editingDef = editingSection ? SECTION_LIBRARY[editingSection.type] : null;

  // Aperçu d'une section dans la liste (1re valeur texte non vide)
  const sectionPreview = (s) => {
    const props = s.props || {};
    const txt = props.title || props.tag || props.caption || props.body || '';
    return String(txt).split('\n')[0].slice(0, 60);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', padding: '10px', borderRadius: '10px', cursor: 'pointer', display: 'flex', flexShrink: 0 }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ flexGrow: 1, minWidth: '160px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>{page.title}</h2>
          <p style={{ color: '#64748b', fontSize: '13px' }}>/p/{page.slug}</p>
        </div>
        <a href={`/p/${page.slug}`} target="_blank" rel="noreferrer" style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.2)', color: 'var(--primary)', padding: '9px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
          <ExternalLink size={14} /> Voir la page
        </a>
      </header>

      {/* MÉTADONNÉES */}
      <section className="cms-card">
        <h3 className="cms-section-title">Informations de la page</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={inputLabel}>TITRE (interne)</label>
              <input type="text" className="cms-input" value={page.title} onChange={(e) => updatePage({ title: e.target.value })} />
            </div>
            <div>
              <label style={inputLabel}>ADRESSE (/p/…)</label>
              <input
                type="text"
                className="cms-input"
                defaultValue={page.slug}
                key={page.slug}
                onBlur={(e) => handleSlugBlur(e.target.value)}
              />
            </div>
          </div>
          <p style={{ fontSize: '11px', color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={12} /> Modifier l'adresse casse les liens déjà partagés vers cette page.
          </p>
          <div>
            <label style={inputLabel}>TITRE GOOGLE (SEO — optionnel)</label>
            <input type="text" className="cms-input" value={page.seoTitle || ''} placeholder={`${page.title} — PhotoRoots`} onChange={(e) => updatePage({ seoTitle: e.target.value })} />
          </div>
          <div>
            <label style={inputLabel}>DESCRIPTION GOOGLE (SEO — optionnel)</label>
            <textarea className="cms-input" style={{ minHeight: '60px' }} value={page.seoDesc || ''} onChange={(e) => updatePage({ seoDesc: e.target.value })} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
            <input type="checkbox" checked={page.visible !== false} onChange={(e) => updatePage({ visible: e.target.checked })} />
            Page visible (décochée = brouillon, visible uniquement en mode admin)
          </label>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
            <input type="checkbox" checked={!!page.indexable} onChange={(e) => updatePage({ indexable: e.target.checked })} style={{ marginTop: '3px' }} />
            <span>
              Indexable par Google
              <span style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: '#64748b', marginTop: '2px' }}>
                Ces pages ne sont pas pré-rendues : l'indexation est lente et non garantie, et les aperçus
                WhatsApp/Facebook montreront l'accueil. Idéal pour des liens partagés directement (pub, QR code, newsletter).
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* SECTIONS */}
      <section className="cms-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="cms-section-title" style={{ marginBottom: 0 }}>Sections ({sections.length})</h3>
          <button onClick={() => setAddOpen((o) => !o)} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} /> Ajouter une section
          </button>
        </div>

        {addOpen && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px', marginBottom: '16px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            {Object.entries(SECTION_LIBRARY).map(([type, def]) => (
              <button key={type} onClick={() => addSection(type)} title={def.hint} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '12px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                <def.icon size={18} color="var(--primary)" />
                <span style={{ fontSize: '11px', fontWeight: 700 }}>{def.label}</span>
              </button>
            ))}
          </div>
        )}

        {sections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: '#475569', fontSize: '13px', border: '2px dashed rgba(255,255,255,0.07)', borderRadius: '12px' }}>
            Aucune section. Cliquez sur « Ajouter une section » pour construire votre page.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sections.map((s, idx) => {
              const def = SECTION_LIBRARY[s.type];
              if (!def) return null;
              const hidden = s.visible === false;
              const listExpanded = expandedListId === s.id;
              return (
                <div key={s.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px', opacity: hidden ? 0.55 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
                      <button onClick={() => moveSection(idx, -1)} disabled={idx === 0} title="Monter" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: idx === 0 ? '#334155' : '#94a3b8', borderRadius: '6px', padding: '3px', cursor: idx === 0 ? 'default' : 'pointer', display: 'flex' }}>
                        <ChevronUp size={13} />
                      </button>
                      <button onClick={() => moveSection(idx, 1)} disabled={idx === sections.length - 1} title="Descendre" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: idx === sections.length - 1 ? '#334155' : '#94a3b8', borderRadius: '6px', padding: '3px', cursor: idx === sections.length - 1 ? 'default' : 'pointer', display: 'flex' }}>
                        <ChevronDown size={13} />
                      </button>
                    </div>
                    <def.icon size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: '14px' }}>{def.label}{hidden ? ' (masquée)' : ''}</p>
                      <p style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sectionPreview(s) || def.hint}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button onClick={() => toggleSection(idx)} title={hidden ? 'Afficher' : 'Masquer'} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}>
                        {hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => setEditingSectionId(s.id)} title="Modifier les textes" style={{ background: 'rgba(197,160,89,0.12)', border: 'none', color: 'var(--primary)', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => deleteSection(idx)} title="Supprimer" style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {def.list && (
                    <>
                      <button onClick={() => setExpandedListId(listExpanded ? null : s.id)} style={{ marginTop: '10px', background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {listExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        {def.list.label} ({((s.props || {})[def.list.key] || []).length})
                      </button>
                      {listExpanded && (
                        <ItemListEditor
                          listDef={def.list}
                          items={(s.props || {})[def.list.key] || []}
                          onChange={(items) => {
                            const next = [...sections];
                            next[idx] = { ...s, props: { ...(s.props || {}), [def.list.key]: items } };
                            setSections(next);
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {editingSection && editingDef && (
        <EditModal
          title={editingDef.label}
          fields={editingDef.fields.map((f) => ({ ...f, value: (editingSection.props || {})[f.key] ?? '' }))}
          onSave={(vals) => {
            setSections(sections.map((s) => (s.id === editingSectionId ? { ...s, props: { ...(s.props || {}), ...vals } } : s)));
          }}
          onClose={() => setEditingSectionId(null)}
        />
      )}

      <SaveBar status={saveStatus} auto onSave={() => updateContent({})} />
    </div>
  );
};

export default PageBuilder;
