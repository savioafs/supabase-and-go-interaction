import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('[Supabase Setup] URL defined:', !!supabaseUrl)
if (supabaseUrl) {
  console.log('[Supabase Setup] URL starts with:', supabaseUrl.substring(0, 8))
}

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 'CRITICAL: Supabase URL or Anon Key is missing. Check your Build Arguments in Easypanel!'
  console.error(errorMsg)
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
