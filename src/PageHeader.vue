<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';

defineProps<{
  title: string;
}>();

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<template>
  <header class="sticky top-0 z-50 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] px-4 py-4 mb-8">
    <div class="max-w-[390px] mx-auto flex items-center gap-4">
      <button
        @click="goBack"
        class="p-2 hover:bg-black/5 rounded-full transition-colors"
      >
        <ArrowLeft class="w-5 h-5 text-black" :stroke-width="1.5" />
      </button>
      <h1 class="text-lg font-medium tracking-wide flex-1" style="font-family: 'Playfair Display', serif">
        {{ title }}
      </h1>
    </div>
  </header>
</template>