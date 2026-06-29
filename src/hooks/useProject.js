import { useState, useCallback } from 'react'

const KEY = 'dc_project'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null') }
  catch { return null }
}

/**
 * Persists the active project context across sessions.
 * Shape: { name: string, description: string } | null
 */
export function useProject() {
  const [project, setProject] = useState(() => load())

  const setActiveProject = useCallback((p) => {
    setProject(p)
    try {
      if (p) localStorage.setItem(KEY, JSON.stringify(p))
      else localStorage.removeItem(KEY)
    } catch {}
  }, [])

  const clearProject = useCallback(() => setActiveProject(null), [setActiveProject])

  return { project, setActiveProject, clearProject }
}
