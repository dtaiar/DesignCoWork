import { useState } from 'react'
import { skills } from '../data/skills'

function ChipGroup({ options, defaults = [], single = false }) {
  const [selected, setSelected] = useState(new Set(defaults))
  const toggle = (opt) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (single) { next.clear(); next.add(opt) }
      else { next.has(opt) ? next.delete(opt) : next.add(opt) }
      return next
    })
  }
  return (
    <div className="chips-row">
      {options.map(opt => (
        <button key={opt} className={`sel-chip${selected.has(opt) ? ' on' : ''}`} onClick={() => toggle(opt)}>
          {opt}
        </button>
      ))}
    </div>
  )
}

function SkillForm({ fields }) {
  return (
    <>
      {fields.map((f, i) => (
        <div key={i} className="form-group">
          <label className="form-label">
            {f.label}
            {f.optional && <span className="form-hint"> (optional)</span>}
          </label>
          {f.type === 'textarea' && (
            <textarea className="input" rows={f.rows || 3} placeholder={f.placeholder} />
          )}
          {f.type === 'input' && (
            <input className="input" placeholder={f.placeholder} />
          )}
          {f.type === 'chips' && (
            <ChipGroup options={f.options} defaults={f.defaults || []} single={!!f.group} />
          )}
        </div>
      ))}
    </>
  )
}

export default function SkillPanel({ open, skill, onClose, onRun }) {
  const def = skills.find(s => s.id === skill)
  if (!def) return null

  return (
    <>
      <div className={`panel${open ? ' open' : ''}`}>
        <div className="panel-handle" />
        <div className="panel-head">
          <div className="panel-icon">{def.icon}</div>
          <div className="panel-title">{def.name}</div>
          <div className="panel-sub">{def.desc}</div>
        </div>
        <div className="panel-body">
          <SkillForm fields={def.fields} />
        </div>
        <div className="panel-footer">
          <button className="btn btn-primary btn-full" onClick={onRun}>{def.runLabel}</button>
          <button className="btn btn-secondary btn-full" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </>
  )
}
