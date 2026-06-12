import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Trash2, Upload, Loader2 } from 'lucide-react';
import { showToast } from '../Toast';
import { supabase } from '../../config/supabase';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const uploadImageToSupabase = async (file) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Type de fichier non supporté. Utilisez JPG, PNG, WebP, GIF ou SVG.');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Fichier trop volumineux (max 5 MB).');
  }
  const ext = file.name.split('.').pop().toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage.from('gallery').upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(data.path);
  return publicUrl;
};

/**
 * EditModal — Modal universelle d'édition
 *
 * Props:
 * - title: string
 * - fields: Array<{ key, label, type: 'text'|'textarea'|'image'|'price'|'select', value, options? }>
 * - onSave(updatedValues): void
 * - onClose(): void
 * - onDelete?: () => void  (optional delete action)
 * - onAdd?: (newItem) => void  (optional add action for arrays)
 */

const FIELD_STYLES = {
  label: {
    display: 'block', fontSize: '12px', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    color: 'var(--primary)', marginBottom: '6px'
  },
  input: {
    width: '100%', padding: '12px 14px', fontSize: '15px',
    fontFamily: 'var(--font-main)', border: '1.5px solid var(--border-light)',
    borderRadius: '12px', background: '#fff', color: 'var(--text-main)',
    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
  },
  textarea: {
    width: '100%', padding: '12px 14px', fontSize: '15px',
    fontFamily: 'var(--font-main)', border: '1.5px solid var(--border-light)',
    borderRadius: '12px', background: '#fff', color: 'var(--text-main)',
    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
    resize: 'vertical', minHeight: '90px'
  }
};

const EditModal = ({ title, fields, onSave, onClose, onDelete, extraActions }) => {
  const [values, setValues] = useState(() => {
    const initial = {};
    fields.forEach(f => { initial[f.key] = f.value; });
    return initial;
  });
  const [uploadingKey, setUploadingKey] = useState(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSave = () => {
    onSave(values);
    onClose();
    showToast('Sauvegardé ✓');
  };

  const modal = (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200000,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0',
      }}
    >
      <div style={{
        background: '#fff', width: '100%', maxWidth: '500px',
        borderRadius: '28px 28px 0 0', padding: '28px 24px 40px',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.15)',
        maxHeight: '90vh', overflowY: 'auto',
        animation: 'slideUpModal 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', marginBottom: '2px' }}>
              ✏️ Mode Admin
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{title}</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#f4f4f5', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {fields.map((field) => (
            <div key={field.key}>
              <label style={FIELD_STYLES.label}>{field.label}</label>

              {field.type === 'textarea' ? (
                <textarea
                  style={FIELD_STYLES.textarea}
                  value={values[field.key] || ''}
                  onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
                />
              ) : field.type === 'select' ? (
                <select
                  style={{ ...FIELD_STYLES.input }}
                  value={values[field.key] || ''}
                  onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                >
                  {(field.options || []).map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.type === 'image' ? (
                <div>
                  {/* Upload button */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: uploadingKey === field.key ? '#f4f4f5' : 'var(--primary)',
                      color: uploadingKey === field.key ? 'var(--text-muted)' : '#fff',
                      border: 'none', borderRadius: '10px', padding: '9px 14px',
                      fontSize: '13px', fontWeight: 700, cursor: uploadingKey === field.key ? 'wait' : 'pointer',
                      flexShrink: 0, transition: 'all 0.2s',
                    }}>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        disabled={!!uploadingKey}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingKey(field.key);
                          try {
                            const url = await uploadImageToSupabase(file);
                            setValues(v => ({ ...v, [field.key]: url }));
                            showToast('Image uploadée ✓');
                          } catch (err) {
                            showToast('Erreur upload : ' + err.message);
                          } finally {
                            setUploadingKey(null);
                          }
                        }}
                      />
                      {uploadingKey === field.key
                        ? <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Upload...</>
                        : <><Upload size={14} /> Uploader</>
                      }
                    </label>
                    <input
                      type="text"
                      placeholder="ou coller une URL"
                      style={{ ...FIELD_STYLES.input, marginBottom: 0 }}
                      value={values[field.key] || ''}
                      onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
                    />
                  </div>
                  {values[field.key] && (
                    <div style={{ borderRadius: '10px', overflow: 'hidden', height: '120px', background: '#f4f4f5' }}>
                      <img src={values[field.key]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" onError={e => e.target.style.display='none'} />
                    </div>
                  )}
                </div>
              ) : field.type === 'date' ? (
                <input
                  type="date"
                  style={{ ...FIELD_STYLES.input, colorScheme: 'light' }}
                  value={values[field.key] || ''}
                  onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
                />
              ) : (
                <input
                  type={field.type === 'price' ? 'number' : 'text'}
                  style={FIELD_STYLES.input}
                  value={values[field.key] || ''}
                  onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
                />
              )}
            </div>
          ))}
        </div>

        {/* Extra inline actions (e.g. list item management) */}
        {extraActions && (
          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            {extraActions}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
          {onDelete && (
            <button
              onClick={() => { onDelete(); onClose(); }}
              style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '12px', padding: '12px 16px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
            >
              <Trash2 size={15} /> Supprimer
            </button>
          )}
          <button
            onClick={onClose}
            style={{ background: '#f4f4f5', color: 'var(--text-muted)', border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', flex: 1 }}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 14px var(--accent-glow)' }}
          >
            <Save size={15} /> Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default EditModal;
