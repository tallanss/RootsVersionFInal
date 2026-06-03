import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import EditModal from './EditModal';

/**
 * EditableBlock — Wrapper conditionnel pour les sections éditables
 *
 * En mode public : rend uniquement les enfants, sans markup supplémentaire
 * En mode admin : ajoute un contour doré + boutons d'action au survol
 *
 * Props:
 * - children: ReactNode
 * - label: string — nom du bloc affiché sur le bouton
 * - modalTitle: string — titre de la modal d'édition
 * - fields: Array  — champs de la modal (voir EditModal)
 * - onSave(values): void
 * - onDelete?: () => void
 * - onAdd?: { label, fields, onSave } — config pour le bouton "Ajouter"
 * - style?: CSSProperties — styles supplémentaires sur le wrapper
 * - noWrapper?: bool — si true, n'ajoute pas de div wrapper (pour les éléments inline)
 */
const EditableBlock = ({
  children,
  label = 'Modifier',
  modalTitle,
  fields = [],
  onSave,
  onDelete,
  onAdd,
  style,
  tag: Tag = 'div',
}) => {
  const { isAdminMode } = useAdmin();
  const [hovered, setHovered] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  // En mode public: on rend juste les enfants sans overhead
  if (!isAdminMode) {
    if (Tag !== 'div') return <Tag style={style}>{children}</Tag>;
    return <>{children}</>;
  }

  return (
    <Tag
      style={{
        position: 'relative',
        outline: '3px dashed #2c2416',
        outlineOffset: '4px',
        borderRadius: '8px',
        transition: 'outline-color 0.2s',
        marginBottom: '4px',
        padding: '4px',
        ...style,
      }}
    >
      {children}

      {/* Overlay buttons — visible en permanence en mode admin */}
      <div
        style={{
          position: 'absolute',
          top: '-12px',
          right: '4px',
          display: 'flex',
          gap: '6px',
          zIndex: 1000,
        }}
      >
        {/* Bouton Modifier */}
        {fields.length > 0 && onSave && (
          <button
            onClick={(e) => { e.stopPropagation(); setEditOpen(true); }}
            title={`Modifier : ${label}`}
            style={{
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              whiteSpace: 'nowrap',
            }}
          >
            <Pencil size={12} /> {label}
          </button>
        )}

        {/* Bouton Supprimer */}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); if (window.confirm(`Supprimer cet élément ?`)) onDelete(); }}
            title="Supprimer"
            style={{
              background: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 10px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            }}
          >
            <Trash2 size={12} />
          </button>
        )}

        {/* Bouton Ajouter */}
        {onAdd && (
          <button
            onClick={(e) => { e.stopPropagation(); setAddOpen(true); }}
            title={`Ajouter : ${onAdd.label}`}
            style={{
              background: '#16a34a',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              whiteSpace: 'nowrap',
            }}
          >
            <Plus size={12} /> {onAdd.label}
          </button>
        )}
      </div>

      {/* Modal d'édition */}
      {editOpen && (
        <EditModal
          title={modalTitle || label}
          fields={fields}
          onSave={onSave}
          onClose={() => setEditOpen(false)}
          onDelete={onDelete ? () => onDelete() : undefined}
        />
      )}

      {/* Modal d'ajout */}
      {addOpen && onAdd && (
        <EditModal
          title={onAdd.label}
          fields={onAdd.fields}
          onSave={onAdd.onSave}
          onClose={() => setAddOpen(false)}
        />
      )}
    </Tag>
  );
};

export default EditableBlock;
