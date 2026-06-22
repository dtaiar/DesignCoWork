import { skills, skillGroups } from '../data/skills'

const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: 'var(--text-3)', flexShrink: 0 }}>
    <path d="M7 5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function ToolsTab({ onOpenSkill }) {
  return (
    <div style={{ padding: '0 20px 8px' }}>
      {skillGroups.map(group => (
        <div key={group.id}>
          <div style={{ padding: '18px 0 10px', fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {group.label}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {skills.filter(s => s.group === group.id).map(skill => (
              <button
                key={skill.id}
                onClick={() => onOpenSkill(skill.id)}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14,
                  padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
                  textAlign: 'left', fontFamily: 'inherit', width: '100%',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 13, background: skill.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {skill.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 2 }}>{skill.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.desc}</div>
                </div>
                <Arrow />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
