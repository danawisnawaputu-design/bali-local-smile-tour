<script setup lang="ts">
// Tidak ada logic khusus, hanya render SVG
</script>

<template>
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="text-black"
  >
    <circle cx="40" cy="40" r="6" fill="currentColor" />
    
    <g class="opacity-90">
      <ellipse
        v-for="(angle, i) in [0, 45, 90, 135, 180, 225, 270, 315]"
        :key="`inner-${i}`"
        cx="40"
        cy="40"
        rx="3"
        ry="12"
        fill="currentColor"
        :transform="`rotate(${angle} 40 40)`"
      />
    </g>
    
    <g class="opacity-70">
      <ellipse
        v-for="(angle, i) in [0, 45, 90, 135, 180, 225, 270, 315]"
        :key="`outer-${i}`"
        cx="40"
        cy="40"
        rx="2.5"
        ry="20"
        fill="currentColor"
        :transform="`rotate(${angle} 40 40)`"
      />
    </g>
    
    <g class="opacity-50">
      <path d="M 15 10 Q 10 10 10 15" stroke="currentColor" fill="none" stroke-width="1.5" />
      <path d="M 65 10 Q 70 10 70 15" stroke="currentColor" fill="none" stroke-width="1.5" />
      
      <path d="M 15 70 Q 10 70 10 65" stroke="currentColor" fill="none" stroke-width="1.5" />
      <path d="M 65 70 Q 70 70 70 65" stroke="currentColor" fill="none" stroke-width="1.5" />
    </g>
    
    <circle cx="40" cy="40" r="28" stroke="currentColor" fill="none" stroke-width="1" opacity="0.3" />
  </svg>
</template>