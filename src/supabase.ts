
import { createClient } from '@supabase/supabase-js';

// Sanitize inputs (remove quotes, trim whitespace)
const sanitize = (value: string | undefined) => {
  if (!value) return undefined;
  // Remove " or ' from start/end and trim
  return value.replace(/^["']|["']$/g, '').trim();
};

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = sanitize(rawUrl);
const supabaseAnonKey = sanitize(rawKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Key is missing or invalid. Stats tracking will not work.');
}

// Fallback to a syntactically valid URL if missing, to prevent crash on boot
const validUrl = (supabaseUrl && supabaseUrl.startsWith('http')) 
  ? supabaseUrl 
  : 'https://placeholder.supabase.co';

export const supabase = createClient(
  validUrl,
  supabaseAnonKey || 'placeholder'
);
