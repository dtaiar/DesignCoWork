export const sampleCaptures = [
  {
    id: 1,
    type: 'Article',
    typeColor: 'var(--accent)',
    title: 'Design Tokens and Multi-Brand Design Systems',
    source: 'Smashing Magazine · Jun 20, 2026',
    points: [
      'Tokens work as a decision layer, not a naming convention — the architecture separates what a value means from where it\'s used',
      'Multi-brand systems need three tiers: global (primitives), semantic (decisions), and component-scoped (overrides)',
      'The migration path that works: replace hardcoded values first, establish semantic names second, never the other way',
    ],
    relevance: 'The Hedging Tool uses at least 14 hardcoded color values in the filter panel alone. The three-tier model gives you a migration order that doesn\'t break existing components mid-refactor.',
    chip: { label: 'Article', cls: 'chip-accent' },
    chip2: { label: 'Smashing Mag', cls: 'chip-neutral' },
    previewText: 'The article argues that design tokens aren\'t a naming convention problem — they\'re a decision-layer problem. The real tension is between what a token means and where it gets applied.',
    daysAgo: '2d',
  },
  {
    id: 2,
    type: 'Competitive',
    typeColor: 'var(--purple)',
    title: 'How Linear Redesigned Their Mobile App',
    source: 'Linear Blog · Jun 18, 2026',
    points: [
      'Reduced primary nav from 7 to 4 items by collapsing secondary views into context menus, not a deeper hierarchy',
      'Command palette as the primary navigation model replaced the sidebar — search intent replaces browse intent on mobile',
      'Swipe gestures handle state changes (done, cancel, reassign) that previously required three taps and a modal',
    ],
    relevance: 'The Customer Portal\'s mobile nav has the same problem Linear had: too many top-level items that don\'t survive thumb-reachability testing. The command palette pattern is worth prototyping for the portfolio section.',
    chip: { label: 'Competitive', cls: 'chip-purple' },
    chip2: { label: 'Linear Blog', cls: 'chip-neutral' },
    previewText: 'Linear cut their mobile nav from 7 items to 4, removed the sidebar entirely, and rebuilt around a command palette as the primary navigation model on mobile.',
    daysAgo: '4d',
  },
  {
    id: 3,
    type: 'Research',
    typeColor: 'var(--teal)',
    title: 'State of Accessibility 2026 Report',
    source: 'A11y Project · Jun 10, 2026',
    points: [
      '96.3% of homepages tested had detectable WCAG failures — same number as 2023, suggesting tooling adoption hasn\'t moved the needle',
      'The three most common failures are still low contrast text, missing alt text, and unlabeled form inputs',
      'Automated tools catch 30–40% of failures; the rest require manual testing with AT users',
    ],
    relevance: 'The Customer Portal hasn\'t had a manual AT audit. Automated checks pass, which means nothing about the 60–70% of issues those checks don\'t catch. This is a gap to flag before the next release.',
    chip: { label: 'Research', cls: 'chip-teal' },
    chip2: { label: 'A11y Project', cls: 'chip-neutral' },
    previewText: '96.3% of homepages have WCAG failures. Automated tools catch only 30–40% of them.',
    daysAgo: '12d',
  },
];

export const sampleOutputs = [
  {
    id: 1,
    skill: 'Design Critique',
    skillColor: 'var(--accent)',
    title: 'Hedging Tool — Filter Panel',
    preview: 'Three priority issues: filter chips don\'t communicate applied state, the "Reset" action is placed where users expect a confirm, and the panel lacks a loading state for slow queries.',
    age: '3 days ago',
    chipCls: 'chip-accent',
  },
  {
    id: 2,
    skill: 'Accessibility Review',
    skillColor: 'var(--green)',
    title: 'Customer Portal — Navigation',
    preview: 'Focus order breaks on the second nav level. Tab stops skip two interactive elements. Contrast ratio on disabled states is 2.1:1 — below the 3:1 minimum for large text.',
    age: '5 days ago',
    chipCls: 'chip-green',
  },
  {
    id: 3,
    skill: 'Dev Handoff',
    skillColor: 'var(--blue)',
    title: 'Date Range Picker Component',
    preview: 'Layout: 320px min-width, full-width on mobile. Tokens: uses surface-2 for calendar background, action-primary for selected range. Three interaction states: idle, selecting, confirmed.',
    age: '1 week ago',
    chipCls: 'chip-blue',
  },
  {
    id: 4,
    skill: 'UX Copy',
    skillColor: 'var(--orange)',
    title: 'Error Messages — Hedging Tool',
    preview: 'Rewrote 12 error messages. Main change: removed "Sorry, an error occurred" openers and replaced with what the user should do next. Validation errors now name the specific field and reason.',
    age: '2 weeks ago',
    chipCls: 'chip-orange',
  },
];

export const postAngles = [
  {
    label: 'Educational',
    text: `Most design token implementations fail at the semantic layer.

Not because naming is hard. Because teams skip the step where they decide what the token means before they decide what it's called.

A color called blue-500 is a primitive. A color called action-primary is a decision.

The difference matters when you're supporting multiple brands or themes. The primitive says nothing about intent — you can't swap it without auditing every usage. The semantic name tells the system what to replace and why.

Three tiers. In this order:
1. Global primitives (values with no opinion)
2. Semantic decisions (values with a job)
3. Component overrides (values scoped to a specific context)

Most teams do 1 and 3. They skip 2 and wonder why theming is hard.`,
  },
  {
    label: 'Opinion',
    text: `Design tokens are not a design system problem. They're a communication problem.

The reason most token migrations stall: the people naming tokens and the people using them have different mental models of what a token is for.

Designers think in components. Engineers think in values. Neither is wrong — they're working at different layers.

The token is the translation layer between those two worlds. If the translation is wrong, both sides pay the cost.

Getting this right isn't about better tooling. It's about sitting in a room with your engineers and agreeing on what "semantic" means in your context before you write a single token name.`,
  },
  {
    label: 'Story',
    text: `Last year I inherited a design system with 340 color values and zero semantic tokens.

Every component had hardcoded hex values. Every new feature added 3 more.

The migration took 4 months. Here's what worked:

Replace hardcoded values first. Don't name them yet — just find them and group them by usage pattern. You'll see 40 "grey" values collapse into 8.

Then name what the groups do, not what they look like. bg-disabled not grey-200.

Then map component scopes. Some tokens only make sense inside a specific component. That's fine.

We went from 340 values to 94. The product looks the same. The codebase doesn't.`,
  },
];

export const topics = [
  { emoji: '🎛', name: 'Progressive Disclosure', count: 12 },
  { emoji: '🎨', name: 'Design Tokens', count: 9 },
  { emoji: '📱', name: 'Mobile Navigation', count: 15 },
  { emoji: '⚠️', name: 'Error States', count: 8 },
  { emoji: '♿', name: 'Accessibility', count: 18 },
  { emoji: '✦', name: 'Design Critique', count: 11 },
];
