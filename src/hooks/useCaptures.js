import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { sampleCaptures } from '../data/captures'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatAge(isoStr) {
  if (!isoStr) return 'now'
  const ms = Date.now() - new Date(isoStr).getTime()
  const days = Math.floor(ms / 86_400_000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

/** Shape a DB row into the capture object the UI expects */
function fromDb(row) {
  return {
    id: row.id,
    type: row.type,
    typeColor: row.type_color || 'var(--accent)',
    title: row.title,
    source: row.source || '',
    points: Array.isArray(row.points) ? row.points : [],
    relevance: row.relevance || '',
    chip: row.chip || { label: row.type, cls: 'chip-accent' },
    chip2: row.chip2 || { label: 'Reference', cls: 'chip-neutral' },
    previewText: row.preview_text || '',
    daysAgo: formatAge(row.created_at),
  }
}

/** Shape a capture object into the DB insert payload */
function toDb(c) {
  return {
    type: c.type,
    type_color: c.typeColor,
    title: c.title,
    source: c.source || '',
    points: c.points || [],
    relevance: c.relevance || '',
    chip: c.chip,
    chip2: c.chip2,
    preview_text: c.previewText || '',
    status: 'done',
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Manages the captures list.
 * - If VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set, reads from and writes to Supabase.
 * - Otherwise, falls back to in-memory sample data (dev / no-config mode).
 */
export function useCaptures() {
  const [captures, setCaptures] = useState(sampleCaptures)

  // Load on mount
  useEffect(() => {
    if (!supabase) return
    supabase
      .from('design_captures')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) { console.error('[captures] fetch error:', error.message); return }
        // Keep sample data visible until the user adds their own captures
        setCaptures(data && data.length > 0 ? data.map(fromDb) : sampleCaptures)
      })
  }, [])

  // Subscribe to realtime inserts so new captures show up without a refresh
  useEffect(() => {
    if (!supabase) return
    const channel = supabase
      .channel('design-captures-insert')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'design_captures' }, payload => {
        setCaptures(prev => [fromDb(payload.new), ...prev])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const addCapture = useCallback(async (capture) => {
    // Optimistic update — show immediately
    setCaptures(prev => [capture, ...prev])

    if (!supabase) return

    const { data, error } = await supabase
      .from('design_captures')
      .insert(toDb(capture))
      .select()
      .single()

    if (error) {
      console.error('[captures] insert error:', error.message)
      return
    }
    // Replace the optimistic item with the persisted DB row (gets a real UUID + timestamp)
    setCaptures(prev => [fromDb(data), ...prev.slice(1)])
  }, [])

  return { captures, addCapture }
}
