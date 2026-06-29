import { useState, useEffect } from 'react'

const PRESETS = [
  { name: 'Hedging Tool', description: 'Energy trading hedging features and UX improvements' },
  { name: 'Customer Portal', description: 'Customer-facing portal features and design standards' },
]

/**
 * ProjectPanel — slide-up to set or clear the active project context (F-040, F-041)
 */
export default function ProjectPanel({ open, project, onSave, onClear, onClose }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  // Sync fields when panel opens
  useEffect(() => {
    if (open) {
      setName(project?.name || '')
      setDescription(project?.description || '')
    }
  }, [open, project])

  const handleSave = () => {
    const trimmedName = name.trim()
    if (!trimmedName) return
    onSave({ name: trimmedName, description: description.trim() })
    onClose()
  }

  const handleClear = () => {
    onClear()
    onClose()
  }

  const applyPreset = (preset) => {
    setName(preset.name)
    setDescription(preset.description)
  }

  return (
    <>
      <div
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.32)', zIndex: 199,
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.22s ease',
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'var(--surface)', borderRadius: '16px 16px 0 0',
          zIndex: 200,
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
          pointerEvents: open ? 'auto' : 'none',
          maxHeight: '85dvh', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px 14px', borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
              {project ? 'Edit project context' : 'Set project context'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>
              Scopes all skill runs and captures
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--surface-2)', border: 'none', borderRadius: 100,
              width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-2)', fontSize: 16, fontFamily: 'inherit',
            }}
          >×</button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '20px' }}>
          {/* Quick presets */}
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10 }}>
            Quick select
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {PRESETS.map(p => (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 10,
                  border: `1.5px solid ${name === p.name ? 'var(--accent)' : 'var(--border)'}`,
                  background: name === p.name ? 'var(--accent-2)' : 'var(--surface)',
                  color: name === p.name ? 'var(--accent)' : 'var(--text-1)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent', fontFamily: 'inherit', textAlign: 'left',
                }}
              >
                <div>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2, fontWeight: 400 }}>{p.description}</div>
              </button>
            ))}
          </div>

          {/* Custom name */}
          <div className="form-group">
            <label className="form-label">Project name</label>
            <input
              className="input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Hedging Tool, Customer Portal…"
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus={open}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Context <span className="form-hint">(optional)</span></label>
            <textarea
              className="input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief scope note — shown to AI when you run skills"
              rows={3}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 8,
          padding: '12px 20px',
          borderTop: '1px solid var(--border)',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
        }}>
          <button
            className="btn btn-primary btn-full"
            onClick={handleSave}
            disabled={!name.trim()}
            style={{ opacity: name.trim() ? 1 : 0.5 }}
          >Set as active project</button>
          {project && (
            <button className="btn btn-secondary btn-full" onClick={handleClear} style={{ color: 'var(--red, #E85C4A)' }}>
              Clear project context
            </button>
          )}
          <button className="btn btn-secondary btn-full" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </>
  )
}
