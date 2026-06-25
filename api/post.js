export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { capture, topic } = req.body || {}
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })

  const isCapture = !!capture
  const sourceText = isCapture
    ? `Title: ${capture.title}
Source: ${capture.source}
Three things that matter:
${(capture.points || []).map((p, i) => `${i + 1}. ${p}`).join('\n')}
Why it matters for my work:
${capture.relevance}`
    : `Topic: ${topic}`

  const system = `You are a LinkedIn ghostwriter for a Senior Product Designer. You write posts about design — UX, product design, accessibility, design systems, handoff — for a design and product audience.

VOICE RULES (hard constraints — never break these):
- Concrete nouns and verbs only. Never abstract evaluative vocabulary: delve, tapestry, pivotal, underscore, foster, testament, enhance, crucial, intricate, landscape, meticulous, vibrant, valuable, garner, bolstered, boasts, realm, harness, unlock, foundational, nuanced, comprehensive.
- No sycophantic openers or closers. Cut "Great question", "Hope this helps", "Excited to share".
- No editorializing tags: "It's important to note", "It's worth mentioning", "It should be emphasized".
- No vague attribution: "some experts say", "many designers believe". Name a source or drop the claim.
- No tailing -ing clauses claiming significance: "marking a pivotal moment in...". Strip them.
- No rule-of-three adjective lists: "innovative, transformative, and groundbreaking". Max two.
- No false ranges: "from intimate gatherings to global movements".
- No reflexive summaries or "In conclusion" on short pieces.
- No bulleted lists with bolded inline headers (**Term:** description). Use prose or plain bullets.
- Vary sentence length. Short sentences land harder. Then a longer one that earns its length.
- No em dashes where a comma works. Use them sparingly.
- Posts read like a designer talking to peers — direct, specific, no brand-account tone.

FORMAT RULES:
- No headers. Plain text only.
- Line breaks between paragraphs (2 newlines).
- 150–280 words per angle.
- End on a fact, a question, or a short punchy sentence — never an inspirational closer.`

  const userPrompt = isCapture
    ? `Write 3 LinkedIn post angles from this design reference. Return a JSON array with this exact shape:
[
  { "label": "Educational", "text": "..." },
  { "label": "Opinion", "text": "..." },
  { "label": "Observation", "text": "..." }
]

The angles must each take a different approach:
- Educational: teach one concrete thing the audience can apply. Structure around a specific mechanism or decision, not a vague principle.
- Opinion: take a position. Disagree with a common assumption or default practice. Explain why with a specific consequence, not a general claim.
- Observation: share what stood out and why it reframed something. Ground it in a specific detail from the reference, not a general reflection.

Reference:
${sourceText}

Return only the JSON array. No preamble.`
    : `Write a LinkedIn post about this design topic. Return a JSON object:
{ "label": "Draft", "text": "..." }

The post should teach one concrete, specific thing. Ground it in a real design decision or failure mode, not a general principle. End on a question or a short specific observation.

Topic: ${sourceText}

Return only the JSON object. No preamble.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        system,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Anthropic API error ${response.status}: ${err}`)
    }

    const data = await response.json()
    const raw = data.content?.[0]?.text?.trim() || ''

    // Strip markdown code fences if present
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    const parsed = JSON.parse(cleaned)
    const angles = Array.isArray(parsed) ? parsed : [parsed]

    return res.status(200).json({ angles })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
