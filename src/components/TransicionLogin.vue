<template>
  <div v-if="isVisible" class="login-transition-overlay">
    <div class="curtain-top"></div>
    <div class="curtain-bottom"></div>
    <div class="hero-container">
      <img src="/img/transition-hero.png" alt="" class="hero-image" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

declare const gsap: any;

export default defineComponent({
  name: 'TransicionLogin',
  data() {
    return {
      isVisible: false,
    };
  },
  methods: {
    async playTransition() {
      this.isVisible = true;

      await this.$nextTick();

      const overlay = this.$el;
      const hero = overlay.querySelector('.hero-container') as HTMLElement;
      const curtainTop = overlay.querySelector('.curtain-top') as HTMLElement;
      const curtainBottom = overlay.querySelector('.curtain-bottom') as HTMLElement;

      const timeline = gsap.timeline();

      // Fase 1: Fade in del overlay
      timeline.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      // Fase 2: Héroe entra desde abajo
      timeline.fromTo(
        hero,
        { y: 200, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
        '-=0.1'
      );

      // Fase 3: Héroe "levanta" la cortina (cortinas se mueven hacia arriba/abajo)
      timeline.to(
        curtainTop,
        { y: '-100%', duration: 0.8, ease: 'power2.inOut' },
        '+=0.2'
      );

      timeline.to(
        curtainBottom,
        { y: '100%', duration: 0.8, ease: 'power2.inOut' },
        '-=0.8'
      );

      // Fase 4: Fade out completo
      timeline.to(
        overlay,
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            window.location.href = '/inicio';
          }
        },
        '+=0.2'
      );
    },
  },
});
</script>

<style scoped>
.login-transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.hero-container {
  position: relative;
  z-index: 10002;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image {
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(0, 115, 192, 0.4));
}

.curtain-top,
.curtain-bottom {
  position: absolute;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to bottom, #000 0%, #111 100%);
  z-index: 10001;
}

.curtain-top {
  top: 0;
  transform-origin: top;
}

.curtain-bottom {
  bottom: 0;
  transform-origin: bottom;
  background: linear-gradient(to top, #000 0%, #111 100%);
}

@media (max-width: 767px) {
  .hero-container {
    max-width: 90%;
  }

  .hero-image {
    max-height: 70vh;
  }
}
</style>
