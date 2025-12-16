<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

// --- CONFIGURACIÓN ---
const currentSlide = ref(0);
const currentStep = ref(0);

// Definimos pasos por diapositiva
// 0: Portada | 1: Problema | 2: Solución | 3: Stack | 4: Arquitectura | 5: Final
const stepsPerSlide = [0, 3, 2, 2, 2, 0];
const totalSlides = stepsPerSlide.length;

// --- UTILIDADES ---
const TRANSITION = "transition-all duration-700 ease-out";

const getStepClass = (stepTrigger) => {
  return currentStep.value >= stepTrigger
    ? 'opacity-100 translate-y-0 filter-none'
    : 'opacity-0 translate-y-8 blur-sm pointer-events-none';
};

// --- NAVEGACIÓN ---
const next = () => {
  const maxSteps = stepsPerSlide[currentSlide.value];
  if (currentStep.value < maxSteps) {
    currentStep.value++;
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

           <div :class="[TRANSITION, getStepClass(2)]" class="bg-gradient-to-br from-orange-600 to-red-700 p-8 rounded-3xl shadow-2xl hover:-translate-y-2 transition-transform duration-300 text-white relative overflow-hidden">
              <div class="absolute -right-4 -bottom-4 opacity-20 text-9xl">🦁</div>
              <h3 class="text-2xl font-bold mb-4 relative z-10">Compromiso</h3>
              <p class="text-orange-100 text-lg mb-6 relative z-10 leading-relaxed">
                Unha ferramenta pensada para a comunidade, non para o lucro.
              </p>
              <div class="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                100% Galego
              </div>
           </div>
        </div>
      </div>

      <div v-if="currentSlide === 3" class="w-full h-full flex flex-col justify-center px-16 max-w-7xl mx-auto">
        <h2 class="text-5xl font-bold text-white mb-16 text-center">Tecnoloxías Modernas</h2>

        <div class="grid grid-cols-2 gap-x-12 gap-y-12">
          
          <div :class="[TRANSITION, getStepClass(1)]" class="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800">
             <h3 class="text-xl font-bold text-orange-400 mb-6 flex items-center gap-2">🖥️ Frontend (Vercel)</h3>
             <div class="grid grid-cols-2 gap-4">
                <div class="bg-black/40 p-4 rounded-xl flex items-center gap-3">
                   <span class="text-3xl">🚀</span>
                   <div>
                      <div class="font-bold text-white">Astro</div>
                      <div class="text-xs text-gray-500">Rendemento (Islands)</div>
                   </div>
                </div>
                <div class="bg-black/40 p-4 rounded-xl flex items-center gap-3">
                   <span class="text-3xl">💚</span>
                   <div>
                      <div class="font-bold text-white">Vue.js</div>
                      <div class="text-xs text-gray-500">Reactividade</div>
                   </div>
                </div>
             </div>
          </div>

          <div :class="[TRANSITION, getStepClass(2)]" class="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800">
             <h3 class="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">⚙️ Backend (Render)</h3>
             <div class="grid grid-cols-2 gap-4">
                <div class="bg-black/40 p-4 rounded-xl flex items-center gap-3">
                   <span class="text-3xl">🐘</span>
                   <div>
                      <div class="font-bold text-white">PostgreSQL</div>
                      <div class="text-xs text-gray-500">Base de Datos</div>
                   </div>
                </div>
                <div class="bg-black/40 p-4 rounded-xl flex items-center gap-3">
                   <span class="text-3xl">⚡</span>
                   <div>
                      <div class="font-bold text-white">Supabase</div>
                      <div class="text-xs text-gray-500">Auth & Data</div>
                   </div>
                </div>
             </div>
          </div>

        </div>
        
        <div :class="['mt-12 text-center', TRANSITION, getStepClass(2)]">
           <p class="text-gray-500 font-mono text-sm bg-neutral-900 inline-block px-4 py-2 rounded-full border border-neutral-800">
             Despregamento continuo automatizado en Vercel e Render
           </p>
        </div>
      </div>

      <div v-if="currentSlide === 4" class="w-full h-full flex flex-col justify-center px-16 max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-white mb-12">Estrutura da Información</h2>
        
        <div class="relative h-[50vh] bg-neutral-900 rounded-3xl border border-neutral-800 p-8 overflow-hidden shadow-inner">
          
          <div :class="[TRANSITION, getStepClass(1)]" class="absolute top-10 left-20 w-56 bg-slate-800 rounded-lg border-2 border-blue-500 shadow-lg z-10">
            <div class="bg-slate-900 p-2 text-blue-400 font-bold text-sm border-b border-blue-500/50">users</div>
            <div class="p-3 text-xs font-mono text-gray-300 space-y-1">
              <div>PK uuid</div>
              <div>email</div>
              <div>nome</div>
            </div>
          </div>

          <div :class="[TRANSITION, getStepClass(1)]" class="absolute top-32 left-96 w-56 bg-slate-800 rounded-lg border-2 border-orange-500 shadow-lg z-10">
            <div class="bg-slate-900 p-2 text-orange-400 font-bold text-sm border-b border-orange-500/50">plans</div>
            <div class="p-3 text-xs font-mono text-gray-300 space-y-1">
              <div>PK uuid</div>
              <div class="text-blue-300">FK user_id</div>
              <div>nome</div>
              <div>tipo (custom/predef)</div>
            </div>
          </div>

          <div :class="[TRANSITION, getStepClass(2)]" class="absolute bottom-10 right-20 w-64 bg-slate-800 rounded-lg border-l-4 border-green-500 p-4 shadow-lg">
             <div class="text-green-400 font-bold mb-2 text-sm">Estrutura Xerárquica</div>
             <div class="text-xs text-gray-400 space-y-2">
                <p>Plan ➔ Días ➔ Exercicios</p>
                <p>Sesión ➔ Series (Reps/Kg)</p>
             </div>
          </div>

          <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-30">
            <line x1="260" y1="80" x2="384" y2="160" stroke="white" stroke-width="2" />
          </svg>

        </div>
      </div>

      <div v-if="currentSlide === 5" class="w-full h-full flex flex-col items-center justify-center relative">
        <div class="absolute inset-0 bg-gradient-to-t from-orange-900/20 to-transparent"></div>
        
        <h2 class="text-6xl font-black text-white mb-8 relative z-10 text-center">
          Preparado para adestrar?
        </h2>
        
        <a 
          href="https://galentreno.vercel.app" 
          target="_blank"
          class="group relative px-10 py-5 bg-orange-600 text-white rounded-xl font-bold text-xl hover:bg-orange-500 transition-all hover:scale-105 flex items-center gap-3 z-10 shadow-[0_0_30px_rgba(234,88,12,0.4)]"
        >
          <span>⚡</span> ABRIR GALENTRENO
        </a>

        <div class="mt-24 text-center space-y-2 relative z-10">
           <p class="text-xl font-bold text-white">Ismael Lens</p>
           <p class="text-sm text-gray-500">Creative Commons BY-NC 4.0</p>
        </div>
      </div>

    </div>

    <div class="fixed bottom-6 right-6 flex items-center gap-4 bg-neutral-900/90 backdrop-blur px-4 py-2 rounded-full border border-neutral-800 z-50">
       <button @click.stop="prev" class="p-2 text-gray-400 hover:text-white transition">◀</button>
       <span class="font-mono text-sm text-gray-500">{{ currentSlide + 1 }} / {{ totalSlides }}</span>
       <button @click.stop="next" class="p-2 text-gray-400 hover:text-white transition">▶</button>
    </div>

  </div>
</template>