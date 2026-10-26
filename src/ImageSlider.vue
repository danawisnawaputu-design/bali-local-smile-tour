<script setup lang="ts">
import { ref } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

interface Props {
  images: string[];
  alt: string;
}

const props = defineProps<Props>();
const currentIndex = ref(0);

const goToPrevious = () => {
  currentIndex.value = currentIndex.value === 0 
    ? props.images.length - 1 
    : currentIndex.value - 1;
};

const goToNext = () => {
  currentIndex.value = currentIndex.value === props.images.length - 1 
    ? 0 
    : currentIndex.value + 1;
};


</script>

<template>
  <div v-if="images.length > 0" class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/5">
    <img
      :src="images[currentIndex]"
      :alt="`${alt} - ${currentIndex + 1}`"
      class="w-full h-full object-cover"
      @error="(e) => (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage Not Found%3C/text%3E%3C/svg%3E'"
    />
    
    <button
      v-if="images.length > 1"
      @click="goToPrevious"
      class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all active:scale-95"
    >
      <ChevronLeft class="w-4 h-4 text-black" :stroke-width="2" />
    </button>
    
    <button
      v-if="images.length > 1"
      @click="goToNext"
      class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all active:scale-95"
    >
      <ChevronRight class="w-4 h-4 text-black" :stroke-width="2" />
    </button>
    
    <div v-if="images.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
      <button
        v-for="(_, index) in images"
        :key="index"
        @click="currentIndex = index"
        :class="[
          'w-2 h-2 rounded-full transition-all',
          index === currentIndex 
            ? 'bg-white w-6' 
            : 'bg-white/60 hover:bg-white/80'
        ]"
      />
    </div>
  </div>
  <div v-else class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/10 flex items-center justify-center">
    <p class="text-sm text-black/50">No images available</p>
  </div>
</template>