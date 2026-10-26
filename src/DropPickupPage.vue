<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PageHeader from './PageHeader.vue';
import WhatsAppButton from './WhatsAppButton.vue';
import SocialFooter from './SocialFooter.vue';
import { supabase } from './supabase';
import { dropPickupData as defaultDropPickup } from './dropPickupData';
import TopNote from './TopNote.vue';

interface Transfer {
  destination: string;
  price: string;
}

interface DropPickupData {
  airportTransfers: Transfer[];
  ubudTransfers: Transfer[];
}

const data = ref<DropPickupData>(defaultDropPickup);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchDropPickup = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const { data: records, error: err } = await supabase
      .from('drop_pickup')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (err) {
        if (err.code === 'PGRST116') {
            console.warn('Data kosong di Supabase, menggunakan default.');
            data.value = defaultDropPickup;
            return;
        }
        throw err;
    }
    
    if (!records || !records.airport_transfers || !records.ubud_transfers) {
      data.value = defaultDropPickup;
    } else {
      data.value = {
        airportTransfers: typeof records.airport_transfers === 'string' 
          ? JSON.parse(records.airport_transfers) 
          : records.airport_transfers,
        ubudTransfers: typeof records.ubud_transfers === 'string' 
          ? JSON.parse(records.ubud_transfers) 
          : records.ubud_transfers
      };
    }
  } catch (err: any) {
    console.error('Error fetching drop pickup:', err);
    error.value = err.message;
    data.value = defaultDropPickup;
  } finally {
    loading.value = false;
  }
};

const setupRealtimeSubscription = () => {
  supabase
    .channel('public:drop_pickup')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'drop_pickup'
      },
      (payload: any) => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          const newData = payload.new;
          data.value = {
            airportTransfers: typeof newData.airport_transfers === 'string' 
              ? JSON.parse(newData.airport_transfers) 
              : newData.airport_transfers,
            ubudTransfers: typeof newData.ubud_transfers === 'string' 
              ? JSON.parse(newData.ubud_transfers) 
              : newData.ubud_transfers
          };
        }
      }
    )
    .subscribe();
};

onMounted(() => {
  fetchDropPickup();
  setupRealtimeSubscription();
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
      <PageHeader title="Drop & Pickup Service" />
      
      <div class="max-w-[390px] mx-auto px-4 pb-12">
        <TopNote pageName="drop_pickup" />
        <div v-if="loading" class="text-center py-8">
          <p class="text-gray-600">Loading transfers...</p>
        </div>
        
        <div v-else-if="error" class="text-center py-8">
          <p class="text-red-600 mb-2">Error loading transfers</p>
          <p class="text-sm text-gray-600">{{ error }}</p>
        </div>
        
        <div v-else>
          <section class="mb-10">
            <h2 class="text-xl mb-6 text-center" style="font-family: 'Playfair Display', serif">
              Airport Transfer Price List
            </h2>
            
            <div class="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
              <div class="grid grid-cols-3 gap-4 px-6 py-4 bg-black text-white text-xs font-medium" style="font-family: 'Poppins', sans-serif">
                <div>DESTINATION</div>
                <div class="text-center">PRICE</div>
                <div class="text-center">BOOK</div>
              </div>
              
              <div
                v-for="(transfer, index) in data.airportTransfers"
                :key="index"
                :class="[
                  'grid grid-cols-3 gap-4 px-6 py-4 items-center',
                  index !== data.airportTransfers.length - 1 ? 'border-b border-black/5' : ''
                ]"
              >
                <div class="text-sm font-medium" style="font-family: 'Poppins', sans-serif">
                  {{ transfer.destination }}
                </div>
                <div class="text-sm text-center" style="font-family: 'Poppins', sans-serif">
                  {{ transfer.price }}
                </div>
                <div class="flex justify-center">
                  <WhatsAppButton
                    :message="`Hi! I'd like to book Airport Transfer to ${transfer.destination} (${transfer.price})`"
                    :item-name="`Airport Transfer to ${transfer.destination}`"
                    category="Transport"
                    :price="transfer.price"
                    class="!px-4 !py-2 !text-xs"
                  />
                </div>
              </div>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-xl mb-6 text-center" style="font-family: 'Playfair Display', serif">
              Ubud Transfer Price List
            </h2>
            
            <div class="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
              <div class="grid grid-cols-3 gap-4 px-6 py-4 bg-black text-white text-xs font-medium" style="font-family: 'Poppins', sans-serif">
                <div>FROM/TO UBUD</div>
                <div class="text-center">PRICE</div>
                <div class="text-center">BOOK</div>
              </div>
              
              <div
                v-for="(transfer, index) in data.ubudTransfers"
                :key="index"
                :class="[
                  'grid grid-cols-3 gap-4 px-6 py-4 items-center',
                  index !== data.ubudTransfers.length - 1 ? 'border-b border-black/5' : ''
                ]"
              >
                <div class="text-sm font-medium" style="font-family: 'Poppins', sans-serif">
                  {{ transfer.destination }}
                </div>
                <div class="text-sm text-center" style="font-family: 'Poppins', sans-serif">
                  {{ transfer.price }}
                </div>
                <div class="flex justify-center">
                  <WhatsAppButton
                    :message="`Hi! I'd like to book Ubud Transfer to/from ${transfer.destination} (${transfer.price})`"
                    :item-name="`Ubud Transfer to/from ${transfer.destination}`"
                    category="Transport"
                    :price="transfer.price"
                    class="!px-4 !py-2 !text-xs"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>



        <SocialFooter />
      </div>
    </div>
  </div>
</template>