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
      isLogin: true,
      nome: '',
      correo: '',
      contrasinal: '',
      isLoading: false,
      errorMessage: '',
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
        this.errorMessage = 'Por favor, introduce un formato de correo electrónico válido.';
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
          this.isLogin = true;
          this.errorMessage = '';
          this.nome = '';
          this.correo = '';
          this.contrasinal = '';
          alert('Rexistro exitoso! Agora podes iniciar sesión.');
        } else {
          const errorData = await response.json();
          this.errorMessage = errorData.error || 'Erro ao rexistrar. Tente de novo.';
        }
      } catch (error) {
        this.errorMessage = 'Error de conexión co servidor.';
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<template>
  <div class="auth-container">
    
    <div class="auth-form">
    <h2 class="h2-form">{{ isLogin ? 'INICIAR SESIÓN' : 'REXISTRARSE' }}</h2>
      <form @submit.prevent="isLogin ? handleLogin() : handleRegister()">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div v-if="!isLogin">
          <label for="nome">Nome:</label>
          <input type="text" id="nome" v-model="nome" required>
        </div>

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
          <span v-else>{{ isLogin ? 'Iniciar Sesión' : 'Rexistrarse' }}</span>
        </button>

        <div class="toggle-section">
          <p class="p-text-acc">
            {{ isLogin ? 'Non tes unha conta?' : 'Xa tes unha conta?' }}
          </p>
          <button type="button" @click="toggleForm" class="button button-toggle">
            {{ isLogin ? 'Rexístrate' : 'Inicia Sesión' }}
          </button>
        </div>
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
}

.h2-form {
  display: flex;
  margin: 0 auto;
  text-align: center;
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
  position: relative;
  left: auto;
  transform: none;
  color: #f0f0f0;
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
  background: #333;
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

.toggle-section {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 1rem;
}

.button-toggle {
  width: 100%;
  background: transparent;
  color: #1c77ff;
  cursor: pointer;
  margin: 0;
  height: fit-content;
  padding: 5px;
  border: none;
  transition: color 0.2s ease;
  font-family: inherit;
}

.button-toggle:hover {
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