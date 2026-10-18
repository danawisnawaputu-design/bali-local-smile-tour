<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router'; // Hapus useRouter karena tidak dipakai
import PageHeader from './PageHeader.vue';
import WhatsAppButton from './WhatsAppButton.vue';
import SocialFooter from './SocialFooter.vue';
import ImageSlider from './ImageSlider.vue';
import { supabase } from './supabase';
import TopNote from './TopNote.vue';

const route = useRoute();
// const router = useRouter(); <-- BARIS INI KITA HAPUS
const tourData = ref<any>(null);
const loading = ref(true);
let subscription: any = null;

// 1. Logika untuk membaca URL ?option=...
const getInitialOptionIndex = () => {
  const queryOption = route.query.option;
  if (queryOption !== undefined && queryOption !== null) {
    const idx = Number(queryOption);
    return isNaN(idx) ? 0 : idx; 
  }
  return 0; // Default ke Option 1
};

// State untuk opsi yang aktif
const selectedOptionIndex = ref(getInitialOptionIndex());

// 2. Watcher: Update tampilan jika URL berubah
watch(
  () => route.query.option,
  (newVal) => {
    if (newVal !== undefined) {
      selectedOptionIndex.value = Number(newVal);
    }
  },
  { immediate: true }
);

const normalizeFacilities = (raw: unknown): string[] => {
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {}

    let cleaned = trimmed;
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
      cleaned = cleaned.slice(1, -1);
    }

    return cleaned
      .split(',')
      .map((f) => f.replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '').trim())
      .filter((f) => f.length > 0);
  }
  return [];
};

const tourId = computed(() => {
  if (route.params.id) return route.params.id;
  try {
    if (route.query.tour && typeof route.query.tour === 'string') {
      return JSON.parse(route.query.tour).id;
    }
  } catch (e) {}
  return null;
});

// COMPUTED: Ambil data Opsi secara dinamis
const currentOption = computed(() => {
  if (!tourData.value || !tourData.value.options || tourData.value.options.length === 0) {
    return null;
  }
  const index = Math.min(selectedOptionIndex.value, tourData.value.options.length - 1);
  return tourData.value.options[index];
});

// COMPUTED: Ambil Places
const currentPlaces = computed(() => {
  return currentOption.value ? currentOption.value.places : [];
});

const fetchLatestTourData = async () => {
  if (!tourId.value) return;

  try {
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .eq('id', tourId.value)
      .single();

    if (error) throw error;

    if (data) {
      const parsedFacilities = normalizeFacilities(data.facilities);
      const parsedImages = typeof data.images === 'string' ? JSON.parse(data.images) : (data.images || []);
      const parsedOptions = typeof data.options === 'string' ? JSON.parse(data.options) : (data.options || []);

      tourData.value = {
        ...data,
        facilities: parsedFacilities,
        images: parsedImages,
        options: parsedOptions
      };
    }
  } catch (err) {
    console.error('Error load tour:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLatestTourData();

  if (tourId.value) {
    subscription = supabase
      .channel(`public:tours:id=eq.${tourId.value}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tours', filter: `id=eq.${tourId.value}` },
        () => fetchLatestTourData()
      )
      .subscribe();
  }
});

onUnmounted(() => {
  if (subscription) supabase.removeChannel(subscription);
});
</script>

<template>
  <div v-if="loading" class="min-h-screen">
    <PageHeader title="Loading..." />
    <div class="max-w-[390px] mx-auto px-4 py-12 text-center">
      <p class="text-gray-600 animate-pulse">Memuat data terbaru...</p>
    </div>
  </div>

<div v-else-if="tourData" class="min-h-screen relative">
    
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
      <PageHeader :title="tourData.title" />
      
      <div class="max-w-[390px] mx-auto px-4 pb-12">
        <TopNote pageName="tour_detail" />
        <div v-if="currentOption" class="bg-white/90 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-sm border border-white/50 animate-fade-in">
           <div class="flex justify-between items-start">
             <h3 class="font-bold text-lg text-gray-800">{{ currentOption.name }}</h3>
             <span class="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-lg border border-green-200">Selected Package</span>
           </div>
           <p v-if="currentOption.price" class="text-blue-600 font-bold text-md mt-1">{{ currentOption.price }}</p>
           <p v-if="currentOption.description" class="text-sm text-gray-600 mt-2">{{ currentOption.description }}</p>
        </div>

        <div v-if="currentPlaces && currentPlaces.length > 0" class="space-y-6 mb-8">
          <div v-for="(place, index) in currentPlaces" :key="index" class="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
            <div class="p-4">
              <h3 class="text-base font-semibold mb-2" style="font-family: 'Playfair Display', serif">
                {{ place.name }}
              </h3>
              <p class="text-sm text-black/70 leading-relaxed mb-4" style="font-family: 'Poppins', sans-serif">
                {{ place.description }}
              </p>
              <ImageSlider :images="place.images" :alt="place.name" />
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8 bg-white/80 rounded-xl mb-6">
          <p class="text-gray-500 text-sm">Belum ada detail tempat untuk opsi ini.</p>
        </div>

        <div v-if="tourData.facilities && tourData.facilities.length > 0" class="mb-8">
          <div class="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden p-6">
            <h3 class="text-lg font-bold mb-4 text-left text-gray-900" style="font-family: 'Playfair Display', serif">
              Facilities Include
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div 
                v-for="(facility, index) in tourData.facilities" 
                :key="index" 
                class="bg-[#F7F7F7] p-3 rounded-xl flex items-center gap-3"
              >
                <div class="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shrink-0 font-bold">✓</div>
                <span class="text-sm text-black/80 font-sans font-medium">{{ facility }}</span>
              </div>
            </div>

          </div>
        </div>

        <div class="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden p-6 mb-6">
          <WhatsAppButton
            :message="`Hi! I'd like to book ${tourData.title} - ${currentOption?.name || 'Package'} (${currentOption?.price || tourData.price || 'Ask for price'})`"
            :item-name="`${tourData.title} - ${currentOption?.name || 'Package'}`"
            category="Tour"
            :price="currentOption?.price || tourData.price"
            class="w-full justify-center"
          />
        </div>
        
        <div class="mt-12"><SocialFooter /></div>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen">
    <PageHeader title="Tour Detail" />
    <div class="max-w-[390px] mx-auto px-4 py-12 text-center">
      <p>Tour tidak ditemukan.</p>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>