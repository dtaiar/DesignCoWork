import { useState, useMemo } from 'react'

const filters = ['All', 'Critique', 'A11y', 'Handoff', 'UX Copy', 'Brief', 'Research', 'System']
const filterMap = {
  'Critique': 'Design Critique',
  'A11y': 'Accessibility Review',
  'Handoff': 'Dev Handoff',
  'UX Copy': 'UX Copy',
  'Brief': 'PM Brief Intake',
  'Research': 'Research Synthesis',
  'System': 'Design System Audit',
}

function formatAge(iso) {
  if (!iso) return ''
  const ms = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(ms / 60000)
  const hours = Math.floor(ms / 3600000)
  const days = Math.floor(ms / 86400000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return `${Math.floor(days / 7)}w ago`
}

export default function LibraryTab({ onOpenOutput, showToast, outputs = [], onDeleteOutput }) {
  const [active, setActive] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = outputs
    if (active !== 'All') list = list.filter(o => o.skill === filterMap[active])
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(o =>
        (o.title || '').toLowerCase().includes(q) ||
        (o.skill || '').toLowerCase().includes(q) ||
        (o.copyText || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [outputs, active, search])

  return (
    <>
      {/* Filter chips */}
      <div style={{ padding: '12px 20px 0', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActive(f)}
            style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 100,
              border: `1.5px solid ${active === f ? 'var(--accent)' : 'var(--border)'}`,
              background: active === f ? 'var(--accent-2)' : 'var(--surface)',
              color: active === f ? 'var(--accent)' : 'var(--text-2)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent', fontFamily: 'inherit',
            }}
          >{f}</button>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding: '10px 20px 0' }}>
        <input
          className="input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search saved outputs…"
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
      </div>

      <div className="section-header">
        <span className="section-title">Saved outputs</span>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
          {search.trim() || active !== 'All' ? `${filtered.length} of ${outputs.length}` : `${outputs.length} total`}
        </span>
      </div>

      {outputs.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-3)' }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>📚</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>No saved outputs yet</div>
          <div style={{ fontSize: 13, lineHeight: 1.5 }}>Run a skill and tap "Save to library" to keep it here.</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
          No outputs match this filter.
        </div>
      ) : (
        <div className="item-list">
          {filtered.map(o => (
            <div key={o.id} className="item-card" onClick={() => onOpenOutput(o)}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: o.skillColor || 'var(--accent)', marginBottom: 5 }}>{o.skill}</div>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 8 }}>{o.title}</div>
              {o.sections?.[0] && (
                <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {o.sections[0].type === 'bullets'
                    ? (o.sections[0].items || [])[0]
                    : o.sections[0].text || ''}
                </div>
              )}
              <div className="item-footer" style={{ justifyContent: 'space-between' }}>
                <span className="chip chip-neutral">{formatAge(o.savedAt)}</span>
                <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => { navigator.clipboard?.writeText(o.copyText || ''); showToast('Copied ✓') }}
                  >Copy</button>
                  <button
                    className="btn btn-sm btn-secondary"
                    style={{ color: 'var(--red, #E85C4A)' }}
                    onClick={() => { onDeleteOutput?.(o.id); showToast('Deleted') }}
                  >Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="spacer" />
    </>
  )
}
