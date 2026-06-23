// Generates realistic, structured output for each skill.
// Input is the form data object { context, stage, focusAreas, etc. }
// All copy follows writing-notes.md: concrete, specific, no fluff.

export function generateOutput(skillId, input = {}) {
  const generators = { critique, a11y, handoff, uxcopy, system, brief, synthesis }
  const gen = generators[skillId]
  return gen ? gen(input) : null
}

// ── Design Critique ──────────────────────────────────────────────────────────
function critique({ context = '', stage = 'Exploration', focusAreas = [] }) {
  const subject = context.trim() || 'the screen or component'
  const isExploration = stage === 'Exploration'
  const isFinal = stage === 'Final polish'

  return {
    skill: 'Design Critique',
    skillColor: 'var(--accent)',
    icon: '✦',
    title: subject.length > 60 ? subject.slice(0, 60) + '…' : subject,
    stage,
    sections: [
      {
        label: 'Priority issues',
        type: 'bullets',
        items: [
          isExploration
            ? 'The primary action isn\'t visually dominant — it competes with secondary controls at the same weight and size'
            : isFinal
            ? 'Touch targets on the action row measure 36px — below the 44px minimum for reliable mobile interaction'
            : 'State transitions aren\'t animated — the jump between idle and active is abrupt and feels unpolished',
          'Applied state isn\'t distinguishable from hover state — the only signal is a fill color change that doesn\'t survive the contrast check in light mode',
          'The empty state shows a generic message with no path forward — users who arrive here with no data have nowhere to go',
        ],
      },
      {
        label: 'Recommended fix order',
        type: 'callout',
        text: isExploration
          ? 'Establish hierarchy first — one action should visually dominate before refining anything else. Everything else is premature polish.'
          : 'Fix the state visibility gap before the touch targets. A user who can\'t tell what\'s selected can\'t use the interface regardless of tap size.',
      },
      {
        label: 'What\'s working',
        type: 'body',
        text: 'The layout grid is consistent and the typographic scale creates clear reading order. Labels are specific — no "click here" or "learn more" patterns.',
      },
    ],
    copyText: `Design Critique — ${subject}\nStage: ${stage}\n\nPriority issues:\n→ The primary action isn't visually dominant\n→ Applied state isn't distinguishable from hover state\n→ Empty state has no path forward\n\nFix order: Establish hierarchy first.\n\nWhat's working: Consistent layout grid, specific labels.`,
  }
}

// ── Accessibility Review ──────────────────────────────────────────────────────
function a11y({ context = '', componentType = 'Form' }) {
  const subject = context.trim() || 'the component'
  return {
    skill: 'Accessibility Review',
    skillColor: 'var(--green)',
    icon: '◎',
    title: `A11y — ${subject.length > 50 ? subject.slice(0, 50) + '…' : subject}`,
    sections: [
      {
        label: 'WCAG 2.1 AA — failures',
        type: 'issues',
        items: [
          { level: 'AA', criterion: '1.4.3 Contrast', status: 'fail', detail: 'Disabled state text measures 2.1:1 against the surface. Minimum for large text is 3:1.' },
          { level: 'A',  criterion: '4.1.2 Name, Role, Value', status: 'fail', detail: 'Interactive chips have no accessible name. Screen readers announce "button" with no label.' },
          { level: 'AA', criterion: '2.4.7 Focus Visible', status: 'fail', detail: 'Focus ring is suppressed on mouse interaction and not restored on keyboard — invisible to keyboard users.' },
        ],
      },
      {
        label: 'WCAG 2.1 AA — passing',
        type: 'issues',
        items: [
          { level: 'AA', criterion: '1.4.1 Use of Color', status: 'pass', detail: 'State changes use both color and iconography.' },
          { level: 'A',  criterion: '2.1.1 Keyboard', status: 'pass', detail: 'All interactive elements reachable via Tab.' },
        ],
      },
      {
        label: 'Recommended fix order',
        type: 'callout',
        text: 'Fix accessible names first — a chip with no label is unusable for AT users regardless of contrast or focus. Add aria-label to each chip using its visible text. Then fix focus visibility (one CSS rule). Contrast last — it\'s a design token change, not a component fix.',
      },
      {
        label: 'Manual testing needed',
        type: 'body',
        text: 'Automated checks caught 3 of an estimated 5–8 issues. Test with VoiceOver (iOS) and NVDA (Windows) to verify the reading order and announce behavior when state changes.',
      },
    ],
    copyText: `Accessibility Review — ${subject}\n\nFailures:\n✗ 1.4.3 Contrast (AA) — disabled text at 2.1:1\n✗ 4.1.2 Name, Role, Value (A) — chips have no accessible name\n✗ 2.4.7 Focus Visible (AA) — focus ring suppressed\n\nPassing: Color + icon for state, keyboard accessible.\n\nFix order: Accessible names → Focus → Contrast.`,
  }
}

// ── Dev Handoff ───────────────────────────────────────────────────────────────
function handoff({ componentName = '', context = '' }) {
  const name = componentName.trim() || 'Component'
  return {
    skill: 'Dev Handoff',
    skillColor: 'var(--blue)',
    icon: '⌥',
    title: `Handoff — ${name}`,
    sections: [
      {
        label: 'Layout',
        type: 'body',
        text: `Min-width: 320px. Full-width on mobile (<768px), max-width 480px on tablet+. Internal padding: 16px horizontal, 12px vertical. Gap between elements: 8px. Border-radius: 12px (container), 8px (inner elements).`,
      },
      {
        label: 'Design tokens',
        type: 'tokens',
        items: [
          { token: 'surface',        value: '#FFFFFF',  usage: 'Container background' },
          { token: 'surface-2',      value: '#EFEDE9',  usage: 'Input background, disabled states' },
          { token: 'border',         value: '#E3E1DC',  usage: 'Container stroke, dividers' },
          { token: 'action-primary', value: '#5B4BF4',  usage: 'Primary button, active state fill' },
          { token: 'text-1',         value: '#18171A',  usage: 'Body text, labels' },
          { token: 'text-2',         value: '#6B6A67',  usage: 'Supporting text, placeholders' },
        ],
      },
      {
        label: 'Interaction states',
        type: 'bullets',
        items: [
          'Default: surface background, border stroke at 1px',
          'Hover: border-color transitions to action-primary over 150ms',
          'Active/Selected: action-primary background at 10% opacity, border at action-primary',
          'Disabled: surface-2 background, text-3 color, no pointer events',
          'Loading: skeleton shimmer on content area, button shows spinner + disabled',
        ],
      },
      {
        label: 'A11y notes for dev',
        type: 'bullets',
        items: [
          'Add aria-label to each interactive element using its visible label text',
          'Focus ring: 2px solid action-primary, offset 2px — never suppress on keyboard navigation',
          'Announce state changes with aria-live="polite" on the status region',
        ],
      },
    ],
    copyText: `Dev Handoff — ${name}\n\nLayout: 320px min-width, full-width mobile, 16px h-padding.\n\nTokens: surface, surface-2, border, action-primary, text-1, text-2.\n\nStates: Default → Hover (border transition 150ms) → Active (10% fill) → Disabled → Loading.\n\nA11y: aria-label on all interactive elements, visible focus ring, aria-live for state changes.`,
  }
}

// ── UX Copy ───────────────────────────────────────────────────────────────────
function uxcopy({ elementType = 'Error message', context = '', tone = 'Clear and direct' }) {
  const ctx = context.trim() || 'the user interaction'
  const variants = {
    'Error message': [
      { label: 'Option A', text: 'Check the date — it needs to be today or later.', note: 'Names the field and the fix. No apology.' },
      { label: 'Option B', text: 'That date is in the past. Enter a future date to continue.', note: 'Slightly more explicit about why. Use if the error happens often.' },
      { label: 'Option C', text: 'Date can\'t be in the past.', note: 'Shortest. Works best inline next to the field.' },
    ],
    'CTA button': [
      { label: 'Option A', text: 'Save changes', note: 'Default. Clear, describes what happens.' },
      { label: 'Option B', text: 'Apply', note: 'Use when changes take effect immediately without navigation.' },
      { label: 'Option C', text: 'Confirm and continue', note: 'Use for destructive or irreversible actions.' },
    ],
    'Empty state': [
      { label: 'Option A', text: 'No positions yet\nAdd your first position to start tracking hedges.', note: 'States the fact, then offers the next step.' },
      { label: 'Option B', text: 'Nothing here yet\nPositions you create will appear here.', note: 'More neutral. Use if users arrive here through filters, not first use.' },
      { label: 'Option C', text: 'Start by adding a position', note: 'Direct CTA only — use when the empty state has a prominent button already.' },
    ],
    'Tooltip': [
      { label: 'Option A', text: 'The reference rate used to calculate your hedge ratio.', note: 'Defines the term. One sentence.' },
      { label: 'Option B', text: 'Used to calculate hedge ratio. Updates daily at 17:00 CET.', note: 'Adds operational detail — use if users ask "when does this update?"' },
    ],
    'Confirmation': [
      { label: 'Option A', text: 'Delete this position?\nThis removes all associated hedges. It can\'t be undone.', note: 'States what\'s deleted and that it\'s permanent.' },
      { label: 'Option B', text: 'Remove position\nAll hedges linked to this position will also be removed.', note: 'Softer verb. Use if "delete" feels too harsh for the product tone.' },
    ],
  }

  const options = variants[elementType] || variants['Error message']

  return {
    skill: 'UX Copy',
    skillColor: 'var(--orange)',
    icon: '◇',
    title: `UX Copy — ${elementType}`,
    sections: [
      {
        label: 'Copy variants',
        type: 'copy-variants',
        items: options,
      },
      {
        label: 'Voice check',
        type: 'callout',
        text: 'All options avoid: "Sorry", "Unfortunately", "Please note". They name the specific issue or action, not a generic state. Pick the shortest one that still answers "what happened" and "what do I do next".',
      },
    ],
    copyText: options.map(o => `${o.label}: "${o.text}"`).join('\n'),
  }
}

// ── Design System Audit ───────────────────────────────────────────────────────
function system({ context = '' }) {
  const subject = context.trim() || 'the components'
  return {
    skill: 'Design System Audit',
    skillColor: 'var(--purple)',
    icon: '⬡',
    title: `System Audit — ${subject.length > 45 ? subject.slice(0, 45) + '…' : subject}`,
    sections: [
      {
        label: 'Naming issues',
        type: 'bullets',
        items: [
          '"Grey-200" appears as both a background and a border color in different components — two different decisions using the same name',
          '"Button-primary" and "CTA-button" both exist and point to the same component with no documented distinction',
          'Size scale uses mixed conventions: "sm/md/lg" in buttons, "small/medium/large" in inputs, "S/M/L" in icons',
        ],
      },
      {
        label: 'Hardcoded values found',
        type: 'issues',
        items: [
          { level: 'high', criterion: '#3D2FE3', status: 'fail', detail: 'Used in 6 components. Should map to action-primary-dark token.' },
          { level: 'med',  criterion: '8px radius', status: 'fail', detail: 'Hardcoded in filter chips, tooltip, and tag components. Token exists: radius-sm.' },
          { level: 'low',  criterion: '500ms transition', status: 'fail', detail: 'One component uses 500ms where everything else uses 150ms. Likely a copy-paste leftover.' },
        ],
      },
      {
        label: 'Recommended fix order',
        type: 'callout',
        text: 'Fix the hardcoded color first — it\'s the most likely to cause a visual inconsistency in production. Standardize the size naming convention in one PR that touches all components. Don\'t rename tokens until the documentation is updated first.',
      },
      {
        label: 'Coverage',
        type: 'body',
        text: '14 of 21 components use design tokens consistently. 7 have at least one hardcoded value. Documentation exists for 9 components — 12 are undocumented.',
      },
    ],
    copyText: `Design System Audit\n\nNaming issues: 3 found\nHardcoded values: 3 found (#3D2FE3, 8px radius, 500ms transition)\nCoverage: 14/21 components use tokens consistently\n\nFix order: Hardcoded colors → Size naming convention → Token documentation.`,
  }
}

// ── PM Brief Intake ───────────────────────────────────────────────────────────
function brief({ context = '' }) {
  const hasBrief = context.trim().length > 0
  return {
    skill: 'PM Brief Intake',
    skillColor: 'var(--amber)',
    icon: '📋',
    title: hasBrief ? 'Brief analysis' : 'Brief analysis — example',
    sections: [
      {
        label: 'UX questions to ask before starting',
        type: 'bullets',
        items: [
          'What does the user do immediately after completing this action? The success state needs to route somewhere — is that defined?',
          'Is this a new flow or a replacement for an existing one? If replacement, what happens to users mid-way through the old flow?',
          'What\'s the mobile usage expectation? The brief mentions "all users" but doesn\'t specify device split.',
          'What\'s the definition of done for the PM? A live feature, or a signed-off design?',
        ],
      },
      {
        label: 'Scope gaps',
        type: 'bullets',
        items: [
          'Error states aren\'t mentioned — what happens if the action fails server-side?',
          'No mention of permissions — can all user roles access this, or is it gated?',
          'Loading/async behavior undefined — is this a synchronous action or does it queue?',
        ],
      },
      {
        label: 'Success criteria',
        type: 'callout',
        text: 'As written, the brief has no measurable success criteria. Suggest: "Task completion rate >85% on first attempt" and "No increase in support tickets related to [feature area]" as starting points to propose back to the PM.',
      },
    ],
    copyText: `PM Brief Analysis\n\nUX questions:\n→ Success state routing?\n→ Replacement or new flow?\n→ Mobile usage expectation?\n→ Definition of done?\n\nScope gaps:\n→ Error states\n→ Permissions/roles\n→ Loading/async behavior\n\nSuggested success criteria: Task completion >85%, no support ticket increase.`,
  }
}

// ── Research Synthesis ────────────────────────────────────────────────────────
function synthesis({ context = '', focusQuestion = '' }) {
  const hasResearch = context.trim().length > 0
  return {
    skill: 'Research Synthesis',
    skillColor: 'var(--teal)',
    icon: '◈',
    title: hasResearch ? 'Research synthesis' : 'Research synthesis — example',
    sections: [
      {
        label: 'Themes by frequency',
        type: 'issues',
        items: [
          { level: 'high', criterion: 'Filter confusion', status: 'pass', detail: 'Mentioned by 7 of 9 participants. Users don\'t know which filters are active or how to clear them.' },
          { level: 'high', criterion: 'Load time anxiety', status: 'pass', detail: '6 of 9 participants. No feedback between action and result causes users to repeat actions.' },
          { level: 'med',  criterion: 'Date input friction', status: 'pass', detail: '4 of 9. Calendar picker on mobile requires too many taps. Users prefer typing.' },
          { level: 'low',  criterion: 'Export confusion', status: 'pass', detail: '2 of 9. Users couldn\'t find the export option — it\'s buried in a secondary menu.' },
        ],
      },
      {
        label: 'Key insight',
        type: 'callout',
        text: 'Users aren\'t confused about what the product does — they\'re confused about what state they\'re in. Every high-frequency theme comes back to the same gap: the interface doesn\'t reflect the user\'s current context clearly enough to build confidence.',
      },
      {
        label: 'Recommended actions',
        type: 'bullets',
        items: [
          'Design a persistent "active filters" indicator that shows what\'s applied and allows one-tap removal',
          'Add skeleton loading to all data-fetching actions — remove the blank-page state',
          'Replace the date picker with a text input + smart parsing on mobile',
        ],
      },
    ],
    copyText: `Research Synthesis\n\nTop themes:\n1. Filter confusion (7/9 participants)\n2. Load time anxiety (6/9)\n3. Date input friction (4/9)\n4. Export confusion (2/9)\n\nKey insight: Users are confused about state, not about what the product does.\n\nActions: Persistent filter indicator, skeleton loading, text date input on mobile.`,
  }
}
