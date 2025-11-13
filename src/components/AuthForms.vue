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
  <div class="auth-container" :class="{ 'form-active': currentView !== 'inicio' }">

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
      <div class="form-header">
        <button @click="goBack" class="button-back">←</button>
      </div>
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
      <div class="form-header">
        <button @click="goBack" class="button-back">←</button>
      </div>
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
  justify-content: flex-start;
  gap: 2rem;
  padding: 0 2rem 2rem 2rem;
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

.form-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0;
}

.button-back {
  background: transparent;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.button-back:hover {
  color: #0d6efd;
}



.auth-form {
  padding: 20px;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0;
  color: #f0f0f0;
}

.auth-form form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  margin: 0 auto;
  display: block;
  background: rgba(34, 34, 34, 0.95);
  color: #ffffff;
  border: 1px solid #ffffff65;
  border-radius: 1em;
  box-sizing: border-box;
}


input:focus,
input:hover {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.2);
  cursor: none !important;
}
input:active{
  cursor: auto !important;
}

.button-submit {
  width: 50%;
  padding: 12px;
  color: #fff;
  background-color: #0d6dfd;
border-radius: 1em;
  text-transform: uppercase;
  border: none;
  font-weight: 900;
  cursor: none;
  margin: 0 auto;
  font-family: inherit;
  font-size: 16px;
}

.button-submit:hover:not(:disabled) {
  background-color: #094094 ;
  transition: background-color 200ms linear;
  -webkit-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;

}

.button-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
@media (max-width: 967px) {
  .button-primary,
  .button-secondary {
    color: #fff;
    background: rgba(34, 34, 34, 0.95);
    font-size: 1rem;
    border-radius: 1em;
    width: 60%;
    margin: 0 auto;
    display: block;
  }
  
  .auth-form {
    padding: 10px;
  }

  .auth-form form {
    gap: 10px;
  }

  input {
    padding: 10px;
    margin: 0 auto;
    display: block;
    width: 80%;
  }

  label {
    width: 80%;
    margin: 0 auto;
    display: block;
    font-size: 1rem;
  }

  .button-submit {
    padding: 10px;
    margin-top: 8px;
  }

  .form-header {
    margin-bottom: 8px;
  }
}
</style>