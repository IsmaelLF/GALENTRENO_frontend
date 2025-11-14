<template>
  <div v-if="isVisible" class="login-transition-overlay">
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

      if ('startViewTransition' in document) {
        const transition = (document as any).startViewTransition(async () => {
          window.location.href = '/inicio';
        });

        await transition.ready;

        gsap.fromTo(
          hero,
          { y: '100vh' },
          {
            y: '-100vh',
            duration: 1.5,
            ease: 'power2.inOut'
          }
        );
      } else {
        gsap.fromTo(
          hero,
          { y: '100vh' },
          {
            y: '-100vh',
            duration: 1.5,
            ease: 'power2.inOut',
            onComplete: () => {
              window.location.href = '/inicio';
            }
          }
        );
      }
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
  z-index: 99999;
  background-color: transparent;
  overflow: hidden;
  pointer-events: none;
}

.hero-container {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100000;
  width: 100%;
  max-width: 500px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  pointer-events: none;
}

.hero-image {
  width: 100%;
  height: auto;
  max-height: 90vh;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(0, 115, 192, 0.5));
}

@media (max-width: 767px) {
  .hero-container {
    max-width: 80%;
  }

  .hero-image {
    max-height: 70vh;
  }
}
</style>
