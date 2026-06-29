import { useState } from 'react'

const CONTEXT_SKILLS = [
  { id: 'critique', icon: '🔍', label: 'Design Critique' },
  { id: 'brief',    icon: '📋', label: 'PM Brief' },
  { id: 'a11y',    icon: '♿', label: 'Accessibility' },
  { id: 'handoff', icon: '📐', label: 'Dev Handoff' },
]

/**
 * CaptureDetailPanel — full-view slide-up for a saved capture (F-066, F-068, F-069)
 */
export default function CaptureDetailPanel({ open, capture: c, onClose, onOpenPost, onUseAsContext, showToast }) {
  const [showSkillPicker, setShowSkillPicker] = useState(false)

  if (!c) return null

  const copyBrief = () => {
    const text = [
      c.title, c.source, '',
      'Three things that matter',
      ...(c.points || []).map(p => `→ ${p}`),
      '', 'Why it matters for your work', c.relevance,
    ].join('\n')
    navigator.clipboard?.writeText(text)
    showToast?.('Brief copied ✓')
  }

  const useAsContext = (skillId) => {
    setShowSkillPicker(false)
    onClose()
    setTimeout(() => onUseAsContext?.(skillId, c), 120)
  }

  return (
    <>
      <div
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.32)', zIndex: 199,
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.22s ease',
        }}
        onClick={() => { setShowSkillPicker(false); onClose() }}
      />
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'var(--surface)', borderRadius: '16px 16px 0 0',
          zIndex: 200,
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
          pointerEvents: open ? 'auto' : 'none',
          maxHeight: '90dvh', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '12px 20px 14px', borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                textTransform: 'uppercase', color: c.typeColor || 'var(--accent)',
              }}>{c.type}</div>
              {c.chip && (
                <div style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 100,
                  background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)',
                }}>{c.chip}</div>
              )}
              {c.chip2 && (
                <div style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 100,
                  background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)',
                }}>{c.chip2}</div>
              )}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.3 }}>{c.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>{c.source}</div>
          </div>
          <button
            onClick={() => { setShowSkillPicker(false); onClose() }}
            style={{
              background: 'var(--surface-2)', border: 'none', borderRadius: 100,
              width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0, marginTop: 2, color: 'var(--text-2)', fontSize: 16, fontFamily: 'inherit',
            }}
          >×</button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '20px 20px 8px' }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
            textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10,
          }}>Three things that matter</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {(c.points || []).map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 100,
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'var(--text-3)', flexShrink: 0, marginTop: 1,
                }}>{i + 1}</div>
                <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text-1)' }}>{p}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--accent-2, #F0EFFE)', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: 'var(--accent)',
              textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 8,
            }}>Why it matters for your work</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-1)' }}>{c.relevance}</div>
          </div>

          {/* Skill picker */}
          {showSkillPicker && (
            <div style={{
              border: '1.5px solid var(--border)', borderRadius: 12,
              padding: '14px 16px', marginBottom: 12, background: 'var(--surface-2)',
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
                textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10,
              }}>Use as context in…</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CONTEXT_SKILLS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => useAsContext(s.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 10,
                      border: '1.5px solid var(--border)', background: 'var(--surface)',
                      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 8,
          padding: '12px 20px', borderTop: '1px solid var(--border)',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={copyBrief}>Copy brief</button>
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => setShowSkillPicker(v => !v)}
            >{showSkillPicker ? 'Cancel' : 'Use as context'}</button>
          </div>
          <button
            className="btn btn-primary btn-full"
            onClick={() => { onClose(); onOpenPost?.({ type: 'capture', capture: c }) }}
          >Write LinkedIn post</button>
        </div>
      </div>
    </>
  )
}
