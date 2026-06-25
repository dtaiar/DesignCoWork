/**
 * POST /api/enrich
 * Body: { url?, text?, inputType? }
 *
 * Fetches URL content (if provided), calls Claude Haiku, returns a structured
 * capture object in the shape useCaptures expects.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { url, text, inputType } = req.body || {}
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })

  let content = ''
  const sourceUrl = url || ''

  // ── Fetch URL content ────────────────────────────────────────────────────
  if (url && !text) {
    const isYouTube = /youtube\.com\/watch|youtu\.be\//.test(url)

    try {
      const resp = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(12000),
      })

      const html = await resp.text()

      // Pull key meta tags
      const title =
        (html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
         html.match(/<title[^>]*>([^<]+)<\/title>/i))?.[1] || ''
      const desc =
        (html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
         html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
         html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i))?.[1] || ''

      if (isYouTube) {
        content = `[YouTube video]\nTitle: ${title}\nDescription: ${desc}`
      } else {
        content = html
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<nav[\s\S]*?<\/nav>/gi, '')
          .replace(/<footer[\s\S]*?<\/footer>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\s{2,}/g, ' ')
          .trim()
          .slice(0, 12000)

        // Prepend meta to give the model a clean signal even on JS-heavy pages
        if (title || desc) {
          content = `Title: ${title}\nDescription: ${desc}\n\n---\n\n${content}`
        }
      }
    } catch (e) {
      return res.status(422).json({ error: `Could not fetch URL: ${e.message}` })
    }
  } else {
    content = text || ''
  }

  if (!content) return res.status(400).json({ error: 'No content to analyze' })

  // ── Call Gemini Flash (free tier) ───────────────────────────────────────
  const systemInstruction = `You are a design intelligence engine for Daniel Taiar, a senior product designer at AXPO (an energy company). He works on:
- Hedging Tool: a B2B web app for energy traders (position entry, portfolio view, counterparty management, complex filter panels, dense data tables)
- Customer Portal: an energy customer-facing web app (account management, consumption data, contract details, responsive)
- Cross-product design standards, branding, responsive design

Your job: analyze design references and produce a brief that connects to his actual work — not generic observations. The "why it matters for your work" paragraph must name a specific flow, UI pattern, or decision he deals with on either product. If there is no specific connection, connect it to a concrete design practice (named pattern, not an abstract principle).

Writing rules:
- Concrete nouns and verbs only. "The nav collapses secondary items behind a More tab" beats "the design demonstrates thoughtful hierarchy"
- No editorialising: no "it's important to note", "it's worth mentioning", "it's crucial"
- No triplet adjectives — one or two max
- No tailing "-ing" clauses claiming significance
- No closing summaries
- Each bullet = one specific, named insight`

  const prompt = `Analyze this design reference. Return ONLY a JSON object — no markdown fences, no other text.

URL: ${sourceUrl}
Input type: ${inputType || 'url'}

Content:
${content.slice(0, 10000)}

Required JSON shape:
{
  "type": "Article | Video | Competitive | Inspiration | Research | Design System",
  "title": "exact title of the piece — not a generic topic description",
  "source": "Publication Name · Mon YYYY",
  "points": [
    "insight #1 — names a specific pattern or decision, concrete noun + verb",
    "insight #2",
    "insight #3"
  ],
  "relevance": "1–2 sentences. Name the actual Hedging Tool or Customer Portal flow, component, or pattern this connects to. What would change in the design after reading this?",
  "typeColor": "var(--accent) for Article | #7c3aed for Video | #dc2626 for Competitive | #d97706 for Inspiration | #16a34a for Research | #0891b2 for Design System"
}`

  let enriched
  try {
    const gemini = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 900, temperature: 0.3 },
        }),
        signal: AbortSignal.timeout(30000),
      }
    )

    const data = await gemini.json()
    if (!gemini.ok) {
      return res.status(502).json({ error: data.error?.message || 'Gemini API error' })
    }

    const raw = (data.candidates?.[0]?.content?.parts?.[0]?.text || '')
      .replace(/^```json\n?/, '')
      .replace(/\n?```$/, '')
      .trim()

    enriched = JSON.parse(raw)
  } catch (e) {
    return res.status(502).json({ error: `Enrichment failed: ${e.message}` })
  }

  const type = enriched.type || 'Article'
  const source = enriched.source || ''
  const pubName = source.split('·')[0]?.trim() || 'Reference'

  return res.status(200).json({
    id: Date.now(),
    type,
    typeColor: enriched.typeColor || 'var(--accent)',
    title: enriched.title || 'Untitled',
    source,
    points: Array.isArray(enriched.points) ? enriched.points.slice(0, 3) : [],
    relevance: enriched.relevance || '',
    chip: { label: type, cls: 'chip-accent' },
    chip2: { label: pubName, cls: 'chip-neutral' },
    previewText: '',
    daysAgo: 'now',
  })
}
