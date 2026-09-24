import { useState } from 'react';
import { Camera, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import EditModal from './EditModal';
import { SaveBar } from './CMSModules';
import { showToast } from '../Toast';
import { priceToNumber } from '../../utils/galleryFormat';

const newId = (p) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Parse un supplément saisi librement (« 50 », « 50€ », « 49,90 », « 49.90 »)
// SANS tronquer le séparateur décimal, et refuse les valeurs négatives / vides.
const toSupplement = (v) => {
  const n = priceToNumber(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/* ── Module CMS : Machines (bornes réservables) ── */
const MachinesManager = () => {
  const { content, updateContent, saveStatus } = useContent();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const machines = content.machines || [];

  const handleCreate = (vals) => {
    const machine = {
      id: newId('m'),
      name: (vals.name || '').trim() || 'Nouvelle machine',
      description: (vals.description || '').trim(),
      image: (vals.image || '').trim(),
      supplement: toSupplement(vals.supplement),
      visible: true,
    };
    updateContent({ machines: [...machines, machine] });
    showToast('Machine ajoutée ✓', 'success');
  };

  const handleEdit = (vals) => {
    updateContent({
      machines: machines.map((m) => (m.id === editing.id ? {
        ...m,
        name: (vals.name || '').trim() || m.name,
        description: (vals.description || '').trim(),
        image: (vals.image || '').trim(),
        supplement: toSupplement(vals.supplement),
      } : m)),
    });
    setEditing(null);
    showToast('Machine mise à jour ✓', 'success');
  };

  const toggleVisible = (machine) => {
    updateContent({ machines: machines.map((m) => (m.id === machine.id ? { ...m, visible: m.visible === false ? true : false } : m)) });
  };

  const handleDelete = (machine) => {
    if (!window.confirm(`Supprimer définitivement la machine « ${machine.name} » ?`)) return;
    updateContent({ machines: machines.filter((m) => m.id !== machine.id) });
    showToast('Machine supprimée.', 'info');
  };

  const machineFields = (m) => ([
    { key: 'name', label: 'Nom de la machine (ex : Miroir Booth)', type: 'text', value: m?.name || '' },
    { key: 'description', label: 'Description', type: 'textarea', value: m?.description || '' },
    { key: 'image', label: 'Photo de la machine', type: 'image', value: m?.image || '' },
    { key: 'supplement', label: 'Supplément en € (0 = inclus dans le prix de la formule)', type: 'text', value: m?.supplement != null ? String(m.supplement) : '0' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Machines</h2>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Les bornes que vos clients peuvent choisir au moment de réserver. Le
            <strong style={{ color: '#cbd5e1' }}> supplément</strong> s'ajoute au prix de la formule choisie.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '14px', padding: '11px 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}
        >
          <Plus size={14} /> Nouvelle machine
        </button>
      </header>

      <div className="cms-card">
        <h3 className="cms-section-title"><Camera size={16} /> Vos machines ({machines.length})</h3>

        {machines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 24px', border: '2px dashed rgba(255,255,255,0.07)', borderRadius: '14px', color: '#475569' }}>
            <Camera size={28} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Aucune machine pour le moment</p>
            <p style={{ fontSize: '12px' }}>Cliquez sur « Nouvelle machine » pour en ajouter une.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {machines.map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', opacity: m.visible === false ? 0.55 : 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {m.image ? <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Camera size={16} color="#475569" />}
                </div>
                <div style={{ flex: 1, minWidth: '140px' }}>
                  <p style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>{m.name}</p>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    {m.supplement > 0 ? `+${m.supplement}€` : 'Inclus (aucun supplément)'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                  <button onClick={() => toggleVisible(m)} title={m.visible === false ? 'Masquée — cliquez pour afficher' : 'Visible — cliquez pour masquer'} style={{ background: 'rgba(255,255,255,0.05)', color: m.visible === false ? '#64748b' : '#22c55e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                    {m.visible === false ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button onClick={() => setEditing(m)} title="Modifier" style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 13px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Pencil size={12} /> Modifier
                  </button>
                  <button onClick={() => handleDelete(m)} title="Supprimer" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ fontSize: '11px', color: '#64748b', marginTop: '14px' }}>
          💡 Le client choisit <strong style={{ color: '#cbd5e1' }}>une</strong> machine au moment de réserver ; le prix affiché = prix de la formule + supplément de la machine. La machine choisie est ajoutée à l'e-mail et à l'événement Google Calendar.
        </p>
      </div>

      {createOpen && (
        <EditModal
          title="Nouvelle machine"
          fields={machineFields()}
          onSave={handleCreate}
          onClose={() => setCreateOpen(false)}
        />
      )}
      {editing && (
        <EditModal
          title="Modifier la machine"
          fields={machineFields(editing)}
          onSave={handleEdit}
          onClose={() => setEditing(null)}
        />
      )}
      <SaveBar status={saveStatus} auto onSave={() => updateContent({})} />
    </div>
  );
};

export default MachinesManager;
