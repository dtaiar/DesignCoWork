import { useState, useEffect, useRef } from 'react'

export default function PostPanel({ open, context, onClose, showToast, onSaveDraft }) {
  const [angles, setAngles] = useState([])
  const [selected, setSelected] = useState(0)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef(null)

  // Generate angles whenever context changes and panel opens
  useEffect(() => {
    if (!open || !context) return
    setAngles([])
    setSelected(0)
    setDraft('')
    generate()
  }, [open, context])

  // Sync draft to selected angle
  useEffect(() => {
    if (angles[selected]) setDraft(angles[selected].text)
  }, [selected, angles])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [draft])

  const generate = async () => {
    setLoading(true)
    try {
      const body = context.type === 'capture'
        ? { capture: context.capture }
        : { topic: context.topic }

      const res = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      const { angles: generated } = await res.json()
      setAngles(generated)
      setSelected(0)
      setDraft(generated[0]?.text || '')
    } catch (e) {
      showToast(`Could not generate: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const copy = () => {
    navigator.clipboard?.writeText(draft)
    showToast('Copied to clipboard ✓')
  }

  const isTopic = context?.type === 'topic'
  const isCapture = context?.type === 'capture'
  const title = isCapture ? context.capture?.title : context?.topic
  const sub = isCapture ? 'From reference' : 'Topic library · pure design'

  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0

  return (
    <div className={`panel${open ? ' open' : ''}`}>
      <div className="panel-handle" />
      <div className="panel-head">
        <div className="panel-icon">✍️</div>
        <div className="panel-title" style={{ fontSize: 16 }}>{title || 'LinkedIn Post'}</div>
        <div className="panel-sub">{sub}</div>
      </div>

      <div className="panel-body">
        {/* Angle selector — only for captures with multiple angles */}
        {isCapture && angles.length > 1 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {angles.map((a, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`sel-chip${selected === i ? ' on' : ''}`}
              >{a.label}</button>
            ))}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{
            border: '1.5px solid var(--border)', borderRadius: 14,
            padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 10,
            color: 'var(--text-3)', fontSize: 14,
          }}>
            <div className="pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
            Writing post…
          </div>
        )}

        {/* Editable draft */}
        {!loading && draft && (
          <div style={{ position: 'relative' }}>
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                border: '1.5px solid var(--accent)', borderRadius: 14,
                background: 'var(--accent-2)',
                padding: '14px 16px', fontSize: 14, lineHeight: 1.75,
                color: 'var(--text-1)', resize: 'none', overflow: 'hidden',
                fontFamily: 'inherit', outline: 'none',
                minHeight: 120,
              }}
            />
            <div style={{
              position: 'absolute', bottom: 10, right: 14,
              fontSize: 11, color: 'var(--text-3)',
            }}>{wordCount}w</div>
          </div>
        )}

        {/* Regenerate */}
        {!loading && (
          <button
            className="btn btn-secondary btn-full"
            onClick={generate}
            style={{ marginTop: 4 }}
          >
            {angles.length ? 'Regenerate' : 'Generate post'}
          </button>
        )}
      </div>

      <div className="panel-footer">
        <button
          className="btn btn-primary btn-full"
          onClick={copy}
          disabled={!draft || loading}
        >Copy post</button>
        <button
          className="btn btn-secondary btn-full"
          disabled={!draft || loading}
          onClick={() => {
            const source = isTopic ? `Topic · ${context?.topic}` : `From capture · ${context?.capture?.title?.slice(0, 40)}`
            onSaveDraft?.(draft, source)
            showToast?.('Draft saved ✓')
            onClose()
          }}
        >Save draft</button>
      </div>
    </div>
  )
}
