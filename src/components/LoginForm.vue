
<script>
import LoginTransition from './LoginTransition.vue';
import { supabase } from '../lib/supabase.js';

export default {
  components: {
    LoginTransition,
  },
  props: {
    startWithRegister: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLogin: true,
      nome: '',
      correo: '',
      contrasinal: '',
      isLoading: false,
      errorMessage: '',
      showLoginTransition: false,
    };
  },
  mounted() {
    if (this.startWithRegister) {
      this.isLogin = false;
    }
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
      this.errorMessage = '';
      this.nome = '';
      this.correo = '';
      this.contrasinal = '';
    },
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const urlApi = import.meta.env.PUBLIC_API_URL || "https://galentreno.vercel.app";
        const response = await fetch(`${urlApi}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.correo, contrasinal: this.contrasinal }),
        });

        if (response.ok) {
          const data = await response.json();

          const { error } = await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          });

          if (error) {
            console.error('Error setting session:', error);
            this.errorMessage = 'Erro ao gardar a sesión';
            this.isLoading = false;
            return;
          }

          // Pequeno delay para asegurar que a sesión se gardou
          await new Promise(resolve => setTimeout(resolve, 100));

          this.showLoginTransition = true;
        } else {
          const errorData = await response.json();
          this.errorMessage = errorData.error || 'Email o contrasinal incorrectos.';
          this.isLoading = false;
        }
      } catch (error) {
        this.errorMessage = 'Erro de conexión co servidor.';
        this.isLoading = false;
      }
    },
    async handleRegister() {
      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(this.correo)) {
        this.errorMessage = 'Introduce un formato de correo electrónico válido.';
        return;
      }
      this.isLoading = true;
      this.errorMessage = '';
      try {
        const urlApi = import.meta.env.PUBLIC_API_URL || "https://galentreno.vercel.app";
        const response = await fetch(`${urlApi}/api/auth/rexistro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome: this.nome, email: this.correo, contrasinal: this.contrasinal }),
        });

        if (response.ok) {
          this.isLogin = true;
          this.errorMessage = '';
          this.nome = '';
          this.correo = '';
          this.contrasinal = '';
        } else {
          const errorData = await response.json();
          this.errorMessage = errorData.error || 'Erro ao rexistrar. Tente de novo.';
        }
      } catch (error) {
        this.errorMessage = 'Erro de conexión co servidor.';
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<template>
  <h2 class="h2-form">INICIAR SESIÓN</h2>
  <div class="login-form">
    <form @submit.prevent="handleLogin">
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>

      <div>
        <label for="email">Correo:</label>
        <input type="email" id="email" v-model="correo" required>
      </div>

      <div>
        <label for="password">Contrasinal:</label>
        <input type="password" id="password" v-model="contrasinal" required>
      </div>

      <button type="submit" class="button button-login" :disabled="isLoading">
        <span v-if="isLoading">Cargando...</span>
        <span v-else>Iniciar Sesión</span>
      </button>

<div class="register-section">
      <p class="p-text-acc">Non tes unha conta?</p>
      <a href="/rexistro" class="button button-register">Rexístrate</a>
    </div>
      </form>
  </div>
</template>

<style>
.register-section {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 1rem;
}
.h2-form {
  text-align: center;
  font-family: TexGyre, sans-serif;
  color: #fff;
  margin-bottom: 1.5rem;
  position: absolute;
  top: 0;
}
.login-form {
  background: #2a2a2e;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  box-sizing: border-box;
  margin: 0 auto;
  display: grid;
  grid-gap: 16px;
  position: relative;
  left: auto;
  transform: none;
  color: #f0f0f0;
}

input {
  width: 100%;
  padding: 12px;
  margin: 5px 0 10px 0;
  background: #333;
  color: #ffffff;
  border: 1px solid #555;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:active, input:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.2);
}

.button-login {
  width: 100%;
  padding: 12px;
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 0 auto;
  font-family: inherit;
  font-weight: 600;
  transition: background-color 0.2s ease;
}
.button-login:hover {
  background-color: #0b5ed7;
}

.button-register {
  width: 100%;
  background: transparent;
  color: #1c77ff;
  cursor: pointer;
  margin: 0;
  height: fit-content;
  padding: 5px;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.button-register:hover {
  color: #ffffff;
}
.p-text-acc {
  color: #a0a0a0;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
</style>
