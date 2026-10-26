// src/composables/useDataSync.ts
import { ref } from 'vue';
import { supabase } from '../supabase';

export function useDataSync<T>(options: {
  table: string;
  defaultData?: T[];
}) {
  const data = ref<T[]>(options.defaultData ?? []);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const initialize = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data: result, error: supabaseError } = await supabase
        .from(options.table)
        .select('*');

      if (supabaseError) throw supabaseError;

      data.value = result as T[];
    } catch (err: any) {
      error.value = err.message ?? 'Failed to load data';
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading,
    error,
    initialize,
  };
}
