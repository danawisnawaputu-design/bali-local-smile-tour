<script setup lang="ts">
import { onMounted } from 'vue';
import PageHeader from './PageHeader.vue';
import WhatsAppButton from './WhatsAppButton.vue';
import SocialFooter from './SocialFooter.vue';
import ImageSlider from './ImageSlider.vue';
import TopNote from './TopNote.vue';
import { useDataSync } from './composables/useDataSync';
import { defaultNusaPenidaPackages, type NusaPenidaPackage } from './nusaPenidaData';

const { data: packages, loading, error, initialize } = useDataSync<NusaPenidaPackage>({
  table: 'nusa_penida',
  defaultData: defaultNusaPenidaPackages
});

onMounted(() => {
  initialize();
});
</script>

<template>
  <div class="min-h-screen relative">

    <div 
      class="fixed inset-0 z-0"
      style="
        background-image: url('/background.jpg'); 
        background-size: cover; 
        background-position: center;
      "
    ></div>

    <div class="fixed inset-0 z-0 bg-white/0"></div>

    <div class="relative z-10">
      <PageHeader title="Nusa Penida Package Tours" />
      
      <div class="max-w-[390px] mx-auto px-4 pb-12">
        <TopNote pageName="nusa_penida" />
        <div v-if="loading" class="text-center py-8">
          <p class="text-gray-600">Loading packages...</p>
        </div>
        
        <div v-else-if="error" class="text-center py-8">
          <p class="text-red-600 mb-2">Error loading packages</p>
          <p class="text-sm text-gray-600">{{ error }}</p>
        </div>
        
        <div v-else-if="packages.length > 0" class="space-y-8">
          <div
            v-for="pkg in packages"
            :key="pkg.id"
            class="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden p-6"
          >
            <ImageSlider :images="pkg.images" :alt="pkg.name" />
            
            <div class="mt-6">
              <h3 class="text-xl mb-2" style="font-family: 'Playfair Display', serif">
                {{ pkg.name }}
              </h3>
              
              <div class="flex items-center gap-4 mb-6 text-sm" style="font-family: 'Poppins, sans-serif'">
                <span v-if="pkg.duration" class="text-black/70">⏱ {{ pkg.duration }}</span>
                <span class="font-semibold text-black">{{ pkg.price }}</span>
              </div>
              
              <div class="mb-6">
                <h4 class="text-sm font-semibold mb-3 tracking-wide" style="font-family: 'Poppins, sans-serif'">
                  ITINERARY
                </h4>
                <div class="bg-[#F7F7F7] rounded-2xl overflow-hidden">
                  <div
                    v-for="(item, index) in pkg.itinerary"
                    :key="index"
                    :class="[
                      'px-4 py-3 flex gap-4',
                      index !== pkg.itinerary.length - 1 ? 'border-b border-black/5' : ''
                    ]"
                  >
                    <span class="text-xs font-semibold min-w-[60px]" style="font-family: 'Poppins, sans-serif'">
                      {{ item.time }}
                    </span>
                    <span 
                      class="text-xs text-black/70 whitespace-pre-line leading-relaxed" 
                      style="font-family: 'Poppins, sans-serif'"
                    >
                      {{ item.activity }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="mb-6">
                <h4 class="text-sm font-semibold mb-3 tracking-wide" style="font-family: 'Poppins, sans-serif'">
                  FACILITIES INCLUDED
                </h4>
                <div class="grid grid-cols-2 gap-2">
                  <div
                    v-for="(facility, index) in pkg.facilities"
                    :key="index"
                    class="bg-[#F7F7F7] rounded-xl px-3 py-2 text-xs flex items-center gap-2"
                    style="font-family: 'Poppins, sans-serif'"
                  >
                    <span class="text-black">✓</span>
                    <span class="text-black/70">{{ facility }}</span>
                  </div>
                </div>
              </div>
              
              <WhatsAppButton
                :message="`Hi! I'd like to book ${pkg.name} (${pkg.price}${pkg.duration ? ' - ' + pkg.duration : ''})`"
                :item-name="pkg.name"
                category="Nusa Penida"
                :price="pkg.price"
                class="w-full justify-center"
              />
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8">
          <p class="text-gray-600">No packages available</p>
        </div>
        
        <div class="mt-12">
          <SocialFooter />
        </div>
      </div>
    </div>
  </div>
</template>