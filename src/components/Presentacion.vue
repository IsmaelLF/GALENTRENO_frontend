<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

// --- CONFIGURACIÓN E ESTADO ---
const currentSlide = ref(0);
const currentStep = ref(0);

// Definimos os pasos internos de cada diapositiva
// Slide 0: Portada (0 pasos)
// Slide 1: Contexto (3 pasos)
// Slide 2: Stack (2 pasos)
// Slide 3: Arquitectura (2 pasos)
// Slide 4: Demo (0 pasos)
const stepsPerSlide = [0, 3, 2, 2, 0];
const totalSlides = stepsPerSlide.length;

// --- UTILIDADES DE ESTILO (A maxia do teu amigo) ---
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

// Control por teclado
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
    class="w-screen h-screen bg-gray-950 text-gray-100 overflow-hidden relative selection:bg-blue-500/30 font-sans outline-none"
    @click="next"
  >
    
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

    <div class="w-full h-full relative z-10">
      
      <div v-if="currentSlide === 0" class="w-full h-full flex flex-col items-center justify-center relative overflow-hidden animate-in fade-in zoom-in duration-1000">
        <div class="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

        <div class="relative z-10 flex flex-col items-center text-center space-y-10">
          
          <div class="relative group animate-[bounce_4s_infinite]">
            <div class="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full blur-xl opacity-20 group-hover:opacity-50 transition duration-1000"></div>
            <div class="relative w-44 h-44 bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-700/50 shadow-2xl group-hover:scale-105 transition-transform duration-500 ring-1 ring-white/10">
              <span class="text-8xl drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">🏋️</span>
            </div>
          </div>

          <div class="space-y-4">
            <h1 class="text-9xl font-black tracking-tighter bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent drop-shadow-sm">
              GALENTRENO
            </h1>
            
            <div class="flex items-center justify-center gap-4">
              <div class="h-[1px] w-12 bg-gradient-to-r from-transparent to-blue-500"></div>
              <span class="text-blue-400 font-mono text-sm tracking-[0.3em] uppercase">V 1.0.0</span>
              <div class="h-[1px] w-12 bg-gradient-to-l from-transparent to-blue-500"></div>
            </div>

            <h2 class="text-2xl text-gray-400 font-light tracking-wide max-w-xl mx-auto leading-relaxed pt-2">
              A túa plataforma de adestramento <br>
              <span class="text-white font-medium">100% en Galego</span>
            </h2>
          </div>

          <div class="mt-12 group perspective-1000">
            <div class="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md p-px rounded-2xl overflow-hidden transition-transform duration-500 hover:rotate-x-12 hover:scale-105 shadow-2xl">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              <div class="relative bg-gray-950/90 rounded-2xl p-6 min-w-[320px] flex items-center gap-5">
                <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
                  EU
                </div>
                <div class="text-left">
                  <p class="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Full Stack Developer</p>
                  <p class="text-2xl text-white font-bold leading-none mb-1">O teu Nome</p>
                  <p class="text-gray-500 text-xs font-mono">DAW • TFC 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentSlide === 1" class="w-full h-full flex flex-col justify-center px-16 max-w-7xl mx-auto">
        <div class="mb-12 pl-6 border-l-8 border-red-500 animate-in slide-in-from-left duration-700">
          <span class="text-red-400 font-mono text-sm tracking-widest uppercase mb-2 block">Situación Actual</span>
          <h2 class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            O caos do adestrador
          </h2>
        </div>

        <div class="grid grid-cols-12 gap-16 items-center h-[60vh]">
          
          <div class="col-span-5 flex flex-col justify-center space-y-6 relative">
            <div :class="[TRANSITION, getStepClass(1)]" class="relative bg-red-950/10 backdrop-blur-sm p-8 rounded-2xl border border-red-900/30 overflow-hidden group hover:border-red-500/50 transition-colors">
              <div class="absolute top-0 right-0 p-4 opacity-10 text-9xl grayscale group-hover:grayscale-0 transition-all duration-500">📝</div>
              <div class="relative z-10">
                <h3 class="text-2xl text-red-400 mb-6 font-bold flex items-center gap-3">
                  <span class="bg-red-900/50 p-2 rounded-lg text-lg">⚠️</span> O Problema
                </h3>
                <ul class="space-y-4 text-red-100/80 text-lg">
                  <li class="flex gap-3 items-center"><span class="text-red-500 font-bold">✕</span> Excel e PDFs infinitos.</li>
                  <li class="flex gap-3 items-center"><span class="text-red-500 font-bold">✕</span> Datos dispersos por WhatsApp.</li>
                  <li class="flex gap-3 items-center"><span class="text-red-500 font-bold">✕</span> Falta de seguimento real.</li>
                </ul>
              </div>
            </div>

            <div :class="[TRANSITION, getStepClass(2)]" class="flex justify-center -my-3 z-20">
              <div class="bg-gray-800 p-2 rounded-full border border-gray-600 animate-bounce text-blue-400 text-xl shadow-lg">↓</div>
            </div>

            <div :class="[TRANSITION, getStepClass(2)]" class="relative bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-md p-8 rounded-2xl border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] hover:border-cyan-400/50 transition-all duration-500">
               <div class="absolute top-0 right-0 p-4 opacity-20 text-8xl rotate-12">🚀</div>
               <h3 class="text-2xl text-cyan-300 mb-4 font-bold flex items-center gap-3 relative z-10">
                 <span class="bg-cyan-900/50 p-2 rounded-lg text-lg text-cyan-200">✨</span> Galentreno
               </h3>
               <p class="text-cyan-50 text-lg relative z-10 leading-relaxed">
                 Centralización, automatización e análise de datos nunha única web app moderna.
               </p>
            </div>
          </div>

          <div class="col-span-7 h-full flex items-center perspective-1000">
            <div :class="[TRANSITION, getStepClass(3)]" class="relative w-full group transform transition-all duration-1000 hover:rotate-y-[-5deg] hover:scale-[1.02]">
              <div class="absolute -inset-4 bg-gradient-to-tr from-blue-600/30 via-purple-600/30 to-cyan-500/30 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-80 animate-pulse"></div>
              
              <div class="relative rounded-2xl overflow-hidden shadow-2xl border-[6px] border-gray-800 bg-gray-900 aspect-video flex items-center justify-center">
                <div class="absolute top-0 left-0 w-full h-8 bg-gray-800 flex items-center px-4 gap-2 z-20 opacity-90 border-b border-gray-700">
                  <div class="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div class="w-3 h-3 rounded-full bg-green-500/50"></div>
                  <div class="mx-auto bg-gray-900 px-4 py-0.5 rounded text-[10px] text-gray-500 font-mono">galentreno.gal</div>
                </div>
                
                <div class="text-center">
                  <span class="text-6xl animate-pulse">📊</span>
                  <p class="mt-4 text-gray-500 font-mono text-sm">Dashboard de Seguimento</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div v-if="currentSlide === 2" class="w-full h-full flex flex-col justify-center px-16 max-w-7xl mx-auto">
        <div class="flex items-end gap-4 mb-12 border-l-8 border-purple-500 pl-6 animate-in slide-in-from-left">
          <h2 class="text-5xl font-bold text-white">Stack Tecnolóxico</h2>
          <span class="text-gray-500 font-mono text-sm pb-2">/package.json</span>
        </div>

        <div class="grid grid-cols-2 gap-12">
          
          <div :class="[TRANSITION, getStepClass(1)]" class="space-y-6">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-2xl">💻</div>
              <h3 class="text-2xl font-bold text-blue-400">Cliente (Frontend)</h3>
            </div>
            
            <div class="grid gap-4">
              <div class="bg-gray-800/40 border border-gray-700 p-4 rounded-xl flex items-center gap-4 hover:bg-gray-800 transition-colors group">
                <div class="w-12 h-12 rounded-lg bg-orange-900/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🚀</div>
                <div class="flex-1">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-white text-lg">Astro</span>
                    <span class="text-[10px] font-mono bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded">Core</span>
                  </div>
                  <p class="text-gray-400 text-sm">Arquitectura de illas e rendemento.</p>
                </div>
              </div>

              <div class="bg-gray-800/40 border border-gray-700 p-4 rounded-xl flex items-center gap-4 hover:bg-gray-800 transition-colors group">
                <div class="w-12 h-12 rounded-lg bg-green-900/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">💚</div>
                <div class="flex-1">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-white text-lg">Vue.js</span>
                    <span class="text-[10px] font-mono bg-green-500/20 text-green-300 px-2 py-0.5 rounded">v3</span>
                  </div>
                  <p class="text-gray-400 text-sm">Reactividade e compoñentes interactivos.</p>
                </div>
              </div>

              <div class="bg-gray-800/40 border border-gray-700 p-4 rounded-xl flex items-center gap-4 hover:bg-gray-800 transition-colors group">
                <div class="w-12 h-12 rounded-lg bg-cyan-900/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🎨</div>
                <div class="flex-1">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-white text-lg">Tailwind CSS</span>
                  </div>
                  <p class="text-gray-400 text-sm">Estilizado rápido e responsive.</p>
                </div>
              </div>
            </div>
          </div>

          <div :class="[TRANSITION, getStepClass(2)]" class="space-y-6">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-500/10 rounded-lg border border-green-500/20 text-2xl">☁️</div>
              <h3 class="text-2xl font-bold text-green-400">Servidor (BaaS)</h3>
            </div>

            <div class="grid gap-4">
              <div class="bg-gray-800/40 border border-gray-700 p-4 rounded-xl flex items-center gap-4 hover:bg-gray-800 transition-colors group">
                <div class="w-12 h-12 rounded-lg bg-emerald-900/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">⚡</div>
                <div class="flex-1">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-white text-lg">Supabase</span>
                    <span class="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">PostgreSQL</span>
                  </div>
                  <p class="text-gray-400 text-sm">Base de datos, Auth e APIs instantáneas.</p>
                </div>
              </div>

              <div class="bg-gray-800/40 border border-gray-700 p-4 rounded-xl flex items-center gap-4 hover:bg-gray-800 transition-colors group">
                <div class="w-12 h-12 rounded-lg bg-yellow-900/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🔒</div>
                <div class="flex-1">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-white text-lg">Row Level Security</span>
                    <span class="text-[10px] font-mono bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">Seguridade</span>
                  </div>
                  <p class="text-gray-400 text-sm">Cada usuario só accede aos seus datos.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div v-if="currentSlide === 3" class="w-full h-full flex flex-col justify-center px-16 max-w-7xl mx-auto">
        <div class="flex justify-between items-end mb-2 border-b border-gray-700 pb-4 z-20 relative bg-gray-950/50 backdrop-blur-sm">
          <div>
            <h2 class="text-5xl font-bold text-white mb-2">Estrutura de Datos</h2>
            <p class="text-gray-400 font-mono text-sm">Esquema Relacional en PostgreSQL</p>
          </div>
        </div>

        <div class="relative h-[60vh] w-full mt-10">
          
          <div :class="['transition-all duration-700', currentStep >= 2 ? 'blur-sm opacity-40 scale-95' : 'opacity-100 scale-100']">
            
            <div :class="[TRANSITION, getStepClass(1)]" class="absolute top-1/2 left-20 -translate-y-1/2 w-64 bg-slate-800 rounded-xl border-2 border-blue-500/50 overflow-hidden shadow-2xl z-10">
              <div class="bg-slate-900/50 p-3 border-b border-blue-500/30 flex justify-between items-center">
                <span class="font-bold text-blue-400">users</span>
                <span class="text-[10px] bg-blue-900 text-blue-200 px-1.5 rounded">Auth</span>
              </div>
              <div class="p-4 space-y-2 font-mono text-xs text-slate-300">
                <div class="flex justify-between"><span>id</span><span class="text-slate-500">uuid</span></div>
                <div class="flex justify-between"><span>email</span><span class="text-slate-500">text</span></div>
              </div>
            </div>

            <div :class="[TRANSITION, getStepClass(1)]" class="absolute top-1/2 left-80 w-32 h-[1px] bg-gradient-to-r from-blue-500 to-gray-600 -translate-y-1/2 z-0"></div>

            <div :class="[TRANSITION, getStepClass(1)]" class="absolute top-[20%] left-[30rem] w-64 bg-slate-800 rounded-xl border border-gray-600 overflow-hidden shadow-xl hover:border-green-500 transition-colors">
              <div class="bg-slate-900/50 p-2 border-b border-gray-700 flex justify-between items-center">
                <span class="font-bold text-green-400 text-sm">plans</span>
                <span class="text-[10px] bg-gray-700 text-gray-300 px-1.5 rounded">Table</span>
              </div>
              <div class="p-3 space-y-1 font-mono text-[10px] text-slate-400">
                <div class="flex justify-between"><span>id</span><span class="text-slate-600">PK</span></div>
                <div class="flex justify-between text-blue-300 font-bold"><span>user_id</span><span>FK</span></div>
                <div class="flex justify-between"><span>nome</span><span>text</span></div>
                <div class="flex justify-between"><span>dias</span><span>jsonb</span></div>
              </div>
            </div>

          </div>

          <div :class="['absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl transform transition-all duration-700 z-20', currentStep >= 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none']">
            <div class="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-yellow-500/30">
              <div class="bg-[#252526] px-4 py-2 flex items-center justify-between border-b border-black">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-red-500"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div class="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span class="text-xs text-gray-400 font-mono">supabase/security.sql</span>
                <div class="text-xs text-yellow-500 font-bold flex items-center gap-1">🔒 RLS ACTIVE</div>
              </div>
              <div class="p-6 font-mono text-sm leading-relaxed text-gray-300">
                <p class="text-gray-500 italic mb-2">-- O backend seguro sen backend.</p>
                <div><span class="text-blue-400">create policy</span> "User can see own plans"</div>
                <div><span class="text-blue-400">on</span> <span class="text-green-400">public.plans</span></div>
                <div><span class="text-blue-400">for select using</span> (</div>
                <div class="pl-4 py-1 bg-yellow-500/10 border-l-2 border-yellow-500 my-1">
                  <span class="text-purple-400">auth.uid()</span> = <span class="text-green-400">user_id</span>
                </div>
                <div>);</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div v-if="currentSlide === 4" class="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
         
         <div class="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

         <div class="relative z-10 text-center space-y-12 animate-in zoom-in duration-500">
            <div class="inline-block animate-bounce mb-4">
               <span class="text-6xl filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">👀</span>
            </div>

            <h2 class="text-7xl font-black text-white tracking-tight">
               Menos teoría.
               <br />
               <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Máis Acción.</span>
            </h2>

            <p class="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
               Vexamos como <strong>Galentreno</strong> funciona nun entorno real.
            </p>

            <div class="pt-10">
               <button 
                  @click="() => window.location.href = '/'"
                  class="group relative px-12 py-6 bg-white text-black rounded-2xl font-black text-2xl hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:shadow-[0_0_80px_rgba(255,255,255,0.5)] flex items-center gap-4 mx-auto overflow-hidden"
               >
                  <span class="group-hover:rotate-12 transition-transform duration-300">⚡</span>
                  <span>IR Á APLICACIÓN</span>
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
               </button>
            </div>
         </div>
      </div>

    </div>

    <div class="absolute bottom-0 left-0 h-1.5 bg-gray-800 w-full z-40">
       <div 
         class="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
         :style="{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }"
       ></div>
    </div>

    <div class="fixed bottom-6 right-6 flex items-center gap-4 bg-gray-800/90 backdrop-blur px-4 py-2 rounded-full border border-gray-700 shadow-xl z-50" @click.stop>
       <button 
          @click="prev" 
          :disabled="currentSlide === 0 && currentStep === 0" 
          class="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white disabled:opacity-30 transition-all"
       >
          ◀
       </button>
       
       <span class="font-mono text-sm text-gray-300 min-w-[3rem] text-center font-bold">
          {{ currentSlide + 1 }} / {{ totalSlides }}
       </span>
       
       <button 
          @click="next" 
          :disabled="currentSlide === totalSlides - 1 && currentStep === stepsPerSlide[currentSlide]" 
          class="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white disabled:opacity-30 transition-all"
       >
          ▶
       </button>

       <div class="w-px h-6 bg-gray-600 mx-1"></div>

       <button 
          @click="toggleFullScreen"
          class="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-all"
       >
          ⛶
       </button>
    </div>

  </div>
</template>

<style scoped>
/* Animacións extra de Tailwind */
.perspective-1000 {
  perspective: 1000px;
}
</style>