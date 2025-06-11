/**
 * Client Supabase typé avec les types étendus
 * Ce fichier fournit un client Supabase avec les types corrects pour toutes les tables
 */

import { createClient } from '@supabase/supabase-js'
import type { ExtendedDatabase } from './extended-types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client Supabase typé avec les types étendus
export const typedSupabase = createClient<ExtendedDatabase>(supabaseUrl, supabaseAnonKey)

// Export du client standard pour compatibilité
export { supabase } from './client'
