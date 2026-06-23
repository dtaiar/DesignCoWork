import { useState, useRef, useEffect } from 'react'
import { skills } from '../data/skills'
import { generateOutput } from '../data/outputs'

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

function SkillForm({ fields, formRef }) {
  return (
    <>
      {fields.map((f, i) => (
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
      ))}
    </>
  )
}

export default function SkillPanel({ open, skill, onClose, onRun }) {
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

  const handleRun = () => {
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

    // Simulate processing delay (replace with real API call later)
    setTimeout(() => {
      const output = generateOutput(def.id, input)
      setRunning(false)
      onRun(output)
    }, 1200)
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
        <SkillForm key={formKey} fields={def.fields} formRef={formRef} />
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
