import { useState } from 'react';
import { Images, Plus, Pencil, Trash2, Check, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import EditModal from './EditModal';
import { normalizeSlug } from './PageBuilder';
import { SaveBar } from './CMSModules';
import { showToast } from '../Toast';

const newId = (p) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const rand = () => Math.random().toString(36).slice(2, 7);

// Une galerie client = une page libre (kind:'gallery') avec 2 sections :
// un en-tête personnalisé + le bloc iframe de la galerie.
const buildGallerySections = (clientName, url, message) => ([
  {
    id: newId('sec'), type: 'hero', visible: true,
    props: {
      tag: 'Vos photos',
      title: `Galerie de ${clientName}`,
      subtitle: message || 'Merci pour votre confiance — retrouvez ici les photos de votre événement.',
      image: '', ctaLabel: '', ctaLink: '',
    },
  },
  {
    id: newId('sec'), type: 'iframe', visible: true,
    props: { url: url || '', height: 720, buttonLabel: 'Voir mes photos' },
  },
]);

/* ── Module CMS : Galeries privées par client ── */
const ClientGalleries = () => {
  const { content, updateContent, saveStatus } = useContent();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const pages = content.customPages || [];
  const galleries = pages.filter((p) => p.kind === 'gallery');

  // Slug non devinable (nom + suffixe aléatoire), unique parmi TOUTES les pages.
  const uniqueSlug = (name) => {
    const base = normalizeSlug(name);
    let slug = `${base}-${rand()}`;
    while (pages.some((p) => p.slug === slug)) slug = `${base}-${rand()}`;
    return slug;
  };

  const handleCreate = (vals) => {
    const clientName = (vals.clientName || '').trim() || 'Client';
    const now = new Date().toISOString();
    const page = {
      id: newId('pg'),
      slug: uniqueSlug(clientName),
      kind: 'gallery',
      title: clientName,
      seoTitle: `Galerie — ${clientName}`,
      seoDesc: '',
      visible: true,       // accessible via le lien
      indexable: false,    // jamais sur Google (privé)
      galleryClientName: clientName,
      galleryUrl: (vals.galleryUrl || '').trim(),
      galleryMessage: vals.message || '',
      createdAt: now,
      updatedAt: now,
      sections: buildGallerySections(clientName, (vals.galleryUrl || '').trim(), vals.message),
    };
    updateContent({ customPages: [...pages, page] });
    showToast("Galerie créée — copiez le lien pour l'envoyer à votre client.", 'success');
  };

  const handleEdit = (vals) => {
    const clientName = (vals.clientName || '').trim() || 'Client';
    const url = (vals.galleryUrl || '').trim();
    updateContent({
      customPages: pages.map((p) => (p.id === editing.id ? {
        ...p,
        title: clientName,
        seoTitle: `Galerie — ${clientName}`,
        galleryClientName: clientName,
        galleryUrl: url,
        galleryMessage: vals.message || '',
        sections: buildGallerySections(clientName, url, vals.message),
        updatedAt: new Date().toISOString(),
      } : p)),
    });
    setEditing(null);
    showToast('Galerie mise à jour ✓', 'success');
  };

  const handleDelete = (page) => {
    if (!window.confirm(`Supprimer définitivement la galerie de « ${page.galleryClientName || page.title} » ?`)) return;
    updateContent({ customPages: pages.filter((p) => p.id !== page.id) });
    showToast('Galerie supprimée.', 'info');
  };

  const handleCopy = (page) => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${page.slug}`);
    setCopiedId(page.id);
    showToast('Lien copié !', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const galleryFields = (g) => ([
    { key: 'clientName', label: 'Nom du client (ex : Sophie & Marc)', type: 'text', value: g?.galleryClientName || '' },
    { key: 'galleryUrl', label: "Lien OU code d'intégration (iframe) de la galerie", type: 'textarea', value: g?.galleryUrl || '' },
    { key: 'message', label: "Message d'accueil (optionnel)", type: 'textarea', value: g?.galleryMessage || '' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Galeries clients</h2>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Après un événement, créez une page privée avec les photos de votre client, et envoyez-lui
            le lien. Chaque galerie a une adresse unique et n'apparaît jamais sur Google.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '14px', padding: '11px 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}
        >
          <Plus size={14} /> Nouvelle galerie
        </button>
      </header>

      <div className="cms-card">
        <h3 className="cms-section-title"><Images size={16} /> Vos galeries ({galleries.length})</h3>

        {galleries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 24px', border: '2px dashed rgba(255,255,255,0.07)', borderRadius: '14px', color: '#475569' }}>
            <Images size={28} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Aucune galerie pour le moment</p>
            <p style={{ fontSize: '12px' }}>Cliquez sur « Nouvelle galerie » après un événement.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {galleries.map((page) => (
              <div key={page.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <p style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>{page.galleryClientName || page.title}</p>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', wordBreak: 'break-all' }}>
                    /p/{page.slug}{page.galleryUrl ? '' : ' · ⚠️ URL galerie manquante'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                  <button onClick={() => setEditing(page)} title="Modifier" style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 13px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Pencil size={12} /> Modifier
                  </button>
                  <a href={`/p/${page.slug}`} target="_blank" rel="noreferrer" title="Ouvrir la galerie" style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px', display: 'flex', textDecoration: 'none' }}>
                    <ExternalLink size={13} />
                  </a>
                  <button onClick={() => handleCopy(page)} title="Copier le lien à envoyer au client" style={{ background: copiedId === page.id ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)', color: copiedId === page.id ? '#22c55e' : '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                    {copiedId === page.id ? <Check size={13} /> : <LinkIcon size={13} />}
                  </button>
                  <button onClick={() => handleDelete(page)} title="Supprimer" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ fontSize: '11px', color: '#64748b', marginTop: '14px' }}>
          💡 Collez le <strong style={{ color: '#cbd5e1' }}>lien</strong> ou le <strong style={{ color: '#cbd5e1' }}>code d'intégration (iframe)</strong> fourni par votre service photo (ex : fotoshare) — le site en extrait
          automatiquement la galerie. Si elle ne s'affiche pas, le bouton « Voir mes photos » prend le relais.
        </p>
      </div>

      {createOpen && (
        <EditModal
          title="Nouvelle galerie client"
          fields={galleryFields()}
          onSave={handleCreate}
          onClose={() => setCreateOpen(false)}
        />
      )}
      {editing && (
        <EditModal
          title="Modifier la galerie"
          fields={galleryFields(editing)}
          onSave={handleEdit}
          onClose={() => setEditing(null)}
        />
      )}
      <SaveBar status={saveStatus} auto onSave={() => updateContent({})} />
    </div>
  );
};

export default ClientGalleries;
