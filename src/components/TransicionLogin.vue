<script>
import { gsap } from 'gsap';

export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isVisible(newValue) {
      if (newValue) {
        this.playTransition();
      }
    },
  },
  methods: {
    playTransition() {
      const tl = gsap.timeline({
        onComplete: () => {
          window.location.href = '/inicio';
        },
      });

      const overlay = this.$refs.overlay;
      const hero = this.$refs.hero;

      gsap.set(hero, { y: '100vh', rotation: 5 });

      tl
        .to(overlay, {
          duration: 0.4,
          opacity: 1,
        })
        .to(hero, {
          duration: 0.5,
          y: '0vh',
          ease: 'power2.out',
        }, 0.3)
        .to(overlay, {
          duration: 0.6,
          y: '-100vh',
          ease: 'power2.in',
        }, 0.8)
        .to(hero, {
          duration: 0.6,
          scale: 1.2,
          rotation: -5,
          ease: 'power2.in',
        }, 0.8)
        .to([overlay, hero], {
          duration: 0.6,
          opacity: 0,
        }, 1.2);
    },
  },
};
</script>

<template>
  <div v-if="isVisible" class="login-transition-overlay" ref="overlay">
    <div class="hero-container">
      <img
        src="/img/transition-hero.png"
        alt="Transición de inicio"
        class="hero-image"
        ref="hero"
      />
    </div>
  </div>
</template>

<style>
.login-transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #111;
  opacity: 0;
  z-index: 10000;
  overflow: hidden;
}

.hero-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image {
  height: 70%;
  max-width: 90%;
  object-fit: contain;
}
</style>