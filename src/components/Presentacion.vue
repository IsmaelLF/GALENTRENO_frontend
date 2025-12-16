<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

// --- CONFIGURACIÓN ---
const currentSlide = ref(0);
const currentStep = ref(0);
const videoRef = ref(null);

// Pasos por diapositiva
// 0: Portada | 1: Problema | 2: Solución | 3: Stack | 4: Fluxo Datos | 5: Video Demo
const stepsPerSlide = [0, 2, 2, 3, 3, 1];
const totalSlides = stepsPerSlide.length;

// --- UTILIDADES ---
const TRANSITION = "transition-all duration-700 ease-out";

const getStepClass = (stepTrigger) => {
  return currentStep.value >= stepTrigger
    ? 'opacity-100 translate-y-0 blur-0 scale-100'
    : 'opacity-0 translate-y-8 blur-sm scale-95 pointer-events-none';
};

// --- NAVEGACIÓN ---
const next = () => {
  const maxSteps = stepsPerSlide[currentSlide.value];
  if (currentStep.value < maxSteps) {
    currentStep.value++;
    // Se entramos no paso 1 da slide final (demo), reproducimos vídeo
    if (currentSlide.value === 5 && currentStep.value === 1 && videoRef.value) {
      videoRef.value.play();
    }
  } else if (currentSlide.value < totalSlides - 1) {
    currentSlide.value++;
    currentStep.value = 0;
  }
};

const prev = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  } else if (currentSlide.value > 0) {
    currentSlide.value--;
    currentStep.value = stepsPerSlide[currentSlide.value];
  }
};

const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
};

const handleKey = (e) => {
  if (['ArrowRight', ' ', 'Enter'].includes(e.key)) {
    e.preventDefault();
    next();
  }
  if (['ArrowLeft'].includes(e.key)) {
    e.preventDefault();
    prev();
  }
  if (e.key === 'f') toggleFullScreen();
};

onMounted(() => window.addEventListener('keydown', handleKey));
onUnmounted(() => window.removeEventListener('keydown', handleKey));
</script>

<template>
  <div 
    class="w-screen h-screen bg-[#0a0a0a] text-gray-100 overflow-hidden relative selection:bg-cyan-500/30 font-sans outline-none"
    @click="next"
  >
    
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))]" pointer-events-none></div>
    <div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px); background-size: 40px 40px;"></div>

    <div class="w-full h-full relative z-10">
      
      <div v-if="currentSlide === 0" class="w-full h-full flex flex-col items-center justify-center relative animate-in fade-in duration-1000">
        
        <div class="relative z-10 text-center space-y-8">
          <div class="relative inline-block mb-4">
            <div class="absolute -inset-4 bg-cyan-500 blur-3xl opacity-20 animate-pulse"></div>
            <span class="relative text-8xl drop-shadow-2xl">⚡</span>
          </div>

          <h1 class="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-2">
            GALENTRENO
          </h1>
          
          <div class="flex items-center justify-center gap-6 text-sm font-mono text-cyan-500 tracking-widest uppercase">
            <span>Ismael Lens</span>
            <span class="w-1 h-1 bg-cyan-500 rounded-full"></span>
            <span>TFC DAW 2025</span>
          </div>

          <p class="text-xl text-gray-400 font-light max-w-xl mx-auto leading-relaxed pt-6">
            A revolución do fitness en <span class="text-white font-bold border-b-2 border-cyan-500">Galego</span>.
            <br>Software libre para adestramento real.
          </p>
        </div>
      </div>

      <div v-if="currentSlide === 1" class="w-full h-full flex flex-col justify-center px-16 max-w-7xl mx-auto">
        <h2 class="text-5xl font-bold text-white mb-16 flex items-center gap-4">
          <span class="w-2 h-12 bg-red-500 rounded-full block"></span>
          Por que Galentreno?
        </h2>

        <div class="grid grid-cols-2 gap-20 items-center">
          <div class="space-y-6">
            <div :class="[TRANSITION, getStepClass(1)]" class="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 hover:border-red-500/50 transition-colors group">
              <h3 class="text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">1. O mercado é hostil</h3>
              <p class="text-gray-400">Subscricións mensuais abusivas ou publicidade que interrompe as series.</p>
            </div>

            <div :class="[TRANSITION, getStepClass(2)]" class="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 hover:border-red-500/50 transition-colors group">
              <h3 class="text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">2. Non falamos o mesmo</h3>
              <p class="text-gray-400">Falta de ferramentas tecnolóxicas de calidade na nosa lingua.</p>
            </div>
          </div>

          <div class="relative h-64 flex items-center justify-center">
             <div :class="[TRANSITION, getStepClass(1)]" class="absolute w-40 h-40 bg-red-500/10 rounded-full blur-2xl"></div>
             <div :class="[TRANSITION, getStepClass(1)]" class="text-9xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700 cursor-default">🚫</div>
          </div>
        </div>
      </div>

      <div v-if="currentSlide === 2" class="w-full h-full flex flex-col justify-center px-16 max-w-7xl mx-auto">
        <h2 class="text-5xl font-bold text-white mb-16 flex items-center gap-4">
          <span class="w-2 h-12 bg-cyan-500 rounded-full block"></span>
          A Solución
        </h2>

        <div class="grid grid-cols-3 gap-6">
           <div :class="[TRANSITION, getStepClass(1)]" class="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1">
              <div class="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-2xl mb-6">📱</div>
              <h3 class="text-xl font-bold text-white mb-2">Web App</h3>
              <p class="text-sm text-gray-400">Accesible dende calquera móbil ou PC sen instalacións.</p>
           </div>
           
           <div :class="[TRANSITION, getStepClass(1)]" class="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1 delay-75">
              <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl mb-6">📈</div>
              <h3 class="text-xl font-bold text-white mb-2">Seguimento</h3>
              <p class="text-sm text-gray-400">Gráficas de peso e historial de volumes de carga.</p>
           </div>

           <div :class="[TRANSITION, getStepClass(2)]" class="col-span-1 bg-gradient-to-br from-cyan-600 to-blue-700 p-8 rounded-3xl shadow-lg hover:-translate-y-1 transition-transform flex flex-col justify-center relative overflow-hidden">
              <div class="absolute -right-4 -bottom-4 text-9xl opacity-20">🦁</div>
              <h3 class="text-2xl font-bold text-white mb-2 relative z-10">Software Libre</h3>
              <p class="text-cyan-100 relative z-10">Código aberto e en Galego.</p>
           </div>
        </div>
      </div>

      <div v-if="currentSlide === 3" class="w-full h-full flex flex-col justify-center px-16 max-w-7xl mx-auto">
        <h2 class="text-5xl font-bold text-white mb-12 text-center">Tecnoloxía Moderna</h2>

        <div class="grid grid-cols-4 grid-rows-2 gap-4 h-[50vh]">
          
          <div :class="[TRANSITION, getStepClass(1)]" class="col-span-2 row-span-2 bg-neutral-900 rounded-3xl border border-neutral-800 p-8 flex flex-col justify-between hover:border-orange-500/50 transition-colors group">
            <div>
              <div class="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">🚀</div>
              <h3 class="text-3xl font-bold text-white">Astro</h3>
              <p class="text-gray-400 mt-2">O núcleo da aplicación. Arquitectura de Illas para máximo rendemento.</p>
            </div>
            <div class="bg-black/50 p-4 rounded-xl font-mono text-xs text-orange-400 border border-orange-500/20">
              npm create astro@latest
            </div>
          </div>

          <div :class="[TRANSITION, getStepClass(2)]" class="col-span-2 bg-neutral-900 rounded-3xl border border-neutral-800 p-6 flex items-center gap-6 hover:border-green-500/50 transition-colors">
            <div class="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-4xl">💚</div>
            <div>
              <h3 class="text-2xl font-bold text-white">Vue.js</h3>
              <p class="text-sm text-gray-400">Compoñentes interactivos e xestión de estado.</p>
            </div>
          </div>

          <div :class="[TRANSITION, getStepClass(3)]" class="col-span-1 bg-neutral-900 rounded-3xl border border-neutral-800 p-6 flex flex-col justify-center hover:border-emerald-500/50 transition-colors">
            <div class="text-3xl mb-2">⚡</div>
            <h3 class="font-bold text-white">Supabase</h3>
            <p class="text-xs text-gray-400">Auth & DB</p>
          </div>

          <div :class="[TRANSITION, getStepClass(3)]" class="col-span-1 bg-neutral-900 rounded-3xl border border-neutral-800 p-6 flex flex-col justify-center hover:border-blue-500/50 transition-colors">
            <div class="text-3xl mb-2">🐘</div>
            <h3 class="font-bold text-white">PostgreSQL</h3>
            <p class="text-xs text-gray-400">Render.com</p>
          </div>

        </div>
      </div>

      <div v-if="currentSlide === 4" class="w-full h-full flex flex-col justify-center px-16 max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-white mb-16 text-center">Fluxo da Información</h2>
        
        <div class="relative flex items-center justify-between px-10">
          
          <div class="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 z-0"></div>
          <div :class="['absolute top-1/2 left-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 -translate-y-1/2 z-0 transition-all duration-1000', currentStep >= 1 ? 'w-full' : 'w-0']"></div>

          <div :class="[TRANSITION, getStepClass(1)]" class="relative z-10 flex flex-col items-center gap-4">
             <div class="w-24 h-24 bg-gray-900 border-2 border-gray-700 rounded-full flex items-center justify-center text-4xl shadow-xl">👤</div>
             <p class="font-bold text-white">Usuario</p>
          </div>

          <div :class="[TRANSITION, getStepClass(2)]" class="relative z-10 flex flex-col items-center gap-4">
             <div class="w-24 h-24 bg-gray-900 border-2 border-cyan-500 rounded-2xl flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(6,182,212,0.3)]">📋</div>
             <div class="text-center">
               <p class="font-bold text-white">Plan</p>
               <p class="text-xs text-gray-500">Días / Exercicios</p>
             </div>
          </div>

          <div :class="[TRANSITION, getStepClass(3)]" class="relative z-10 flex flex-col items-center gap-4">
             <div class="w-24 h-24 bg-gray-900 border-2 border-purple-500 rounded-2xl flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(168,85,247,0.3)]">🔥</div>
             <div class="text-center">
               <p class="font-bold text-white">Sesión</p>
               <p class="text-xs text-gray-500">Inputs Reais</p>
             </div>
          </div>

           <div :class="[TRANSITION, getStepClass(3)]" class="relative z-10 flex flex-col items-center gap-4">
             <div class="w-24 h-24 bg-gray-900 border-2 border-green-500 rounded-full flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(34,197,94,0.3)]">📊</div>
             <p class="font-bold text-white">Progreso</p>
          </div>

        </div>
        
        <div :class="['mt-20 text-center bg-gray-900/50 p-6 rounded-xl border border-gray-800 mx-auto max-w-2xl font-mono text-sm text-gray-300', TRANSITION, getStepClass(2)]">
           <span class="text-purple-400">const</span> <span class="text-cyan-300">data</span> = <span class="text-white">await</span> supabase.from('plans').select('*');
        </div>
      </div>

      <div v-if="currentSlide === 5" class="w-full h-full flex flex-col items-center justify-center relative bg-black">
         
         <div v-if="currentStep === 0" class="text-center animate-in zoom-in duration-500">
            <h2 class="text-6xl font-black text-white mb-4">A Verdade</h2>
            <p class="text-2xl text-gray-400">Unha imaxe vale máis que mil palabras...</p>
            <p class="text-sm text-gray-600 mt-8 animate-pulse">Preme para ver a Demo</p>
         </div>

         <div v-else class="relative w-[80%] max-w-5xl aspect-video animate-in slide-in-from-bottom duration-1000">
            
            <div class="absolute inset-0 bg-[#1a1a1a] rounded-t-2xl border-x-4 border-t-4 border-[#333] shadow-2xl overflow-hidden">
               <div class="w-full h-full bg-black relative">
                  <video 
                    ref="videoRef"
                    class="w-full h-full object-cover" 
                    src="/video/demo.mp4" 
                    controls
                    muted
                  >
                    O teu navegador non soporta video.
                  </video>
                  
                  <div class="absolute inset-0 flex items-center justify-center pointer-events-none" v-if="!videoRef">
                    <p class="text-gray-500">Garda o teu vídeo en /public/video/demo.mp4</p>
                  </div>
               </div>
            </div>
            
            <div class="absolute -bottom-4 left-0 w-full h-4 bg-[#2a2a2a] rounded-b-xl shadow-lg border-t border-[#444]"></div>
            <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-2 bg-[#111] rounded-b-lg"></div>

         </div>
      </div>

    </div>

    <div class="fixed bottom-6 right-6 flex items-center gap-4 bg-black/80 backdrop-blur px-6 py-3 rounded-full border border-white/10 z-50">
       <button @click.stop="prev" class="text-gray-400 hover:text-white transition">◀</button>
       <span class="font-mono text-sm text-cyan-500">{{ currentSlide + 1 }} / {{ totalSlides }}</span>
       <button @click.stop="next" class="text-gray-400 hover:text-white transition">▶</button>
    </div>

  </div>
</template>