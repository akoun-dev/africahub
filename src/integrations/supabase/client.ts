// Configuration Supabase pour AfricaHub - Système de gestion des profils utilisateurs
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wgizdqaspwenhnbyuuro.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnaXpkcWFzcHdlbmhuYnl1dXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNzM5MzIsImV4cCI6MjA2NDc0OTkzMn0.plur-Q5wkkuoI6EC7-HU8sbpPRMouTMcM0Mc8bcNZWI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);