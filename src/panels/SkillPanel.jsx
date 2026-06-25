import { useState, useRef, useEffect } from 'react'
import { skills } from '../data/skills'

function ChipGroup({ options, defaults = [], single = false, onChange }) {
  const [selected, setSelected] = useState(new Set(defaults))

  const toggle = (opt) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (single) { next.clear(); next.add(opt) }
      else { next.has(opt) ? next.delete(opt) : next.add(opt) }
      onChange?.([...next])
      return next
    })
  }

  return (
    <div className="chips-row">
      {options.map(opt => (
        <button
          key={opt}
          className={`sel-chip${selected.has(opt) ? ' on' : ''}`}
          onClick={() => toggle(opt)}
          type="button"
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function SkillForm({ fields, formRef, prefill }) {
  return (
    <>
      {fields.map((f, i) => {
        // Pre-fill first textarea with capture context if provided
        const defaultValue = (i === 0 && f.type === 'textarea' && prefill) ? prefill : ''
        if (defaultValue && formRef.current) formRef.current[f.label] = defaultValue
        return (
          <div key={i} className="form-group">
            <label className="form-label">
              {f.label}
              {f.optional && <span className="form-hint"> (optional)</span>}
            </label>
            {f.type === 'textarea' && (
              <textarea
                className="input"
                rows={f.rows || 3}
                placeholder={f.placeholder}
                defaultValue={defaultValue}
                onChange={e => { if (formRef.current) formRef.current[f.label] = e.target.value }}
              />
            )}
            {f.type === 'input' && (
              <input
                className="input"
                placeholder={f.placeholder}
                onChange={e => { if (formRef.current) formRef.current[f.label] = e.target.value }}
              />
            )}
            {f.type === 'chips' && (
              <ChipGroup
                options={f.options}
                defaults={f.defaults || []}
                single={!!f.group}
                onChange={vals => { if (formRef.current) formRef.current[f.label] = vals }}
              />
            )}
          </div>
        )
      })}
    </>
  )
}

export default function SkillPanel({ open, skill, onClose, onRun, prefill }) {
  const def = skills.find(s => s.id === skill)
  const formRef = useRef({})
  const [running, setRunning] = useState(false)
  // key forces SkillForm + ChipGroups to fully remount when skill changes or panel reopens
  const [formKey, setFormKey] = useState(0)

  // Reset form and state when skill changes or panel reopens
  useEffect(() => {
    if (open) {
      formRef.current = {}
      setRunning(false)
      setFormKey(k => k + 1)
    }
  }, [open, skill])

  if (!def) return null

  const handleRun = async () => {
    setRunning(true)

    // Map form labels to output generator input shape
    const raw = formRef.current
    const input = {
      context:       raw['What are you designing?'] || raw['What are you auditing?'] || raw['Research input'] || raw['Paste the brief'] || raw['Context'] || raw['Describe the component'] || '',
      stage:         (raw['Design stage'] || ['Exploration'])[0] || 'Exploration',
      focusAreas:    raw['Focus areas'] || [],
      componentName: raw['Component or feature name'] || '',
      componentType: (raw['Page or component type'] || ['Form'])[0] || 'Form',
      elementType:   (raw['UI element type'] || ['Error message'])[0] || 'Error message',
      tone:          (raw['Tone'] || ['Clear and direct'])[0] || 'Clear and direct',
      focusQuestion: raw['Focus question'] || '',
    }

    try {
      const res = await fetch('/api/skill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId: def.id, input }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      const output = await res.json()
      onRun(output)
    } catch (e) {
      // Fallback: close panel and show error via parent toast if available
      console.error('[skill] API error:', e.message)
      onRun({
        skill: def.name, skillColor: 'var(--text-3)', icon: def.icon,
        title: 'Generation failed',
        sections: [{ label: 'Error', type: 'body', text: e.message }],
        copyText: '',
      })
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className={`panel${open ? ' open' : ''}`}>
      <div className="panel-handle" />
      <div className="panel-head">
        <div className="panel-icon">{def.icon}</div>
        <div className="panel-title">{def.name}</div>
        <div className="panel-sub">{def.desc}</div>
      </div>
      <div className="panel-body">
        <SkillForm key={formKey} fields={def.fields} formRef={formRef} prefill={prefill} />
      </div>
      <div className="panel-footer">
        <button
          className="btn btn-primary btn-full"
          onClick={handleRun}
          disabled={running}
          style={{ opacity: running ? 0.7 : 1, gap: 8 }}
        >
          {running && <span className="pulse" style={{ background: 'white' }} />}
          {running ? 'Generating…' : def.runLabel}
        </button>
        <button className="btn btn-secondary btn-full" onClick={onClose} disabled={running}>
          Cancel
        </button>
      </div>
    </div>
  )
}
