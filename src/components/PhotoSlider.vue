<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

// Si tienes fotos reales impórtalas, si no, usa placeholders o quita este array
const photos = [
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80', // Ejemplo gym
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=800&q=80'
];

const currentIndex = ref(0);
let interval;

onMounted(() => {
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % photos.length;
  }, 3000);
});

onUnmounted(() => clearInterval(interval));
</script>

<template>
  <div class="relative w-full h-full overflow-hidden bg-gray-900 rounded-2xl">
    <div 
      v-for="(photo, index) in photos" 
      :key="index"
      class="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out"
      :class="index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'"
    >
      <img 
        :src="photo" 
        alt="Foto adestramento" 
        class="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" 
      />
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
    </div>
    
    <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
      <div 
        v-for="(_, idx) in photos" 
        :key="idx"
        class="h-1.5 rounded-full transition-all duration-500 shadow-sm"
        :class="idx === currentIndex ? 'bg-orange-500 w-6' : 'bg-white/40 w-1.5'"
      ></div>
    </div>
  </div>
</template>