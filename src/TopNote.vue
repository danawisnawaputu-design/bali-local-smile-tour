<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from './supabase'; // Sesuaikan path supabase

const props = defineProps<{
  pageName: string; // Kunci untuk mengambil data
}>();

const noteContent = ref('');
const isActive = ref(false);

const fetchNote = async () => {
  const { data } = await supabase
    .from('page_notes')
    .select('content, is_active')
    .eq('page_name', props.pageName)
    .single();

  if (data) {
    noteContent.value = data.content;
    isActive.value = data.is_active;
  }
};

onMounted(() => {
  fetchNote();
});
</script>

<template>
  <div v-if="isActive && noteContent" class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 shadow-sm">
    <div class="flex gap-3">
      <span class="text-xl">ℹ️</span> <div>
        <h4 class="font-bold text-sm text-yellow-800 mb-1">Important Info</h4>
        <p class="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
          {{ noteContent }}
        </p>
      </div>
    </div>
  </div>
</template>