<script setup lang="ts">
import { Instagram, Mail, Facebook } from 'lucide-vue-next';
</script>

<template>
  <footer class="flex justify-center gap-8 pt-8 border-t border-black/10">
    <a href="https://www.instagram.com/balilocalsmiletour?igsh=MWtzeXRuOWo5dXl1Ng==" target="_blank" rel="noopener noreferrer" class="p-2 hover:bg-black/5 rounded-full transition-colors">
      <Instagram class="w-6 h-6 text-black" :stroke-width="1.5" />
    </a>
    <a href="mailto:usersedangpusing@gmail.com" class="p-2 hover:bg-black/5 rounded-full transition-colors">
      <Mail class="w-6 h-6 text-black" :stroke-width="1.5" />
    </a>
    <a href="https://www.facebook.com/share/1BpEvXwBCk/" target="_blank" rel="noopener noreferrer" class="p-2 hover:bg-black/5 rounded-full transition-colors">
      <Facebook class="w-6 h-6 text-black" :stroke-width="1.5" />
    </a>
  </footer>
</template>