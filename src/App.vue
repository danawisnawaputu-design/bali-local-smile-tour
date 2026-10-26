<script setup lang="ts">
import { ref, onMounted, provide } from 'vue';
import { RouterView } from 'vue-router';

// Global error handling
const appError = ref<string | null>(null);
const isLoading = ref(false);

// Provide error handling to child components
provide('appError', appError);
provide('isLoading', isLoading);

// Handle uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  appError.value = 'An unexpected error occurred. Please refresh the page.';
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  appError.value = 'An unexpected error occurred. Please refresh the page.';
});

// Check if Supabase environment variables are set
onMounted(() => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Warning: Supabase environment variables not set. Data will use default values.');
  }
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen font-sans text-black">
    <!-- Global Error Alert -->
    <div
      v-if="appError"
      class="fixed top-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-md"
    >
      <div class="flex justify-between items-start gap-4">
        <p class="text-sm">{{ appError }}</p>
        <button
          @click="appError = null"
          class="text-xl font-bold leading-none hover:text-red-200"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Global Loading Indicator -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
        <p class="mt-4 text-center text-gray-700">Loading...</p>
      </div>
    </div>

    <!-- Main Router View -->
    <RouterView />
  </div>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>