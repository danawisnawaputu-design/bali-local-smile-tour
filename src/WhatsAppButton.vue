<script setup lang="ts">
import { computed, ref } from 'vue';
import { ClipboardList } from 'lucide-vue-next';
import { supabase } from './supabase';

interface Props {
  message: string;
  itemName?: string;
  category?: string;
  price?: string | number;
  class?: string;
}

const props = defineProps<Props>();
const isSubmitting = ref(false);
const feedback = ref('');
const whatsappUrl = computed(() => {
  const message = props.message.trim();
  const price = props.price?.toString().trim();
  const messageWithPrice = price && !message.toLowerCase().includes(price.toLowerCase())
    ? `${message}\nPrice: ${price}`
    : message;

  return `https://wa.me/6281337549090?text=${encodeURIComponent(messageWithPrice)}`;
});

const parseAmount = (price?: string | number) => {
  if (typeof price === 'number') return price;
  if (!price) return 0;

  const normalized = price.toLowerCase().replace(/rp|idr/g, '').trim();
  const parsePriceValue = (value: string, unit = '') => {
    const numericText = value
      .replace(/[,.](?=\d{3}(?:[.,]|$))/g, '')
      .replace(',', '.');
    const amount = Number(numericText);
    if (!Number.isFinite(amount)) return 0;

    if (unit === 'juta' || unit === 'jt') return amount * 1_000_000;
    if (unit === 'k' || unit === 'ribu') return amount * 1_000;
    return amount;
  };

  const rangeMatch = normalized.match(/(\d[\d.,]*)\s*(juta|jt|k|ribu)?\s*[-–]\s*(\d[\d.,]*)\s*(juta|jt|k|ribu)?/);
  if (rangeMatch) {
    return parsePriceValue(rangeMatch[1], rangeMatch[2] || rangeMatch[4]);
  }

  const match = normalized.match(/(\d[\d.,]*)\s*(juta|jt|k|ribu)?/);
  if (!match) return 0;

  return parsePriceValue(match[1], match[2]);
};

const handleClick = async (event: MouseEvent) => {
  if (isSubmitting.value) {
    event.preventDefault();
    return;
  }
  isSubmitting.value = true;
  feedback.value = '';

  try {
    const { error } = await supabase.from('booking_orders').insert({
      item_name: props.itemName || props.message,
      category: props.category || 'Pesanan',
      price_text: props.price?.toString() || null,
      amount: parseAmount(props.price),
      message: props.message,
      status: 'pending'
    });

    if (error) throw error;
    feedback.value = 'Pesanan tercatat. Lanjutkan percakapan di WhatsApp.';
  } catch (error) {
    console.error('Gagal menyimpan pesanan:', error);
    feedback.value = 'WhatsApp sudah dibuka, tetapi pesanan gagal dicatat di sistem.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <a
    :href="whatsappUrl"
    target="_blank"
    rel="noopener noreferrer"
    @click="handleClick"
    :aria-disabled="isSubmitting"
    :class="[
      'bg-black text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-black/80 transition-all active:scale-95',
      isSubmitting ? 'opacity-60 cursor-wait' : '',
      props.class
    ]"
  >
    <ClipboardList class="w-4 h-4" />
    <span class="text-sm font-medium">{{ isSubmitting ? 'Membuka WhatsApp...' : 'Pesan Sekarang' }}</span>
  </a>
  <p v-if="feedback" role="status" aria-live="polite" class="mt-2 text-xs text-center text-gray-700">{{ feedback }}</p>
</template>