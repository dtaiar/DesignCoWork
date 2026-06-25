import { useState, useCallback } from 'react'

const KEY = 'dc_drafts'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
  catch { return [] }
}

function save(drafts) {
  try { localStorage.setItem(KEY, JSON.stringify(drafts)) } catch {}
}

export function useDrafts() {
  const [drafts, setDrafts] = useState(() => load())

  const addDraft = useCallback((text, source = '') => {
    const draft = { id: Date.now(), text, source, savedAt: new Date().toISOString() }
    setDrafts(prev => {
      const next = [draft, ...prev]
      save(next)
      return next
    })
    return draft
  }, [])

  const deleteDraft = useCallback((id) => {
    setDrafts(prev => {
      const next = prev.filter(d => d.id !== id)
      save(next)
      return next
    })
  }, [])

  return { drafts, addDraft, deleteDraft }
}
