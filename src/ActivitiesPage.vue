<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PageHeader from './PageHeader.vue';
import WhatsAppButton from './WhatsAppButton.vue';
import SocialFooter from './SocialFooter.vue';
import ImageSlider from './ImageSlider.vue';
import TopNote from './TopNote.vue';
import { supabase } from './supabase';

interface Activity {
  id: number;
  title: string;
  price?: string;
  images: string[];
  description: string;
}

const activities = ref<Activity[]>([]);
const loading = ref(true);

const fetchActivities = async () => {
  try {
    loading.value = true;
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    if (data) activities.value = data;
  } catch (err) {
    console.error('Error fetching activities:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchActivities();
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
      <PageHeader title="Activities" />
      
      <div class="max-w-[390px] mx-auto px-4 pb-12">
        <TopNote pageName="activities" />
        <div v-if="loading" class="text-center py-12 text-gray-500">Loading activities...</div>
        
        <div v-else class="space-y-8">
          <div v-for="activity in activities" :key="activity.id" 
               class="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
            <div class="p-4">
              <ImageSlider :images="activity.images" :alt="activity.title" />
            </div>
            
            <div class="px-6 pb-6">
              <h3 class="text-lg mb-4 font-serif">{{ activity.title }}</h3>
              <p class="text-base font-semibold mb-3">{{ activity.price || 'Price on request' }}</p>
              <p class="text-sm text-black/70 mb-6 leading-relaxed font-sans whitespace-pre-line">
                {{ activity.description }}
              </p>
              
              <WhatsAppButton 
                :message="`Hi! I'm interested in ${activity.title} activity`"
                :item-name="activity.title"
                :price="activity.price"
                category="Activity"
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