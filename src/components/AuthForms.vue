<script>
export default {
  props: {
    startWithRegister: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentView: 'inicio',
      nome: '',
      correo: '',
      contrasinal: '',
      isLoading: false,
      errorMessage: '',
    };
  },
  mounted() {
    if (this.startWithRegister) {
      this.currentView = 'registro';
    }
  },
  methods: {
    showLogin() {
      this.currentView = 'login';
      this.resetForm();
    },
    showRegister() {
      this.currentView = 'registro';
      this.resetForm();
    },
    goBack() {
      this.currentView = 'inicio';
      this.resetForm();
    },
    resetForm() {
      this.errorMessage = '';
      this.nome = '';
      this.correo = '';
      this.contrasinal = '';
    },
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const urlApi = import.meta.env.PUBLIC_API_URL;
        const response = await fetch(`${urlApi}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.correo, contrasinal: this.contrasinal }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('jwt_token', data.token);
          window.location.href = '/inicio';
        } else {
          const errorData = await response.json();
          this.errorMessage = errorData.error || 'Email o contraseña incorrectos.';
        }
      } catch (error) {
        this.errorMessage = 'Error de conexión con el servidor.';
      } finally {
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
        const urlApi = import.meta.env.PUBLIC_API_URL;
        const response = await fetch(`${urlApi}/api/auth/rexistro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome: this.nome, email: this.correo, contrasinal: this.contrasinal }),
        });

        if (response.ok) {
          this.currentView = 'login';
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
  <div class="auth-container">
    
    <div v-if="currentView === 'inicio'" class="welcome-screen">
      <div class="welcome-buttons">
        <button @click="showLogin" class="button button-primary">
          INICIAR SESIÓN
        </button>
        <button @click="showRegister" class="button button-secondary">
          REXISTRARSE
        </button>
      </div>
    </div>

    <div v-if="currentView === 'login'" class="auth-form">
      <button @click="goBack" class="button-back">← Volver</button>
      <h3 class="h3-form">INICIAR SESIÓN</h3>
      <form @submit.prevent="handleLogin">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div>
          <label for="email">Correo:</label>
          <input type="email" id="email" v-model="correo" required>
        </div>

        <div>
          <label for="password">Contrasinal:</label>
          <input type="password" id="password" v-model="contrasinal" required>
        </div>

        <button type="submit" class="button button-submit" :disabled="isLoading">
          <span v-if="isLoading">Cargando...</span>
          <span v-else>Iniciar Sesión</span>
        </button>
      </form>
    </div>

    <div v-if="currentView === 'registro'" class="auth-form">
      <button @click="goBack" class="button-back">← Volver</button>
      <h3 class="h3-form">REXISTRARSE</h3>
      <form @submit.prevent="handleRegister">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div>
          <label for="nome">Nome</label>
          <input type="text" id="nome" v-model="nome" required>
        </div>

        <div>
          <label for="email">Correo</label>
          <input type="email" id="email" v-model="correo" required>
        </div>

        <div>
          <label for="password">Contrasinal</label>
          <input type="password" id="password" v-model="contrasinal" required>
        </div>

        <button type="submit" class="button button-submit" :disabled="isLoading">
          <span v-if="isLoading">Cargando...</span>
          <span v-else>Rexistrarse</span>
        </button>
      </form>
    </div>

  </div>
</template>

<style>
.auth-container {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
}

.welcome-buttons {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  width: 100%;
}

.button-primary,
.button-secondary {
  width: 100%;
  padding: 16px;
  background-color: transparent;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  font-size: 1.5rem;
  transition: color 0.2s ease, transform 0.1s ease;
}

.button-primary:hover,
.button-secondary:hover {
  color: #0d6efd;
  transform: translateY(-2px);
}

.button-back {
  position: absolute;
  top: 10px;
  left: 10px;
  background: transparent;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 5px 10px;
  transition: color 0.2s ease;
}

.button-back:hover {
  color: #0d6efd;
}

.h3-form {
  text-align: center;
  font-family: TexGyre, sans-serif;
  color: #fff;
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.auth-form {
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  display: grid;
  grid-gap: 16px;
  color: #f0f0f0;
  position: relative;
}

.error-message {
  color: #ff4444;
  background: rgba(255, 68, 68, 0.1);
  padding: 10px;
  border-radius: 6px;
  margin: 0;
  text-align: center;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #f0f0f0;
}

input {
  width: 100%;
  padding: 12px;
  margin: 5px 0 10px 0;
  background: #111;
  color: #ffffff;
  border: 1px solid #555;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:active,
input:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.2);
}

.button-submit {
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

.button-submit:hover:not(:disabled) {
  background-color: #0b5ed7;
}

.button-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>