<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

// --- CONFIGURACIÓN ---
const currentSlide = ref(0);
const currentStep = ref(0);
const videoRef = ref(null);

// Pasos por diapositiva (Axustado aos elementos de cada slide)
// 0: Portada | 1: Problema (3 cards) | 2: Solución (2 grupos) | 3: Stack (3 bloques) | 4: Fluxo (3 pasos) | 5: Video
const stepsPerSlide = [0, 3, 2, 3, 3, 1];
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
    // Auto-play vídeo na slide final
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
    class="w-screen h-screen bg-neutral-950 text-gray-100 overflow-hidden relative selection:bg-orange-500/30 font-sans outline-none"
    @click="next"
  >
    
    <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(#404040 1px, transparent 1px); background-size: 30px 30px;"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950 pointer-events-none"></div>

    <div class="w-full h-full relative z-10">
      
      <div v-if="currentSlide === 0" class="w-full h-full flex flex-col items-center justify-center relative overflow-hidden animate-in fade-in zoom-in duration-1000">
        
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[100px] animate-pulse"></div>

        <div class="relative z-10 flex flex-col items-center text-center space-y-10">
          
          <div class="relative group hover:scale-105 transition-transform duration-500">
            <div class="absolute -inset-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div class="relative w-40 h-40 bg-neutral-900 rounded-full flex items-center justify-center border-2 border-orange-500/20 shadow-2xl">
              <span class="text-7xl">💪</span>
            </div>
          </div>

          <div class="space-y-4">
            <h1 class="text-8xl font-black tracking-tighter text-white drop-shadow-lg">
              GALENTRENO
            </h1>
            
            <div class="flex items-center justify-center gap-4">
              <div class="h-[2px] w-16 bg-orange-600"></div>
              <span class="text-orange-500 font-bold font-mono text-sm tracking-[0.3em] uppercase">DAW • TFC 2025</span>
              <div class="h-[2px] w-16 bg-orange-600"></div>
            </div>

            <h2 class="text-2xl text-gray-400 font-light max-w-xl mx-auto leading-relaxed pt-4">
              Toma o control da túa evolución física.<br>
              <span class="text-white font-bold">Gratis. Sen anuncios. En Galego.</span>
            </h2>
          </div>

          <div class="mt-16 bg-neutral-900/80 backdrop-blur border border-neutral-800 p-6 rounded-2xl flex items-center gap-5 hover:border-orange-500/50 transition-colors cursor-default shadow-lg">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xl font-bold text-white">
              IL
            </div>
            <div class="text-left">
              <p class="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">Creado por</p>
              <p class="text-xl text-white font-bold leading-none mb-1">Ismael Lens</p>
              <a href="https://www.linkedin.com/in/ismaellens/" target="_blank" class="text-gray-500 text-xs hover:text-white transition-colors">linkedin.com/in/ismaellens</a>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentSlide === 1" class="w-full h-full flex flex-col justify-center px-16 max-w-7xl mx-auto">
        <div class="mb-12 border-l-8 border-red-600 pl-6 animate-in slide-in-from-left duration-700">
          <span class="text-red-500 font-mono text-sm tracking-widest uppercase mb-2 block">O Mercado Actual</span>
          <h2 class="text-6xl font-black text-white">Barreiras para adestrar</h2>
        </div>

        <div class="grid grid-cols-2 gap-16 items-center">
          <div class="space-y-8 relative">
            
            <div :class="[TRANSITION, getStepClass(1)]" class="bg-neutral-900/50 p-6 rounded-2xl border-l-4 border-red-500 border-y border-r border-neutral-800 hover:bg-neutral-800 transition-colors">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-2xl font-bold text-white">💸 Custos Elevados</h3>
                <span class="text-3xl">💰</span>
              </div>
              <p class="text-gray-400">A maioría das apps completas requiren subscricións mensuais caras.</p>
            </div>

            <div :class="[TRANSITION, getStepClass(2)]" class="bg-neutral-900/50 p-6 rounded-2xl border-l-4 border-orange-500 border-y border-r border-neutral-800 hover:bg-neutral-800 transition-colors">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-2xl font-bold text-white">📢 Publicidade Intrusiva</h3>
                <span class="text-3xl">🚫</span>
              </div>
              <p class="text-gray-400">As versións "gratuítas" interrompen o adestramento con anuncios constantes.</p>
            </div>

            <div :class="[TRANSITION, getStepClass(3)]" class="bg-neutral-900/50 p-6 rounded-2xl border-l-4 border-yellow-500 border-y border-r border-neutral-800 hover:bg-neutral-800 transition-colors">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-2xl font-bold text-white">🇬🇧 Barreira Idiomática</h3>
                <span class="text-3xl">🗣️</span>
              </div>
              <p class="text-gray-400">Dificultade para atopar ferramentas de calidade na nosa lingua.</p>
            </div>
          </div>

          <div class="h-full flex items-center justify-center">
             <div :class="[TRANSITION, getStepClass(3)]" class="relative">
                <div class="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
                <div class="relative bg-neutral-900 p-8 rounded-3xl border border-neutral-700 shadow-2xl text-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
                   <div class="text-6xl mb-4">📉</div>
                   <h3 class="text-xl font-bold text-red-400">Experiencia Rota</h3>
                   <p class="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
                     O usuario acaba usando notas do móbil ou papel para evitar as apps comerciais.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div v-if="currentSlide === 2" class="w-full h-full flex flex-col justify-center px-16 max-w-7xl mx-auto">
        <div class="mb-12 border-l-8 border-orange-500 pl-6 animate-in slide-in-from-left">
          <span class="text-orange-400 font-mono text-sm tracking-widest uppercase mb-2 block">A Proposta</span>
          <h2 class="text-6xl font-black text-white">Software Libre e Accesible</h2>
        </div>

        <div class="grid grid-cols-3 gap-8">
           <div :class="[TRANSITION, getStepClass(1)]" class="bg-neutral-900 p-8 rounded-3xl border-t-4 border-orange-500 shadow-xl hover:-translate-y-2 transition-transform duration-300">
              <div class="text-4xl mb-6 bg-orange-900/20 w-fit p-4 rounded-2xl">📋</div>
              <h3 class="text-2xl font-bold text-white mb-3">Xestión de Plans</h3>
              <ul class="space-y-2 text-gray-400 text-sm">
                <li>• Plans predefinidos por expertos</li>
                <li>• Creación personalizada</li>
                <li>• Organizado por días e exercicios</li>
              </ul>
           </div>
           
           <div :class="[TRANSITION, getStepClass(1)]" class="bg-neutral-900 p-8 rounded-3xl border-t-4 border-orange-500 shadow-xl hover:-translate-y-2 transition-transform duration-300 delay-100">
              <div class="text-4xl mb-6 bg-orange-900/20 w-fit p-4 rounded-2xl">📈</div>
              <h3 class="text-2xl font-bold text-white mb-3">Progreso Real</h3>
              <ul class="space-y-2 text-gray-400 text-sm">
                <li>• Rexistro de series/reps/peso</li>
                <li>• Historial de evolución</li>
                <li>• Seguimento de peso corporal</li>
              </ul>
           </div>

           <div :class="[TRANSITION, getStepClass(2)]" class="bg-gradient-to-br from-orange-600 to-red-700 p-8 rounded-3xl shadow-2xl hover:-translate-y-2 transition-transform duration-300 text-white relative overflow-hidden flex flex-col justify-center">
              <div class="absolute -right-4 -bottom-4 opacity-20 text-9xl">🦁</div>
              <h3 class="text-2xl font-bold mb-4 relative z-10">Compromiso</h3>
              <p class="text-orange-100 text-lg mb-6 relative z-10 leading-relaxed">
                Unha ferramenta pensada para a comunidade, non para o lucro.
              </p>
              <div class="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide w-fit">
                100% Galego
              </div>
           </div>
        </div>
      </div>

      <div v-if="currentSlide === 3" class="w-full h-full flex flex-col justify-center px-16 max-w-7xl mx-auto">
        <h2 class="text-5xl font-bold text-white mb-12 text-center">Tecnoloxía Moderna</h2>

        <div class="grid grid-cols-4 grid-rows-2 gap-4 h-[50vh]">
          
          <div :class="[TRANSITION, getStepClass(1)]" class="col-span-2 row-span-2 bg-neutral-900 rounded-3xl border border-neutral-800 p-8 flex flex-col justify-between hover:border-orange-500/50 transition-colors group relative overflow-hidden">
            <div class="absolute top-0 right-0 p-8 opacity-10 text-9xl grayscale group-hover:grayscale-0 transition-all">🚀</div>
            <div class="relative z-10">
              <div class="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform text-orange-500">🚀</div>
              <h3 class="text-3xl font-bold text-white">Astro</h3>
              <p class="text-gray-400 mt-2">O núcleo da aplicación. Arquitectura de Illas para máximo rendemento.</p>
            </div>
            <div class="bg-black/50 p-4 rounded-xl font-mono text-xs text-orange-400 border border-orange-500/20 w-fit relative z-10">
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
          
          <div class="absolute top-1/2 left-0 w-full h-1 bg-neutral-800 -translate-y-1/2 z-0"></div>
          <div :class="['absolute top-1/2 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-600 -translate-y-1/2 z-0 transition-all duration-1000', currentStep >= 1 ? 'w-full' : 'w-0']"></div>

          <div :class="[TRANSITION, getStepClass(1)]" class="relative z-10 flex flex-col items-center gap-4">
             <div class="w-24 h-24 bg-neutral-900 border-2 border-neutral-700 rounded-full flex items-center justify-center text-4xl shadow-xl">👤</div>
             <p class="font-bold text-white">Usuario</p>
          </div>

          <div :class="[TRANSITION, getStepClass(2)]" class="relative z-10 flex flex-col items-center gap-4">
             <div class="w-24 h-24 bg-neutral-900 border-2 border-orange-500 rounded-2xl flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(249,115,22,0.3)]">📋</div>
             <div class="text-center">
               <p class="font-bold text-white">Plan</p>
               <p class="text-xs text-gray-500">Días / Exercicios</p>
             </div>
          </div>

          <div :class="[TRANSITION, getStepClass(3)]" class="relative z-10 flex flex-col items-center gap-4">
             <div class="w-24 h-24 bg-neutral-900 border-2 border-red-500 rounded-2xl flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(239,68,68,0.3)]">🔥</div>
             <div class="text-center">
               <p class="font-bold text-white">Sesión</p>
               <p class="text-xs text-gray-500">Inputs Reais</p>
             </div>
          </div>

           <div :class="[TRANSITION, getStepClass(3)]" class="relative z-10 flex flex-col items-center gap-4">
             <div class="w-24 h-24 bg-neutral-900 border-2 border-green-500 rounded-full flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(34,197,94,0.3)]">📊</div>
             <p class="font-bold text-white">Progreso</p>
          </div>
        </div>
        
        <div :class="['mt-20 text-center bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 mx-auto max-w-2xl font-mono text-sm text-gray-300', TRANSITION, getStepClass(2)]">
           <span class="text-red-400">const</span> <span class="text-orange-300">data</span> = <span class="text-white">await</span> supabase.from('plans').select('*');
        </div>
      </div>

      <div v-if="currentSlide === 5" class="w-full h-full flex flex-col items-center justify-center relative bg-black">
         
         <div v-if="currentStep === 0" class="text-center animate-in zoom-in duration-500">
            <h2 class="text-6xl font-black text-white mb-4">A Verdade</h2>
            <p class="text-2xl text-gray-400">Unha imaxe vale máis que mil palabras...</p>
            <p class="text-sm text-orange-500 mt-8 animate-pulse font-bold">Preme para ver a Demo</p>
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
                  
                  <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" v-if="!videoRef">
                    <p class="text-gray-500 mb-4">Garda o teu vídeo en /public/video/demo.mp4</p>
                    <a href="https://galentreno.vercel.app" target="_blank" class="px-6 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-500 transition pointer-events-auto">
                        Abrir Web
                    </a>
                  </div>
               </div>
            </div>
            
            <div class="absolute -bottom-4 left-0 w-full h-4 bg-[#2a2a2a] rounded-b-xl shadow-lg border-t border-[#444]"></div>
            <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-2 bg-[#111] rounded-b-lg"></div>

         </div>
      </div>

    </div>

    <div class="fixed bottom-6 right-6 flex items-center gap-4 bg-neutral-900/90 backdrop-blur px-6 py-3 rounded-full border border-neutral-700 z-50 shadow-xl">
       <button @click.stop="prev" class="text-gray-400 hover:text-white transition">◀</button>
       <span class="font-mono text-sm text-orange-500 font-bold">{{ currentSlide + 1 }} / {{ totalSlides }}</span>
       <button @click.stop="next" class="text-gray-400 hover:text-white transition">▶</button>
    </div>

  </div>
</template>