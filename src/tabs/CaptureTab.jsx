import { useState, useMemo } from 'react'

export default function CaptureTab({ onOpenPost, onOpenCapture, showToast, captures = [], addCapture }) {
  const [inputType, setInputType] = useState('url')
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('idle') // idle | fetching | enriching | error
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return captures
    const q = search.toLowerCase()
    return captures.filter(c =>
      (c.title || '').toLowerCase().includes(q) ||
      (c.source || '').toLowerCase().includes(q) ||
      (c.chip || '').toLowerCase().includes(q) ||
      (c.chip2 || '').toLowerCase().includes(q) ||
      (c.relevance || '').toLowerCase().includes(q) ||
      (c.points || []).some(p => p.toLowerCase().includes(q))
    )
  }, [captures, search])

  const placeholders = {
    url: 'Paste a URL, LinkedIn post, or article link…',
    text: 'Paste text, a quote, or a snippet…',
    note: 'Write a quick note or observation…',
  }

  const statusLabel = {
    fetching: 'Fetching page…',
    enriching: 'Analyzing with AI…',
  }

  const runCapture = async () => {
    const val = input.trim()
    if (!val) { showToast('Paste a URL or text first'); return }

    setInput('')
    setStatus('fetching')

    try {
      const res = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: inputType === 'url' ? val : '',
          text: inputType !== 'url' ? val : '',
          inputType,
        }),
      })

      setStatus('enriching')

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }

      const capture = await res.json()
      addCapture?.(capture)
      showToast('Reference saved ✓')
    } catch (e) {
      showToast(`Could not enrich: ${e.message}`)
    } finally {
      setStatus('idle')
    }
  }

  const loading = status !== 'idle'

  return (
    <>
      {/* Input area */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '16px 20px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Add a design reference
        </div>

        {/* Type selector */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {['url', 'text', 'note'].map(t => (
            <button
              key={t}
              onClick={() => setInputType(t)}
              style={{
                padding: '5px 12px', borderRadius: 100,
                border: `1.5px solid ${inputType === t ? 'var(--accent)' : 'var(--border)'}`,
                background: inputType === t ? 'var(--accent-2)' : 'var(--surface)',
                color: inputType === t ? 'var(--accent)' : 'var(--text-2)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent', fontFamily: 'inherit',
                textTransform: 'capitalize',
              }}
            >{t}</button>
          ))}
        </div>

        {/* Input + Analyze */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={placeholders[inputType]}
            onKeyDown={e => e.key === 'Enter' && !loading && runCapture()}
            disabled={loading}
            style={{ flex: 1 }}
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={runCapture}
            disabled={loading}
          >
            {loading ? '…' : 'Analyze'}
          </button>
        </div>
      </div>

      {/* Search + list header */}
      <div style={{ padding: '10px 20px 0' }}>
        <input
          className="input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search references…"
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
      </div>
      <div className="section-header">
        <span className="section-title">Saved references</span>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
          {search.trim() ? `${filtered.length} of ${captures.length}` : `${captures.length} captures`}
        </span>
      </div>

      {/* Capture cards */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Loading skeleton */}
        {loading && (
          <div className="cap-card">
            <div className="enrich-loading">
              <div className="pulse" />
              <span className="enrich-loading-text">{statusLabel[status] || 'Working…'}</span>
            </div>
          </div>
        )}

        {filtered.length === 0 && !loading && search.trim() && (
          <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
            No captures match "{search}"
          </div>
        )}
        {filtered.map(c => (
          <div
            key={c.id}
            className="cap-card"
            onClick={() => onOpenCapture?.(c)}
            style={{ cursor: 'pointer' }}
          >
            <div className="cap-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
                <div className="cap-type" style={{ color: c.typeColor }}>{c.type}</div>
                {c.chip && (
                  <div style={{
                    fontSize: 11, fontWeight: 600, padding: '1px 6px', borderRadius: 100,
                    background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)',
                  }}>{c.chip}</div>
                )}
                {c.chip2 && (
                  <div style={{
                    fontSize: 11, fontWeight: 600, padding: '1px 6px', borderRadius: 100,
                    background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)',
                  }}>{c.chip2}</div>
                )}
              </div>
              <div className="cap-title">{c.title}</div>
              <div className="cap-source">{c.source}</div>
            </div>
            <div className="cap-brief">
              <div className="cap-brief-title">Three things that matter</div>
              <ul className="cap-points">
                {(c.points || []).map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            <div className="cap-relevance">
              <div className="cap-relevance-label">Why it matters for your work</div>
              <div className="cap-relevance-text">{c.relevance}</div>
            </div>
            <div className="cap-actions" onClick={e => e.stopPropagation()}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  const text = [
                    c.title, c.source, '',
                    'Three things that matter',
                    ...(c.points || []).map(p => `→ ${p}`),
                    '', 'Why it matters:', c.relevance,
                  ].join('\n')
                  navigator.clipboard?.writeText(text)
                  showToast('Brief copied ✓')
                }}
              >Copy brief</button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onOpenPost({ type: 'capture', capture: c })}
              >Write post</button>
            </div>
          </div>
        ))}
      </div>

      <div className="spacer" />
    </>
  )
}
