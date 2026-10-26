<script setup lang="ts">
import { onMounted, computed } from 'vue';
import PageHeader from './PageHeader.vue';
import WhatsAppButton from './WhatsAppButton.vue';
import SocialFooter from './SocialFooter.vue';
import ImageSlider from './ImageSlider.vue';
import TopNote from './TopNote.vue';
import { useDataSync } from './composables/useDataSync';
import { defaultFastBoatRoutes, type FastBoatRoute } from './fastBoatData';

const formatPrice = (price: string | number) => {
  if (!price) return 'Free'; // Atau '' jika ingin kosong
  
  // Cek apakah ini angka?
  const num = Number(price);
  
  // Jika hasilnya NaN (berarti isinya teks seperti "ask" atau "call us")
  if (isNaN(num)) {
    return price; // Tampilkan teks aslinya
  }
  
  // Jika angka, format jadi Rupiah
  return `IDR ${num.toLocaleString('id-ID')}`;
};


const {
  data,
  loading,
  error,
  initialize,
} = useDataSync<FastBoatRoute>({
  table: 'fast_boat',
  defaultData: defaultFastBoatRoutes,
});

const fastBoatRoutes = computed(() => data.value ?? []);

const errorMessage = computed(() => {
  if (!error.value) return '';
  if (typeof error.value === 'string') return error.value;
  return (error.value as any).message || 'Unknown error occurred';
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

    <div class="fixed inset-0 z-0 bg-white/00"></div>

    <div class="relative z-10">
      <PageHeader title="Fast Boat Ticketing" />

      <div class="max-w-[390px] mx-auto px-4 pb-12">
        <TopNote pageName="fast_boat" />
        <div v-if="loading" class="text-center py-8">
          <p class="text-gray-600">Loading fast boat routes...</p>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <div class="bg-red-50 p-4 rounded-xl border border-red-100">
            <p class="text-red-600 font-semibold mb-1">Error loading routes</p>
            <p class="text-xs text-red-500">{{ errorMessage }}</p>
          </div>
        </div>

        <div v-else-if="fastBoatRoutes.length" class="space-y-8">
          <div
            v-for="route in fastBoatRoutes"
            :key="route.id"
            class="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden p-6"
          >
            <ImageSlider :images="route.images || []" :alt="route.route" />

            <div class="mt-6">
              <h3 class="text-xl mb-2 font-serif">
                {{ route.route }}
              </h3>

              <p class="text-sm text-black/70 mb-2 font-sans">
                ⏱ Duration: {{ route.duration }}
              </p>

              <p class="text-sm text-black/70 mb-6 leading-relaxed font-sans">
                {{ route.description }}
              </p>

              <div class="bg-[#F7F7F7] rounded-2xl overflow-hidden mb-6">
                <div class="px-4 py-3 bg-black text-white">
                  <h4 class="text-xs font-semibold tracking-wide font-sans">
                    DEPARTURE SCHEDULE
                  </h4>
                </div>

                <div class="divide-y divide-black/5">
                  <div
                    v-for="(schedule, index) in route.schedules"
                    :key="index"
                    class="px-4 py-3 flex justify-between items-center"
                  >
                    <div>
                      <p class="text-base font-semibold mb-1 font-sans">
                        {{ schedule.time }}
                      </p>
                      <p class="text-xs text-black/60 font-sans">
                        {{ schedule.operator }}
                      </p>
                    </div>

                    <div class="text-right">
                      <p class="text-sm font-bold text-green-600">
                        {{ formatPrice(schedule.price) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <WhatsAppButton
                class="w-full justify-center"
                :message="`Hi! I'd like to book Fast Boat ticket for ${route.route}`"
                :item-name="route.route"
                category="Fast Boat"
                :price="route.schedules.find(schedule => schedule.price)?.price"
              />
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <p class="text-gray-600">No fast boat routes available.</p>
        </div>

        <div class="mt-12">
          <SocialFooter />
        </div>
      </div>
    </div>
  </div>
</template>