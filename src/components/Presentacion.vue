<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

// --- CONFIGURACIÓN E ESTADO ---
const currentSlide = ref(0);
const currentStep = ref(0);
// Referencias para os dous vídeos
const desktopVideoRef = ref(null);
const mobileVideoRef = ref(null);
const videoContainerRef = ref(null);

// Pasos por diapositiva:
// 0: Portada 
// 1: Problema (3 cards) 
// 2: Solución (2 grupos) 
// 3: Stack (4 pasos para o Bento Grid) 
// 4: Fluxo (3 pasos visuais) 
// 5: Melloras Futuras (3 pasos)
// 6: Video (Intro + Play Dual)
const stepsPerSlide = [0, 3, 2, 4, 3, 3, 1];
const totalSlides = stepsPerSlide.length;

// --- UTILIDADES VISUAIS ---
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
    
    // Auto-play para AMBOS vídeos na slide final
    if (currentSlide.value === 6 && currentStep.value === 1) {
      setTimeout(() => {
          if (desktopVideoRef.value) desktopVideoRef.value.play();
          if (mobileVideoRef.value) mobileVideoRef.value.play();
          // Scroll suave cara o contedor por se a pantalla é pequena
          if (videoContainerRef.value) videoContainerRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
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
                <h3 class="text-2xl font-bold text-white">💬 Barreira Idiomática</h3>
                <span class="text-3xl">🌐</span>
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
          <h2 class="text-6xl font-black text-white">Plataforma Gratuíta e Accesible</h2>
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
                Unha ferramenta pensada para a comunidade, baixo licenza CC BY-NC 4.0.
              </p>
              <div class="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide w-fit">
                100% Galego
              </div>
           </div>
        </div>
      </div>

      <div v-if="currentSlide === 3" class="w-full h-full flex flex-col justify-center px-16 max-w-7xl mx-auto">
        <h2 class="text-5xl font-bold text-white mb-12 text-center animate-in slide-in-from-top">Stack Tecnolóxico Completo</h2>

        <div class="grid grid-cols-4 grid-rows-3 gap-4 h-[65vh]">
          
          <div :class="[TRANSITION, getStepClass(1)]" class="col-span-2 row-span-2 bg-gradient-to-br from-neutral-900 to-orange-900/20 rounded-3xl border border-orange-500/20 p-8 flex flex-col justify-between hover:border-orange-500/60 hover:to-orange-900/40 transition-all group relative overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.1)] hover:shadow-[0_0_50px_rgba(249,115,22,0.3)]">
            <div class="absolute top-0 right-0 p-8 opacity-10 text-9xl grayscale group-hover:grayscale-0 transition-all text-orange-500">🚀</div>
            <div class="relative z-10">
              <div class="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform text-orange-500 shadow-inner">🚀</div>
              <h3 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-500">Astro</h3>
              <p class="text-gray-300 mt-4 text-lg">Arquitectura de Illas para un rendemento web extremo. O núcleo do frontend.</p>
            </div>
            <div class="bg-black/50 p-4 rounded-xl font-mono text-xs text-orange-400 border border-orange-500/20 w-fit relative z-10">
              npm create astro@latest
            </div>
          </div>

          <div :class="[TRANSITION, getStepClass(2)]" class="col-span-2 bg-gradient-to-br from-neutral-900 to-green-900/20 rounded-3xl border border-green-500/20 p-6 flex items-center gap-6 hover:border-green-500/60 hover:to-green-900/40 transition-all shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_40px_rgba(34,197,94,0.2)]">
            <div class="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center text-4xl text-green-500 shadow-inner">💚</div>
            <div>
              <h3 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-green-400">Vue.js</h3>
              <p class="text-sm text-gray-300">Compoñentes interactivos e reactividade.</p>
            </div>
          </div>

          <div :class="[TRANSITION, getStepClass(3)]" class="col-span-1 bg-gradient-to-br from-neutral-900 to-cyan-900/20 rounded-3xl border border-cyan-500/20 p-6 flex flex-col justify-center hover:border-cyan-500/60 hover:to-cyan-900/40 transition-all shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.2)]">
            <div class="text-4xl mb-3 text-cyan-400">🎨</div>
            <h3 class="font-bold text-white">Tailwind CSS</h3>
            <p class="text-xs text-gray-400">Deseño moderno e responsive.</p>
          </div>

          <div :class="[TRANSITION, getStepClass(3)]" class="col-span-1 bg-gradient-to-br from-neutral-900 to-emerald-900/20 rounded-3xl border border-emerald-500/20 p-6 flex flex-col justify-center hover:border-emerald-500/60 hover:to-emerald-900/40 transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <div class="text-4xl mb-3 text-emerald-400">⚡</div>
            <h3 class="font-bold text-white">Supabase</h3>
            <p class="text-xs text-gray-400">Autenticación e APIs.</p>
          </div>

          <div :class="[TRANSITION, getStepClass(4)]" class="col-span-4 bg-gradient-to-r from-neutral-900/90 via-purple-900/10 to-neutral-900/90 rounded-3xl border border-purple-500/20 p-6 flex items-center justify-around hover:border-purple-500/50 transition-all shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]">
             <div class="flex items-center gap-4">
                <span class="text-4xl text-purple-300">☁️</span>
                <h3 class="text-xl font-bold text-white">Despregamento e Infraestrutura</h3>
             </div>
             <div class="flex gap-8">
                <div class="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-neutral-700 hover:border-white/50 transition-colors">
                   <span class="text-2xl">▲</span>
                   <div><p class="font-bold text-white">Vercel</p><p class="text-xs text-gray-500">Frontend Edge</p></div>
                </div>
                 <div class="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-neutral-700 hover:border-purple-400/50 transition-colors">
                   <span class="text-2xl text-purple-400">🟣</span>
                   <div><p class="font-bold text-white">Render</p><p class="text-xs text-gray-500">Backend PostgreSQL</p></div>
                </div>
             </div>
          </div>

        </div>
      </div>

      <div v-if="currentSlide === 4" class="w-full h-full flex flex-col justify-center px-16 max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-white mb-24 text-center animate-in slide-in-from-bottom">Fluxo da Información</h2>
        
        <div class="relative flex items-center justify-between px-10">
          
          <div class="absolute top-1/2 left-0 w-full h-1 bg-neutral-800 -translate-y-1/2 z-0"></div>
          <div :class="['absolute top-1/2 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-600 -translate-y-1/2 z-0 transition-all duration-1000', currentStep >= 1 ? 'w-full' : 'w-0']"></div>

          <div :class="[TRANSITION, getStepClass(1)]" class="relative z-10 flex flex-col items-center gap-6 group">
             <div class="w-28 h-28 bg-neutral-900 border-4 border-neutral-700 group-hover:border-white rounded-full flex items-center justify-center text-5xl shadow-2xl transition-colors">👤</div>
             <p class="font-bold text-white text-xl">Usuario</p>
          </div>

          <div :class="[TRANSITION, getStepClass(2)]" class="relative z-10 flex flex-col items-center gap-6 group">
             <div class="w-28 h-28 bg-neutral-900 border-4 border-orange-500 rounded-2xl flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform">📋</div>
             <div class="text-center">
               <p class="font-bold text-white text-xl">Plan</p>
               <p class="text-sm text-gray-500">Días / Exercicios</p>
             </div>
          </div>

          <div :class="[TRANSITION, getStepClass(3)]" class="relative z-10 flex flex-col items-center gap-6 group">
             <div class="w-28 h-28 bg-neutral-900 border-4 border-red-600 rounded-2xl flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(220,38,38,0.4)] group-hover:scale-110 transition-transform">🔥</div>
             <div class="text-center">
               <p class="font-bold text-white text-xl">Sesión</p>
               <p class="text-sm text-gray-500">Inputs Reais</p>
             </div>
          </div>

           <div :class="[TRANSITION, getStepClass(3)]" class="relative z-10 flex flex-col items-center gap-6 group">
             <div class="w-28 h-28 bg-neutral-900 border-4 border-green-500 rounded-full flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(34,197,94,0.4)] group-hover:rotate-12 transition-transform">📊</div>
             <p class="font-bold text-white text-xl">Progreso</p>
          </div>
        </div>
      </div>

      <div v-if="currentSlide === 5" class="w-full h-full flex flex-col justify-center px-16 max-w-7xl mx-auto">
        <h2 class="text-5xl font-bold text-white mb-20 text-center flex items-center justify-center gap-4 animate-in slide-in-from-top">
           <span>🔮</span> Melloras Futuras
        </h2>

        <div class="grid grid-cols-3 gap-10 relative items-center">
           
           <div :class="['absolute top-1/2 left-0 h-1 bg-gradient-to-r from-orange-600 to-purple-600 -translate-y-1/2 rounded-full transition-all duration-1000', currentStep >= 1 ? 'w-full' : 'w-0']"></div>
           
           <div :class="[TRANSITION, getStepClass(1)]" class="relative bg-neutral-900 p-8 rounded-3xl border border-neutral-700 shadow-2xl hover:-translate-y-4 hover:border-gray-500 transition-all group z-10 opacity-80 hover:opacity-100">
              <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-16 bg-neutral-800 rounded-full border-4 border-neutral-950 flex items-center justify-center text-3xl shadow-lg">
                 📱
              </div>
              <h3 class="text-xl font-bold text-white mt-6 text-center mb-3">Modo Offline (PWA)</h3>
              <p class="text-gray-400 text-center text-xs">
                 Uso sen conexión en ximnasios.
              </p>
           </div>

           <div :class="[TRANSITION, getStepClass(2)]" class="relative bg-neutral-900 p-10 rounded-[2rem] border-2 border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.2)] hover:-translate-y-4 hover:shadow-orange-500/40 transition-all group z-20 scale-110">
              <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-neutral-800 rounded-full border-4 border-orange-500 flex items-center justify-center text-5xl shadow-xl">
                 📈
              </div>
              <h3 class="text-3xl font-bold text-white mt-10 text-center mb-4 text-orange-400">Historial Avanzado</h3>
              <p class="text-gray-300 text-center text-sm leading-relaxed">
                 Gráficas detalladas de volume, proxección de 1RM e comparativas visuais de rendemento.
              </p>
           </div>

           <div :class="[TRANSITION, getStepClass(3)]" class="relative bg-neutral-900 p-8 rounded-3xl border border-neutral-700 shadow-2xl hover:-translate-y-4 hover:border-gray-500 transition-all group z-10 opacity-80 hover:opacity-100">
              <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-16 bg-neutral-800 rounded-full border-4 border-neutral-950 flex items-center justify-center text-3xl shadow-lg">
                 🌍
              </div>
              <h3 class="text-xl font-bold text-white mt-6 text-center mb-3">Comunidade</h3>
              <p class="text-gray-400 text-center text-xs">
                 Compartir plans e perfís públicos.
              </p>
           </div>
        </div>
      </div>

      <div v-if="currentSlide === 6" class="w-full h-full flex flex-col items-center justify-center relative bg-black">
         
         <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-black to-black pointer-events-none animate-pulse-slow"></div>
         
         <div v-if="currentStep === 0" class="text-center animate-in zoom-in duration-700 relative z-10 px-4">
            <h2 class="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
               Web & Móbil. <span class="text-orange-500">Todo en un.</span>
            </h2>
            <p class="text-2xl md:text-3xl text-gray-400 font-light">Unha experiencia fluída en calquera dispositivo.</p>
            <div class="mt-12 inline-flex items-center gap-2 text-orange-500 border border-orange-500/30 px-6 py-3 rounded-full animate-bounce cursor-pointer hover:bg-orange-500/10 transition-colors">
               <span>👇</span>
               <span class="font-bold uppercase tracking-widest text-sm">Ver Demo Multiplataforma</span>
            </div>
         </div>

         <div 
            ref="videoContainerRef"
            v-else 
            class="relative w-full max-w-7xl h-[80vh] flex items-center justify-center gap-4 md:gap-10 animate-in slide-in-from-bottom duration-1000 z-10 px-4"
         >
            
            <div class="relative w-[60%] aspect-video rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-neutral-800 bg-neutral-900 group">
               <div class="absolute inset-0 border-[1px] border-white/5 rounded-xl overflow-hidden">
                  <video 
                    ref="desktopVideoRef"
                    class="w-full h-full object-cover" 
                    src="/video/desktop.mp4" 
                    loop
                    muted
                    playsinline
                  ></video>
                  <div class="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent pointer-events-none mix-blend-overlay"></div>
               </div>
               
               <div class="absolute -bottom-3 left-0 w-full h-3 bg-neutral-800 rounded-b-lg border-t border-black"></div>
               <div class="absolute top-full left-0 w-full h-20 bg-gradient-to-b from-orange-500/10 to-transparent opacity-20 blur-xl transform scale-y-[-1] mask-gradient-b"></div>
            </div>

            <div class="relative w-[20%] aspect-[9/19] rounded-[2.5rem] shadow-[0_20px_50px_rgba(234,88,12,0.2)] border-[6px] border-neutral-800 bg-black group transform translate-y-10 hover:-translate-y-2 transition-transform duration-500">
               <div class="absolute top-2 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-black rounded-full z-20"></div>
               
               <div class="w-full h-full rounded-[2rem] overflow-hidden border border-white/5 relative">
                  <video 
                    ref="mobileVideoRef"
                    class="w-full h-full object-cover" 
                    src="/video/mobile.mp4" 
                    loop
                    muted
                    playsinline
                  ></video>
                  <div class="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none"></div>
               </div>

               <div class="absolute top-20 -right-2 w-1 h-12 bg-neutral-800 rounded-r-md"></div>
               <div class="absolute top-20 -left-2 w-1 h-8 bg-neutral-800 rounded-l-md"></div>
               <div class="absolute top-32 -left-2 w-1 h-12 bg-neutral-800 rounded-l-md"></div>
            </div>

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

<style scoped>
.mask-gradient-b {
  mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 50%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 50%);
}
.perspective-1000 {
    perspective: 1000px;
}
.animate-pulse-slow {
    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>