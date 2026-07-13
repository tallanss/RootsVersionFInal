import { useState } from 'react';
import { Package, Plus, Pencil, Trash2, Check, Link as LinkIcon, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import EditModal from './EditModal';
import { normalizeSlug } from './PageBuilder';
import { SaveBar } from './CMSModules';
import { showToast } from '../Toast';

const newId = (p) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const rand = () => Math.random().toString(36).slice(2, 7);

const toPrice = (v) => {
  const n = parseInt(String(v ?? '').replace(/[^\d]/g, ''), 10);
  return Number.isFinite(n) ? n : null;
};

/* ── Module CMS : Prestations (machines/produits à louer) ── */
const ProductsManager = () => {
  const { content, updateContent, saveStatus } = useContent();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const products = content.products || [];

  const uniqueSlug = (name) => {
    const base = normalizeSlug(name) || 'prestation';
    let slug = base;
    while (products.some((p) => p.slug === slug)) slug = `${base}-${rand()}`;
    return slug;
  };

  const handleCreate = (vals) => {
    const name = (vals.name || '').trim() || 'Nouvelle prestation';
    const now = new Date().toISOString();
    const product = {
      id: newId('prod'),
      slug: uniqueSlug(name),
      name,
      tagline: (vals.tagline || '').trim(),
      priceFrom: toPrice(vals.priceFrom),
      description: vals.description || '',
      image: (vals.image || '').trim(),
      features: (vals.features || '').split('\n').map((f) => f.trim()).filter(Boolean),
      badge: vals.badge || '',
      visible: true,
      indexable: true,
      seoTitle: (vals.seoTitle || '').trim(),
      seoDesc: (vals.seoDesc || '').trim(),
      createdAt: now,
      updatedAt: now,
    };
    updateContent({ products: [product, ...products] });
    showToast('Prestation créée ✓', 'success');
  };

  const handleEdit = (vals) => {
    const name = (vals.name || '').trim() || 'Nouvelle prestation';
    updateContent({
      products: products.map((p) => (p.id === editing.id ? {
        ...p,
        name,
        tagline: (vals.tagline || '').trim(),
        priceFrom: toPrice(vals.priceFrom),
        description: vals.description || '',
        image: (vals.image || '').trim(),
        features: (vals.features || '').split('\n').map((f) => f.trim()).filter(Boolean),
        badge: vals.badge || '',
        seoTitle: (vals.seoTitle || '').trim(),
        seoDesc: (vals.seoDesc || '').trim(),
        updatedAt: new Date().toISOString(),
      } : p)),
    });
    setEditing(null);
    showToast('Prestation mise à jour ✓', 'success');
  };

  const toggleVisible = (product) => {
    updateContent({ products: products.map((p) => (p.id === product.id ? { ...p, visible: p.visible === false ? true : false } : p)) });
  };

  const handleDelete = (product) => {
    if (!window.confirm(`Supprimer définitivement la prestation « ${product.name} » ?`)) return;
    updateContent({ products: products.filter((p) => p.id !== product.id) });
    showToast('Prestation supprimée.', 'info');
  };

  const handleCopy = (product) => {
    navigator.clipboard.writeText(`${window.location.origin}/prestations/${product.slug}`);
    setCopiedId(product.id);
    showToast('Lien copié !', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const productFields = (p) => ([
    { key: 'name', label: 'Nom de la prestation (ex : Photobooth 360)', type: 'text', value: p?.name || '' },
    { key: 'tagline', label: 'Accroche courte (sous le nom)', type: 'text', value: p?.tagline || '' },
    { key: 'priceFrom', label: 'Prix « à partir de » en € (chiffre seul — laisser vide = « Sur devis »)', type: 'text', value: p?.priceFrom != null ? String(p.priceFrom) : '' },
    { key: 'image', label: 'Photo principale', type: 'image', value: p?.image || '' },
    { key: 'description', label: 'Description', type: 'textarea', value: p?.description || '' },
    { key: 'features', label: 'Points forts (un par ligne)', type: 'textarea', value: (p?.features || []).join('\n') },
    { key: 'badge', label: 'Badge (optionnel)', type: 'select', value: p?.badge || '', options: [
      { value: '', label: 'Aucun' },
      { value: 'Nouveau', label: 'Nouveau' },
      { value: 'Populaire', label: 'Populaire' },
      { value: 'Exclusif', label: 'Exclusif' },
    ] },
    { key: 'seoTitle', label: 'Titre Google (optionnel)', type: 'text', value: p?.seoTitle || '' },
    { key: 'seoDesc', label: 'Description Google (optionnel)', type: 'textarea', value: p?.seoDesc || '' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Prestations</h2>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Vos machines et produits à louer (photobooth 360, borne miroir…). Chaque prestation obtient
            sa page dédiée et apparaît dans « Nos prestations » et dans le devis.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '14px', padding: '11px 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}
        >
          <Plus size={14} /> Nouvelle prestation
        </button>
      </header>

      <div className="cms-card">
        <h3 className="cms-section-title"><Package size={16} /> Vos prestations ({products.length})</h3>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 24px', border: '2px dashed rgba(255,255,255,0.07)', borderRadius: '14px', color: '#475569' }}>
            <Package size={28} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Aucune prestation pour le moment</p>
            <p style={{ fontSize: '12px' }}>Cliquez sur « Nouvelle prestation » pour ajouter une machine.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {products.map((p) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', opacity: p.visible === false ? 0.55 : 1 }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={18} color="#475569" />}
                </div>
                <div style={{ flex: 1, minWidth: '140px' }}>
                  <p style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>
                    {p.name}
                    {p.badge && <span style={{ marginLeft: '8px', fontSize: '10px', fontWeight: 700, color: 'var(--primary)', border: '1px solid rgba(197,160,89,0.4)', borderRadius: '999px', padding: '2px 7px' }}>{p.badge}</span>}
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    {p.priceFrom != null ? `À partir de ${p.priceFrom}€` : 'Sur devis'} · /prestations/{p.slug}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                  <button onClick={() => toggleVisible(p)} title={p.visible === false ? 'Masquée — cliquez pour afficher' : 'Visible — cliquez pour masquer'} style={{ background: 'rgba(255,255,255,0.05)', color: p.visible === false ? '#64748b' : '#22c55e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                    {p.visible === false ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button onClick={() => setEditing(p)} title="Modifier" style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 13px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Pencil size={12} /> Modifier
                  </button>
                  <a href={`/prestations/${p.slug}`} target="_blank" rel="noreferrer" title="Ouvrir la page" style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px', display: 'flex', textDecoration: 'none' }}>
                    <ExternalLink size={13} />
                  </a>
                  <button onClick={() => handleCopy(p)} title="Copier le lien" style={{ background: copiedId === p.id ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)', color: copiedId === p.id ? '#22c55e' : '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                    {copiedId === p.id ? <Check size={13} /> : <LinkIcon size={13} />}
                  </button>
                  <button onClick={() => handleDelete(p)} title="Supprimer" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ fontSize: '11px', color: '#64748b', marginTop: '14px' }}>
          💡 Chaque prestation a sa <strong style={{ color: '#cbd5e1' }}>page dédiée</strong> (référencée sur Google) et devient
          sélectionnable dans le <strong style={{ color: '#cbd5e1' }}>formulaire de devis</strong>. Masquez une prestation pour la retirer du site sans la supprimer.
        </p>
      </div>

      {createOpen && (
        <EditModal
          title="Nouvelle prestation"
          fields={productFields()}
          onSave={handleCreate}
          onClose={() => setCreateOpen(false)}
        />
      )}
      {editing && (
        <EditModal
          title="Modifier la prestation"
          fields={productFields(editing)}
          onSave={handleEdit}
          onClose={() => setEditing(null)}
        />
      )}
      <SaveBar status={saveStatus} auto onSave={() => updateContent({})} />
    </div>
  );
};

export default ProductsManager;
