import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Returns null when env vars are absent — the app falls back to sample data
export const supabase = url && key ? createClient(url, key) : null
