import { useState, useCallback } from 'react'

const KEY = 'dc_outputs'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
  catch { return [] }
}

function save(outputs) {
  try { localStorage.setItem(KEY, JSON.stringify(outputs)) } catch {}
}

export function useOutputs() {
  const [outputs, setOutputs] = useState(() => load())

  const addOutput = useCallback((output) => {
    const entry = {
      ...output,
      id: Date.now(),
      savedAt: new Date().toISOString(),
    }
    setOutputs(prev => {
      const next = [entry, ...prev]
      save(next)
      return next
    })
    return entry
  }, [])

  const deleteOutput = useCallback((id) => {
    setOutputs(prev => {
      const next = prev.filter(o => o.id !== id)
      save(next)
      return next
    })
  }, [])

  return { outputs, addOutput, deleteOutput }
}
