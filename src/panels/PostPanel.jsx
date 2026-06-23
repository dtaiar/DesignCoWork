import { useState, useEffect } from 'react'

// Generate post angles from a capture's actual content
function anglesFromCapture(capture) {
  const { title, points = [], relevance = '' } = capture
  return [
    {
      label: 'Educational',
      text: `${points[0] || title}

${points[1] ? `${points[1]}\n\n` : ''}${points[2] || ''}

Most teams learn this the wrong way — by shipping first and revisiting when it breaks. The order matters more than the details.`,
    },
    {
      label: 'Opinion',
      text: `Here's the thing about ${title.split(' — ')[0] || title}:

${points[0] || ''}

The conventional wisdom says to start with the obvious fix. I'd argue that's almost always wrong. The obvious fix addresses the symptom. The pattern underneath it is what keeps producing new symptoms.

${relevance ? relevance.split('.')[0] + '.' : ''}`,
    },
    {
      label: 'Observation',
      text: `Read something today that reframed a problem I've been looking at the wrong way.

"${points[0] || title}"

${relevance || ''}

It's rare that a single sentence shifts how you think about a problem. This one did.`,
    },
  ]
}

// Generate a post from a topic name
function postFromTopic(topicName) {
  const posts = {
    'Progressive Disclosure': `Progressive disclosure isn't a pattern for hiding complexity.

It's a contract with the user: I'll show you what you need to act now. The rest is here when you need it.

Where teams go wrong is hiding things the user needs on their first action. That's not disclosure — it's friction disguised as clean design.

Three questions before you decide what to hide:
1. What does the user need to complete the task in front of them?
2. What do they need to understand what they've done?
3. What can wait until after they've decided?

If you can't answer question 1 without the hidden content, it shouldn't be hidden.`,
    'Mobile Navigation': `The hardest navigation problems on mobile aren't about the number of items.

They're about what "navigation" even means when the user is in a context that changes every 30 seconds.

A tab bar works when users switch between modes. A command palette works when users know what they want. Gesture navigation works when the user's next action is predictable from their current one.

The failure mode is picking the wrong model for the context — then tuning it forever trying to make it work.`,
    'Error States': `Error messages are the only time in a product where you're guaranteed the user is frustrated.

That's exactly when most UI copy is at its worst: vague, apologetic, and system-facing instead of user-facing.

Three things every error message needs:
1. What happened (specific, not generic)
2. Why it happened (if it's not obvious)
3. What to do next (one action, not a list of options)

"Something went wrong" answers none of these. It's a message that prioritizes the system's uncertainty over the user's need to continue.`,
    'Accessibility': `Accessibility failures aren't design bugs. They're gaps in who the design was imagined for.

The teams that catch the most issues early aren't the ones with the best automated tooling — they're the ones who test with AT users at the same stage they'd test with any other user.

Automated checks catch 30–40% of WCAG failures. The rest require a person using a screen reader, a keyboard, or a voice control device to actually try the interface.

The practice that scales: add one manual AT session per sprint, same as you'd add one usability session.`,
    'Design Critique': `Most design critique is feedback on taste, not function.

"I'd make it bigger" is an opinion. "Users can't read this at 11px on an OLED screen in sunlight" is a critique.

The difference: a critique connects an observation to a consequence. Taste connects an observation to a preference.

Neither is wrong. But only one of them gives the designer something to act on.`,
    'Design Tokens': `Most design token implementations fail at the semantic layer.

Not because naming is hard. Because teams skip the step where they decide what the token means before they decide what it's called.

A color called blue-500 is a primitive. A color called action-primary is a decision.

Three tiers. In this order:
1. Global primitives (values with no opinion)
2. Semantic decisions (values with a job)
3. Component overrides (values scoped to a specific context)

Most teams do 1 and 3. They skip 2 and wonder why theming is hard.`,
  }

  return posts[topicName] || `${topicName} is one of those topics where the gap between knowing the principle and applying it is almost always larger than it looks.

The cases that work share one thing: the team agreed on what problem they were solving before they agreed on the solution.

The cases that don't work: the solution was picked first, then a problem was found to justify it.`
}

export default function PostPanel({ open, context, onClose, showToast }) {
  const [selected, setSelected] = useState(0)

  // Reset angle selection whenever context changes (switching capture → topic or vice versa)
  useEffect(() => { setSelected(0) }, [context])

  const isTopic = context?.type === 'topic'
  const isCapture = context?.type === 'capture'

  const angles = isCapture
    ? anglesFromCapture(context.capture)
    : [{ label: 'Draft', text: postFromTopic(context?.topic || '') }]

  const copy = () => {
    navigator.clipboard?.writeText(angles[selected]?.text || '')
    showToast('Copied to clipboard ✓')
  }

  const title = isCapture ? context.capture.title : context?.topic
  const sub = isCapture
    ? `From reference · ${angles.length} angles`
    : `Topic library · pure design`

  return (
    <div className={`panel${open ? ' open' : ''}`}>
      <div className="panel-handle" />
      <div className="panel-head">
        <div className="panel-icon">✍️</div>
        <div className="panel-title" style={{ fontSize: 16 }}>{title}</div>
        <div className="panel-sub">{sub}</div>
      </div>
      <div className="panel-body">
        {isCapture && (
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
        <div style={{
          border: '1.5px solid var(--accent)', borderRadius: 14, background: 'var(--accent-2)',
          padding: '14px 16px', fontSize: 14, lineHeight: 1.75, whiteSpace: 'pre-line', color: 'var(--text-1)',
        }}>
          {angles[selected]?.text}
        </div>
        {isTopic && (
          <button className="btn btn-secondary btn-full" onClick={() => showToast('Regenerating…')}>
            Try a different angle
          </button>
        )}
      </div>
      <div className="panel-footer">
        <button className="btn btn-primary btn-full" onClick={copy}>Copy post</button>
        <button className="btn btn-secondary btn-full" onClick={onClose}>Save to drafts</button>
      </div>
    </div>
  )
}
