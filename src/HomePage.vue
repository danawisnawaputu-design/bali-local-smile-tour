<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Car, MapPin, Waves, Ticket, Map } from 'lucide-vue-next';
import SocialFooter from './SocialFooter.vue';

const router = useRouter();

const menuItems = [
  { id: 'drop-pickup', title: 'DROP & PICKUP SERVICE', icon: Car },
  { id: 'tour', title: 'HALF DAY & FULLDAY TOUR', icon: MapPin },
  { id: 'activities', title: 'ACTIVITIES', icon: Waves },
  { id: 'fastboat', title: 'TICKETING FASTBOAT GILI & PENIDA', icon: Ticket },
  { id: 'nusa-penida', title: 'NUSA PENIDA PACKAGE TOUR', icon: Map },
];

const navigate = (page: string) => {
  const routeNames: { [key: string]: string } = {
    'drop-pickup': 'DropPickup',
    'tour': 'Tours',
    'activities': 'Activities',
    'fastboat': 'FastBoat',
    'nusa-penida': 'NusaPenida'
  };
  router.push({ name: routeNames[page] });
};
</script>

<template>
  <div class="flex justify-center items-center py-12 px-4">
    <div class="w-full max-w-[390px]">
      <header class="text-center mb-12">
        <div class="flex justify-center mb-6">
          <img 
            src="/logo.png" 
            alt="Logo Travel" 
            class="w-[200px] h-auto object-contain" 
          />
        </div>
        <h1 class="text-3xl mb-4 tracking-wide" style="font-family: 'Playfair Display', serif">
          balilocalsmiletour
        </h1>
        <p class="text-sm text-black/70 px-6 leading-relaxed" style="font-family: 'Poppins', sans-serif">
          Balilocalsmiletour – from bali for you, is accompany you on your bali vacation.
        </p>
      </header>

      <main class="space-y-5 mb-12">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="navigate(item.id)"
          class="w-full bg-white rounded-3xl px-6 py-6 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] active:scale-[0.98]"
        >
          <component :is="item.icon" class="w-6 h-6 text-black flex-shrink-0" :stroke-width="1.5" />
          <span class="text-xs font-medium tracking-wider text-left" style="font-family: 'Poppins', sans-serif">
            {{ item.title }}
          </span>
        </button>
      </main>

      <SocialFooter />
    </div>
  </div>
</template>