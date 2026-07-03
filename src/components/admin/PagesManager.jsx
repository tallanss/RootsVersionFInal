import { useState } from 'react';
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  Link as LinkIcon,
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import EditModal from './EditModal';
import PageBuilder, { normalizeSlug } from './PageBuilder';
import { SaveBar } from './CMSModules';
import { showToast } from '../Toast';

const newId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/* ── Pages libres : liste + création/duplication/suppression ── */
const PagesManager = () => {
  const { content, updateContent, saveStatus } = useContent();
  const [editingPageId, setEditingPageId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const pages = content.customPages || [];
  // Les galeries clients ont leur propre module — on ne les mélange pas ici.
  const listPages = pages.filter((p) => p.kind !== 'gallery');

  // Slug unique : suffixe -2, -3… si déjà pris
  const uniqueSlug = (base) => {
    let slug = normalizeSlug(base);
    let n = 2;
    while (pages.some((p) => p.slug === slug)) {
      slug = `${normalizeSlug(base)}-${n}`;
      n += 1;
    }
    return slug;
  };

  const handleCreate = (vals) => {
    const title = (vals.title || '').trim() || 'Nouvelle page';
    const now = new Date().toISOString();
    const page = {
      id: newId('pg'),
      slug: uniqueSlug(title),
      title,
      seoTitle: '',
      seoDesc: '',
      visible: false, // brouillon par défaut
      indexable: false,
      createdAt: now,
      updatedAt: now,
      sections: [
        { id: newId('sec'), type: 'hero', visible: true, props: { tag: 'PhotoRoots', title, subtitle: '', image: '', ctaLabel: '', ctaLink: '/contact' } },
      ],
    };
    updateContent({ customPages: [...pages, page] });
    setEditingPageId(page.id);
    showToast('Page créée en brouillon — construisez-la puis activez « Page visible ».', 'success');
  };

  const handleDuplicate = (page) => {
    const now = new Date().toISOString();
    const copy = {
      ...JSON.parse(JSON.stringify(page)),
      id: newId('pg'),
      slug: uniqueSlug(page.slug),
      title: `${page.title} (copie)`,
      visible: false,
      createdAt: now,
      updatedAt: now,
    };
    copy.sections = (copy.sections || []).map((s) => ({ ...s, id: newId('sec') }));
    updateContent({ customPages: [...pages, copy] });
    showToast('Page dupliquée (en brouillon).', 'success');
  };

  const handleDelete = (page) => {
    if (!window.confirm(`Supprimer définitivement la page « ${page.title} » ?`)) return;
    updateContent({ customPages: pages.filter((p) => p.id !== page.id) });
    showToast('Page supprimée.', 'info');
  };

  const handleCopyLink = (page) => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${page.slug}`);
    setCopiedId(page.id);
    showToast('Lien copié !', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (editingPageId) {
    return <PageBuilder pageId={editingPageId} onBack={() => setEditingPageId(null)} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Pages libres</h2>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Créez vos propres pages avec des blocs (texte, images, FAQ, tarifs…). Idéal pour une offre
            ponctuelle ou une page de campagne.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '14px', padding: '11px 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}
        >
          <Plus size={14} /> Créer une page
        </button>
      </header>

      <div className="cms-card">
        <h3 className="cms-section-title"><FileText size={16} /> Vos pages ({listPages.length})</h3>

        {listPages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 24px', border: '2px dashed rgba(255,255,255,0.07)', borderRadius: '14px', color: '#475569' }}>
            <FileText size={28} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Aucune page pour le moment</p>
            <p style={{ fontSize: '12px' }}>Cliquez sur « Créer une page » pour commencer.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {listPages.map((page) => (
              <div key={page.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <p style={{ fontWeight: 700, fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {page.title}
                    <span className="cms-badge" style={page.visible !== false ? { background: 'rgba(16,185,129,0.12)', color: '#10b981' } : undefined}>
                      {page.visible !== false ? 'Visible' : 'Brouillon'}
                    </span>
                    {page.indexable && <span className="cms-badge" style={{ background: 'rgba(56,189,248,0.12)', color: '#38bdf8' }}>Google</span>}
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    /p/{page.slug} · {(page.sections || []).length} section{(page.sections || []).length > 1 ? 's' : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                  <button onClick={() => setEditingPageId(page.id)} title="Modifier" style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 13px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Pencil size={12} /> Modifier
                  </button>
                  <a href={`/p/${page.slug}`} target="_blank" rel="noreferrer" title="Ouvrir la page" style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px', display: 'flex', textDecoration: 'none' }}>
                    <ExternalLink size={13} />
                  </a>
                  <button onClick={() => handleCopyLink(page)} title="Copier le lien" style={{ background: copiedId === page.id ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)', color: copiedId === page.id ? '#22c55e' : '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                    {copiedId === page.id ? <Check size={13} /> : <LinkIcon size={13} />}
                  </button>
                  <button onClick={() => handleDuplicate(page)} title="Dupliquer" style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                    <Copy size={13} />
                  </button>
                  <button onClick={() => handleDelete(page)} title="Supprimer" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {listPages.length > 0 && (
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '14px' }}>
            💡 Pour ajouter une page à votre menu, allez dans « Menu &amp; Liens » et utilisez son adresse /p/…
          </p>
        )}
      </div>

      {createOpen && (
        <EditModal
          title="Créer une page"
          fields={[{ key: 'title', label: 'Titre de la page', type: 'text', value: '' }]}
          onSave={handleCreate}
          onClose={() => setCreateOpen(false)}
        />
      )}
      <SaveBar status={saveStatus} auto onSave={() => updateContent({})} />
    </div>
  );
};

export default PagesManager;
