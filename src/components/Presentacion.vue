<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import PhotoSlider from './PhotoSlider.vue'; // Asegúrate de importar el componente anterior

// --- ESTADO ---
const slideIndex = ref(0);
const stepIndex = ref(0);

// Configuración de las diapositivas (solo datos, no HTML)
const slidesConfig = [
  { id: 'portada', totalSteps: 0 },
  { id: 'problema', totalSteps: 2 },
  { id: 'stack', totalSteps: 2 },
  { id: 'retos', totalSteps: 1 }
];

// --- UTILIDADES ---
const TRANSITION = "transition-all duration-700 ease-out";

// Función para animar los pasos (equivalente a getStepClass)
const getStepClass = (stepTrigger) => {
  return stepIndex.value >= stepTrigger 
    ? 'opacity-100 translate-y-0 filter-none' 
    : 'opacity-0 translate-y-8 blur-sm pointer-events-none';
};

// --- CONTROLES DE TECLADO ---
const handleKeyDown = (e) => {
  const currentSlideConfig = slidesConfig[slideIndex.value];

  if (e.code === 'Space' || e.code === 'ArrowRight') {
    // Avanzar
    if (stepIndex.value < currentSlideConfig.totalSteps) {
      stepIndex.value++;
    } else if (slideIndex.value < slidesConfig.length - 1) {
      slideIndex.value++;
      stepIndex.value = 0;
    }
  } else if (e.code === 'ArrowLeft') {
    // Retroceder
    if (stepIndex.value > 0) {
      stepIndex.value--;
    } else if (slideIndex.value > 0) {
      slideIndex.value--;
      stepIndex.value = slidesConfig[slideIndex.value].totalSteps;
    }
  }
};

onMounted(() => window.addEventListener('keydown', handleKeyDown));
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown));
</script>

<template>
  <div class="w-screen h-screen bg-black text-white overflow-hidden font-sans selection:bg-orange-500/30">
    
    <div class="fixed top-0 left-0 h-1 bg-gray-800 w-full z-50">
      <div 
        class="h-full bg-orange-500 transition-all duration-500 ease-out"
        :style="{ width: `${(slideIndex / (slidesConfig.length - 1)) * 100}%` }"
      ></div>
    </div>

    <div class="fixed bottom-4 right-6 text-gray-600 font-mono text-xs z-50">
      {{ slideIndex + 1 }} / {{ slidesConfig.length }}
    </div>

    <div class="w-full h-full relative">

      <div v-if="slideIndex === 0" class="w-full h-full flex flex-col items-center justify-center relative animate-in fade-in duration-500">
        <div class="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

        <div class="relative z-10 text-center space-y-10">
          <div class="text-9xl animate-bounce">🏋️‍♂️</div>
          <div>
            <h1 class="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">Galentreno</h1>
            <p className="text-orange-400 font-mono tracking-[0.3em] uppercase mt-4">FCT DAW 2025</p>
          </div>
          <div class="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 inline-flex items-center gap-4">
             <div class="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center font-bold">IL</div>
             <div class="text-left">
               <p class="text-xs text-orange-400 font-bold uppercase">Desenvolvedor</p>
               <p class="font-bold">Ismael Lens</p>
             </div>
          </div>
        </div>
      </div>

      <div v-else-if="slideIndex === 1" class="w-full h-full flex flex-col justify-center px-16 max-w-7xl mx-auto animate-in fade-in slide-in-from-right duration-500">
        <h2 class="text-6xl font-black mb-10 pl-6 border-l-8 border-orange-500">
          <span class="text-gray-500 text-2xl block font-mono font-normal tracking-wider mb-2 uppercase">A Situación</span>
          Por que Galentreno?
        </h2>
        
        <div class="grid grid-cols-2 gap-12 h-[60vh]">
          <div :class="[TRANSITION, getStepClass(0)]" class="bg-red-900/10 border border-red-900/30 p-8 rounded-3xl flex flex-col justify-center">
             <h3 class="text-3xl text-red-400 font-bold mb-6">🚫 O Mercado Actual</h3>
             <ul class="space-y-4 text-xl text-gray-300">
               <li>💸 Apps de pago mensual</li>
               <li>📢 Publicidade intrusiva</li>
               <li>🇬🇧 Non están en galego</li>
             </ul>
          </div>

          <div :class="[TRANSITION, getStepClass(1)]" class="relative">
             <div class="absolute -top-4 -right-4 z-20 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">SOLUCIÓN</div>
             <div class="h-1/2 mb-4 rounded-3xl overflow-hidden border-4 border-gray-800 shadow-2xl">
                <PhotoSlider />
             </div>
             <div class="bg-green-900/10 border border-green-900/30 p-6 rounded-3xl h-[calc(50%-1rem)]">
                <h3 class="text-2xl text-green-400 font-bold mb-2">✅ Galentreno</h3>
                <p class="text-lg text-gray-300">Software libre, sen anuncios e na nosa lingua.</p>
             </div>
          </div>
        </div>
      </div>

      <div v-else-if="slideIndex === 2" class="w-full h-full flex flex-col justify-center px-16 max-w-7xl mx-auto animate-in fade-in slide-in-from-right duration-500">
         <div class="mb-12 border-l-8 border-purple-500 pl-6">
            <h2 class="text-5xl font-bold">Stack Tecnolóxico</h2>
            <span class="text-gray-500 font-mono">Moderno e Escalable</span>
         </div>

         <div class="grid grid-cols-2 gap-12">
            <div :class="[TRANSITION, getStepClass(1)]" class="space-y-6">
               <h3 class="text-2xl font-bold text-orange-400 flex items-center gap-2">🚀 Frontend <span class="text-sm bg-gray-800 text-gray-400 px-2 py-0.5 rounded ml-auto">Vercel</span></h3>
               
               <div class="bg-gray-800/40 border border-gray-700 p-4 rounded-xl flex items-center gap-4">
                  <div class="text-3xl">🚀</div>
                  <div><span class="font-bold block">Astro</span><span class="text-sm text-gray-400">Rendemento (Islands Architecture)</span></div>
               </div>
               <div class="bg-gray-800/40 border border-gray-700 p-4 rounded-xl flex items-center gap-4">
                  <div class="text-3xl">💚</div>
                  <div><span class="font-bold block">Vue.js</span><span class="text-sm text-gray-400">Compoñentes Reactivos</span></div>
               </div>
            </div>

            <div :class="[TRANSITION, getStepClass(2)]" class="space-y-6">
               <h3 class="text-2xl font-bold text-green-400 flex items-center gap-2">⚡ Backend <span class="text-sm bg-gray-800 text-gray-400 px-2 py-0.5 rounded ml-auto">Supabase</span></h3>
               
               <div class="bg-gray-800/40 border border-gray-700 p-4 rounded-xl flex items-center gap-4">
                  <div class="text-3xl">🐘</div>
                  <div><span class="font-bold block">PostgreSQL</span><span class="text-sm text-gray-400">Base de datos Relacional</span></div>
               </div>
               <div class="bg-gray-800/40 border border-gray-700 p-4 rounded-xl flex items-center gap-4">
                  <div class="text-3xl">🔒</div>
                  <div><span class="font-bold block">Auth & RLS</span><span class="text-sm text-gray-400">Seguridade Row-Level</span></div>
               </div>
            </div>
         </div>
      </div>

      <div v-else-if="slideIndex === 3" class="w-full h-full flex flex-col justify-center items-center text-center animate-in zoom-in duration-500">
         <h2 class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 mb-8">Grazas!</h2>
         
         <div :class="[TRANSITION, getStepClass(0)]" class="grid grid-cols-2 gap-6 mb-12 text-left w-full max-w-3xl">
            <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700">
               <div class="text-3xl mb-2">🧠</div>
               <h3 class="font-bold">Aprender Astro</h3>
               <p class="text-sm text-gray-400">Integración con Vue e SSR.</p>
            </div>
            <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700">
               <div class="text-3xl mb-2">☁️</div>
               <h3 class="font-bold">Despliegue</h3>
               <p class="text-sm text-gray-400">CI/CD en Vercel e Render.</p>
            </div>
         </div>

         <p class="text-xl text-gray-500">¿Preguntas?</p>
      </div>

    </div>
  </div>
</template>