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

      const hero = this.$el.querySelector('.hero-container') as HTMLElement;

      gsap.fromTo(
        hero,
        { y: '100vh' },
        {
          y: '-100vh',
          duration: 2,
          ease: 'power2.inOut'
        }
      );

      setTimeout(() => {
        window.location.href = '/inicio';
      }, 800);
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
