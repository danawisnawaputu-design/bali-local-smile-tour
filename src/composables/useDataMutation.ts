import { ref } from 'vue'
import { supabase } from '../supabase'

export interface UpdateOptions {
  table: string
  id?: number
  data: any
  onSuccess?: () => void
  onError?: (error: any) => void
}

export function useDataMutation() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const insertData = async (table: string, data: any, onSuccess?: () => void) => {
    try {
      isLoading.value = true
      error.value = null

      const { error: err } = await supabase
        .from(table)
        .insert([data])

      if (err) throw err

      if (onSuccess) onSuccess()
      return true
    } catch (err: any) {
      error.value = err.message || `Failed to insert into ${table}`
      console.error(`Error inserting into ${table}:`, err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const updateData = async (table: string, id: number, data: any, onSuccess?: () => void) => {
    try {
      isLoading.value = true
      error.value = null

      const { error: err } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)

      if (err) throw err

      if (onSuccess) onSuccess()
      return true
    } catch (err: any) {
      error.value = err.message || `Failed to update ${table}`
      console.error(`Error updating ${table}:`, err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const deleteData = async (table: string, id: number, onSuccess?: () => void) => {
    try {
      isLoading.value = true
      error.value = null

      const { error: err } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (err) throw err

      if (onSuccess) onSuccess()
      return true
    } catch (err: any) {
      error.value = err.message || `Failed to delete from ${table}`
      console.error(`Error deleting from ${table}:`, err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const upsertData = async (table: string, data: any, onSuccess?: () => void) => {
    try {
      isLoading.value = true
      error.value = null

      const { error: err } = await supabase
        .from(table)
        .upsert([data], { onConflict: 'id' })

      if (err) throw err

      if (onSuccess) onSuccess()
      return true
    } catch (err: any) {
      error.value = err.message || `Failed to upsert into ${table}`
      console.error(`Error upserting into ${table}:`, err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    insertData,
    updateData,
    deleteData,
    upsertData
  }
}
