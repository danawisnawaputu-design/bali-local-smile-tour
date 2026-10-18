<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PageHeader from './PageHeader.vue';
import WhatsAppButton from './WhatsAppButton.vue';
import SocialFooter from './SocialFooter.vue';
import ImageSlider from './ImageSlider.vue';
import { supabase } from './supabase';

const router = useRouter();

// --- DEFINISI TIPE DATA ---
interface Place {
  id?: number;
  name: string;
  description: string;
  images: string[];
}

interface TourOption {
  id?: number;
  name: string;
  description: string;
  price?: string; 
  places?: Place[];
}

interface Tour {
  id: number;
  title: string;
  duration: string;
  images: string[];
  options?: TourOption[];
  description?: string; 
  facilities?: string[];
}

// --- STATE DATA ---
const tourPackages = ref<Tour[]>([]);
const loading = ref(true);
const errorMsg = ref('');

// --- FUNGSI AMBIL DATA DARI SUPABASE ---
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

const fetchTours = async () => {
  try {
    loading.value = true;
    errorMsg.value = '';
    
    // Ambil data dari database (tetap urut ID dulu tidak apa-apa)
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    if (data) {
      // 1. Bersihkan data (mapping)
      const mappedTours = data.map(tour => {
        const parsedFacilities = normalizeFacilities(tour.facilities);
        return {
          ...tour,
          options: tour.options || [],
          images: tour.images || [],
          description: tour.description || '', 
          facilities: parsedFacilities
        };
      });

      // 2. LOGIKA BARU: Paksa "Half Day" ke Paling Atas
      tourPackages.value = mappedTours.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        
        // Cek apakah judul mengandung kata "half day"
        const isHalfDayA = titleA.includes('half day');
        const isHalfDayB = titleB.includes('half day');

        // Jika A adalah Half Day, pindahkan ke atas (sebelum B)
        if (isHalfDayA && !isHalfDayB) return -1;
        
        // Jika B adalah Half Day, pindahkan B ke atas (sebelum A)
        if (!isHalfDayA && isHalfDayB) return 1;
        
        // Jika sama-sama Half Day (atau sama-sama bukan), biarkan urut ID
        return 0;
      });
    }
  } catch (err: any) {
    console.error('Error fetching tours:', err);
    errorMsg.value = 'Gagal memuat data tour.';
  } finally {
    loading.value = false;
  }
};

// --- PERBAIKAN DISINI ---
// Kita ubah parameternya menerima index (angka)
const goToTourDetail = (tour: Tour, index: number) => {
  router.push({
    name: 'TourDetail',
    params: { id: tour.id },
    // INI KUNCINYA: Kita kirim sinyal 'option' ke URL
    query: { option: index } 
  });
};

onMounted(() => {
  fetchTours();
  
  // Realtime update
  supabase
    .channel('public:tours')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tours' }, () => {
      fetchTours();
    })
    .subscribe();
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
      <PageHeader title="Half & Full Day Tours" />
      
      <div class="max-w-[390px] mx-auto px-4 pb-12">
        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-500 animate-pulse">Loading tours...</p>
        </div>

        <div v-else class="space-y-8">
          <div
            v-for="tour in tourPackages"
            :key="tour.id"
            class="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden"
          >
            <div class="p-4">
              <ImageSlider :images="tour.images && tour.images.length ? tour.images : ['']" :alt="tour.title" />
            </div>
            
            <div class="px-6 pb-6">
              <h3 class="text-lg mb-2" style="font-family: 'Playfair Display', serif">
                {{ tour.title }}
              </h3>
              
              <div class="flex items-center gap-4 mb-4 text-sm text-black/70" style="font-family: 'Poppins', sans-serif">
                <span>⏱ {{ tour.duration }}</span>
              </div>

              <p v-if="tour.description" class="text-sm text-gray-600 mb-6 leading-relaxed font-sans whitespace-pre-line">
                {{ tour.description }}
              </p>
              
            <div v-if="tour.facilities && tour.facilities.length > 0" class="mb-6">
              <h4 class="text-sm font-semibold mb-3 tracking-wide" style="font-family: 'Poppins', sans-serif">
                FACILITIES INCLUDED
              </h4>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="(facility, idx) in tour.facilities" 
                  :key="idx" 
                  class="bg-[#F7F7F7] rounded-xl px-3 py-2 text-xs flex items-center gap-2"
                  style="font-family: 'Poppins', sans-serif"
                >
                  <span class="text-black font-bold">✓</span>
                  <span class="text-black/70">{{ facility }}</span>
                </div>
              </div>
            </div>

              <div v-if="tour.options && tour.options.length > 0" class="space-y-3 mb-6">
                <div 
                  v-for="(option, index) in tour.options" 
                  :key="index" 
                  @click="goToTourDetail(tour, index)"
                  class="bg-[#F7F7F7] rounded-2xl p-4 cursor-pointer hover:bg-[#EFEFEF] transition-colors active:scale-95"
                >
                  <div class="flex justify-between items-center mb-1">
                    <p class="text-xs font-semibold text-black" style="font-family: 'Poppins', sans-serif">
                      {{ option.name }}
                    </p>
                    <p class="text-xs font-bold text-black" style="font-family: 'Poppins', sans-serif">
                      {{ option.price || 'Ask Us' }}
                    </p>
                  </div>
                  <p class="text-[10px] text-black/70 leading-relaxed line-clamp-2" style="font-family: 'Poppins', sans-serif">
                    {{ option.description }}
                  </p>
                </div>
              </div>
              
              <WhatsAppButton
                :message="`Hi! I'd like to ask about ${tour.title} (${tour.duration})`"
                :item-name="tour.title"
                category="Tour"
                class="w-full justify-center"
              />
            </div>
          </div>
        </div>
        
        <div class="mt-12">
          <SocialFooter />
        </div>
      </div>
    </div>
  </div>
</template>