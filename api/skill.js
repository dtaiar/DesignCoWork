const SYSTEM_PROMPT = `You are a senior design expert. Return ONLY valid JSON — no explanation, no markdown fences.

Voice rules for all output:
- Concrete nouns and active verbs. No "leveraging", "utilizing", "holistic", "seamless", "robust".
- No editorialising. Name the specific problem and the specific fix.
- No em-dashes. No bullet openers like "This means..." or "In other words...".
- No reflexive summaries or sign-offs.
- If two points cover it, use two — not three.`

// ── Per-skill prompt builders and output assemblers ─────────────────────────

const specs = {

  critique: {
    prompt: ({ context, stage, focusAreas }) => `
Design Critique.

Component / screen: ${context || 'not specified'}
Design stage: ${stage || 'Exploration'}
${focusAreas?.length ? `Focus areas: ${focusAreas.join(', ')}` : ''}

Return JSON:
{
  "issues": ["up to 3 strings — each names a specific problem and its impact in one sentence"],
  "fixOrder": "one paragraph — which issue to fix first and exactly why",
  "whatsWorking": "one paragraph — 2-3 specific things that are working well"
}`,
    output: ({ context, stage }, { issues, fixOrder, whatsWorking }) => ({
      skill: 'Design Critique',
      skillColor: 'var(--accent)',
      icon: '✦',
      title: (context || 'Design Critique').slice(0, 60),
      stage,
      sections: [
        { label: 'Priority issues', type: 'bullets', items: issues || [] },
        { label: 'Recommended fix order', type: 'callout', text: fixOrder || '' },
        { label: "What's working", type: 'body', text: whatsWorking || '' },
      ],
      copyText: `Design Critique — ${context || ''}\nStage: ${stage || ''}\n\n${(issues || []).map(i => `→ ${i}`).join('\n')}\n\nFix order: ${fixOrder || ''}\n\nWhat's working: ${whatsWorking || ''}`,
    }),
  },

  a11y: {
    prompt: ({ context, componentType }) => `
Accessibility Review.

Component / screen: ${context || 'not specified'}
Component type: ${componentType || 'Form'}

Return JSON:
{
  "failures": [
    {"level": "AA", "criterion": "1.4.3 Contrast", "detail": "specific failure in one sentence"}
  ],
  "passing": [
    {"level": "A", "criterion": "2.1.1 Keyboard", "detail": "what passes and why in one sentence"}
  ],
  "fixOrder": "one paragraph — which failure to fix first and why"
}
Include 3-4 failures and 2-3 passing items. Use real WCAG 2.1 criterion names and numbers.`,
    output: ({ context }, { failures, passing, fixOrder }) => ({
      skill: 'Accessibility Review',
      skillColor: 'var(--green)',
      icon: '◎',
      title: `A11y — ${(context || 'Component').slice(0, 50)}`,
      sections: [
        { label: 'WCAG 2.1 AA — failures', type: 'issues', items: (failures || []).map(f => ({ ...f, status: 'fail' })) },
        { label: 'WCAG 2.1 AA — passing', type: 'issues', items: (passing || []).map(p => ({ ...p, status: 'pass' })) },
        { label: 'Recommended fix order', type: 'callout', text: fixOrder || '' },
      ],
      copyText: `Accessibility Review — ${context || ''}\n\nFailures:\n${(failures || []).map(f => `✗ ${f.criterion} — ${f.detail}`).join('\n')}\n\nPassing:\n${(passing || []).map(p => `✓ ${p.criterion} — ${p.detail}`).join('\n')}\n\nFix order: ${fixOrder || ''}`,
    }),
  },

  handoff: {
    prompt: ({ context, componentName }) => `
Dev Handoff spec.

Component: ${componentName || context || 'not specified'}
${context && componentName ? `Context: ${context}` : ''}

Return JSON:
{
  "layout": "layout spec paragraph: dimensions, spacing, min/max widths, responsive behaviour, grid",
  "tokens": [
    {"token": "surface-1", "value": "#F5F4F0", "usage": "Card background"},
    {"token": "action-primary", "value": "#5B4BF4", "usage": "Primary button fill"}
  ],
  "states": ["one sentence per state: idle, hover, active, focus, disabled, error, loading — include only states that apply"]
}
Include 4-6 tokens with realistic hex values. Include only interaction states that apply to this component.`,
    output: ({ context, componentName }, { layout, tokens, states }) => {
      const subject = componentName || (context || '').slice(0, 40) || 'Component'
      return {
        skill: 'Dev Handoff',
        skillColor: 'var(--blue)',
        icon: '📐',
        title: `Handoff — ${subject}`,
        sections: [
          { label: 'Layout', type: 'body', text: layout || '' },
          { label: 'Design tokens', type: 'tokens', items: tokens || [] },
          { label: 'Interaction states', type: 'bullets', items: states || [] },
        ],
        copyText: `Dev Handoff — ${subject}\n\nLayout: ${layout || ''}\n\nTokens:\n${(tokens || []).map(t => `${t.token} (${t.value}) — ${t.usage}`).join('\n')}\n\nStates:\n${(states || []).join('\n')}`,
      }
    },
  },

  uxcopy: {
    prompt: ({ context, elementType, tone }) => `
UX Copy.

UI element type: ${elementType || 'Error message'}
${context ? `Context: ${context}` : ''}
Tone: ${tone || 'Clear and direct'}

Return JSON:
{
  "variants": [
    {"label": "variant name", "text": "the copy", "note": "why this phrasing works"}
  ],
  "voiceCheck": "one paragraph — what all variants have in common voice-wise",
  "pattern": "one paragraph — the reusable formula for writing this copy type"
}
Write 3-4 variants. No "Sorry", "Unfortunately", "Please", "Invalid". Start with the field name or the action.`,
    output: ({ context, elementType }, { variants, voiceCheck, pattern }) => ({
      skill: 'UX Copy',
      skillColor: 'var(--orange)',
      icon: '✍️',
      title: `UX Copy — ${elementType || context || 'UI Element'}`,
      sections: [
        { label: 'Copy variants', type: 'copy-variants', items: variants || [] },
        { label: 'Voice check', type: 'callout', text: voiceCheck || '' },
        { label: 'Pattern', type: 'body', text: pattern || '' },
      ],
      copyText: `UX Copy — ${elementType || ''}\n\n${(variants || []).map(v => `${v.label}: "${v.text}"`).join('\n')}\n\nPattern: ${pattern || ''}`,
    }),
  },

  system: {
    prompt: ({ context, focusAreas }) => `
Design System Audit.

Components / elements: ${context || 'not specified'}
${focusAreas?.length ? `Focus areas: ${focusAreas.join(', ')}` : ''}

Return JSON:
{
  "issues": ["3-4 strings — each names a specific inconsistency or hardcoded value in one sentence"],
  "recommendation": "one paragraph — the highest-priority fix and why it unblocks everything else",
  "whatsWorking": "one paragraph — patterns that are consistent and should be preserved"
}`,
    output: ({ context }, { issues, recommendation, whatsWorking }) => ({
      skill: 'Design System',
      skillColor: 'var(--purple)',
      icon: '⬡',
      title: `System Audit — ${(context || 'Components').slice(0, 50)}`,
      sections: [
        { label: 'Inconsistencies found', type: 'bullets', items: issues || [] },
        { label: 'Priority recommendation', type: 'callout', text: recommendation || '' },
        { label: "What's consistent", type: 'body', text: whatsWorking || '' },
      ],
      copyText: `Design System Audit — ${context || ''}\n\nIssues:\n${(issues || []).map(i => `→ ${i}`).join('\n')}\n\nRecommendation: ${recommendation || ''}\n\nWhat's consistent: ${whatsWorking || ''}`,
    }),
  },

  brief: {
    prompt: ({ context, focusQuestion }) => `
PM Brief synthesis.

Input: ${context || 'not specified'}
${focusQuestion ? `Focus question: ${focusQuestion}` : ''}

Return JSON:
{
  "problem": "one paragraph — what is broken, who is affected, what the evidence is",
  "successCriteria": "one paragraph — what success looks like in measurable or observable terms",
  "openQuestions": ["3-4 strings — open questions that must be answered before this can be designed"]
}`,
    output: ({ context }, { problem, successCriteria, openQuestions }) => ({
      skill: 'PM Brief',
      skillColor: 'var(--teal)',
      icon: '📋',
      title: `Brief — ${(context || 'Feature').slice(0, 50)}`,
      sections: [
        { label: 'Problem', type: 'body', text: problem || '' },
        { label: 'Success criteria', type: 'callout', text: successCriteria || '' },
        { label: 'Open questions', type: 'bullets', items: openQuestions || [] },
      ],
      copyText: `PM Brief\n\nProblem: ${problem || ''}\n\nSuccess: ${successCriteria || ''}\n\nOpen questions:\n${(openQuestions || []).map(q => `→ ${q}`).join('\n')}`,
    }),
  },

  synthesis: {
    prompt: ({ context }) => `
Research Synthesis.

Research input: ${context || 'not specified'}

Return JSON:
{
  "themes": ["3-4 strings — each names a recurring theme and the evidence behind it in one sentence"],
  "topInsight": "one paragraph — the single most actionable insight and why it matters most",
  "recommendations": ["3 strings — specific design recommendations that follow directly from the research"]
}`,
    output: ({ context }, { themes, topInsight, recommendations }) => ({
      skill: 'Research Synthesis',
      skillColor: 'var(--red, #E85C4A)',
      icon: '🔬',
      title: `Synthesis — ${(context || 'Research').slice(0, 50)}`,
      sections: [
        { label: 'Recurring themes', type: 'bullets', items: themes || [] },
        { label: 'Top insight', type: 'callout', text: topInsight || '' },
        { label: 'Recommendations', type: 'bullets', items: recommendations || [] },
      ],
      copyText: `Research Synthesis\n\nThemes:\n${(themes || []).map(t => `→ ${t}`).join('\n')}\n\nTop insight: ${topInsight || ''}\n\nRecommendations:\n${(recommendations || []).map(r => `→ ${r}`).join('\n')}`,
    }),
  },
}

// ── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { skillId, input = {} } = req.body || {}
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' })
  if (!skillId) return res.status(400).json({ error: 'skillId required' })

  const spec = specs[skillId]
  if (!spec) return res.status(400).json({ error: `Unknown skill: ${skillId}` })

  const userPrompt = spec.prompt(input)

  let aiRes
  try {
    aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })
  } catch (e) {
    return res.status(500).json({ error: `Network error: ${e.message}` })
  }

  if (!aiRes.ok) {
    const err = await aiRes.json().catch(() => ({}))
    return res.status(500).json({ error: err.error?.message || `Anthropic API error ${aiRes.status}` })
  }

  const data = await aiRes.json()
  let text = data.content?.[0]?.text || ''

  // Strip any code fences the model might add despite instructions
  text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    return res.status(500).json({ error: 'Failed to parse AI response', raw: text.slice(0, 500) })
  }

  const output = spec.output(input, parsed)
  return res.status(200).json(output)
}
