<template>
  <div v-if="isVisible" class="login-transition-overlay">
    <div class="hero-container">
      <img src="/img/transition-hero.png" alt="" class="hero-image" />
      <div class="white-cover"></div>
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

      const hero = this.$el.querySelector('.hero-container') as HTMLElement;
      const whiteCover = this.$el.querySelector('.white-cover') as HTMLElement;

      gsap.fromTo(
        hero,
        { y: '100vh' },
        {
          y: '-110vh',
          duration: 2,
          ease: 'power2.inOut'
        }
      );

      gsap.fromTo(
        whiteCover,
        { scaleY: 0, transformOrigin: 'bottom' },
        {
          scaleY: 1,
          duration: 2.2,
          ease: 'power2.inOut',
          delay: 0.5,
          onComplete: () => {
            window.location.href = '/inicio';
          }
        }
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
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  pointer-events: none;
}

.hero-image {
  width: 100%;
  height: auto;
  max-height: 90vh;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(0, 115, 192, 0.5));
  position: relative;
  z-index: 2;
}

.white-cover {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  z-index: 100001;
  transform-origin: bottom;
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
