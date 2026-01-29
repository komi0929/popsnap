
import { supabase } from '../supabase';

export interface AppStats {
  id: number;
  total_visitors: number;
  total_snaps: number;
}

// Ensure we only count unique visitors per browser
const STORAGE_KEY = 'popsnap_visited';

export const incrementVisitor = async () => {
  if (typeof window === 'undefined') return;
  
  const hasVisited = localStorage.getItem(STORAGE_KEY);
  if (hasVisited) return;

  try {
    // Call Postgres function to atomic increment
    const { error } = await supabase.rpc('increment_visitors');
    if (!error) {
      localStorage.setItem(STORAGE_KEY, 'true');
    } else {
      console.warn('Stats error:', error.message);
    }
  } catch (e) {
    console.warn('Stats tracking failed', e);
  }
};

export const incrementSnap = async () => {
  try {
    // Call Postgres function to atomic increment
    const { error } = await supabase.rpc('increment_snaps');
    if (error) {
       console.warn('Stats error:', error.message);
    }
  } catch (e) {
    console.warn('Stats tracking failed', e);
  }
};

export const getStats = async (): Promise<AppStats | null> => {
  try {
    const { data, error } = await supabase
      .from('app_stats')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
    return data;
  } catch (e) {
    console.error('Error fetching stats:', e);
    return null;
  }
};
