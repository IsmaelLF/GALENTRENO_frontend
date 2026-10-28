<script>
import { supabase } from "../lib/supabase.js";

export default {
  data() {
    return {
      currentView: "inicio",
      nome: "",
      correo: "",
      contrasinal: "",
      isLoading: false,
      errorMessage: "",
    };
  },
  methods: {
    showLogin() {
      this.currentView = "login";
      this.resetForm();
    },
    showRegister() {
      this.currentView = "registro";
      this.resetForm();
    },
    goBack() {
      this.currentView = "inicio";
      this.resetForm();
    },
    resetForm() {
      this.errorMessage = "";
      this.nome = "";
      this.correo = "";
      this.contrasinal = "";
    },
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = "";

      try {
        const urlApi = import.meta.env.PUBLIC_API_URL;
        const response = await fetch(`${urlApi}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.correo,
            contrasinal: this.contrasinal,
          }),
        });

        if (response.ok) {
          const data = await response.json();

          const { error } = await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });

          if (error) {
            this.errorMessage = "Erro ao gardar a sesión";
            this.isLoading = false;
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, 100));
          window.location.href = "/inicio";
        } else {
          const errorData = await response.json();
          this.errorMessage =
            errorData.error || "Email ou contrasinal incorrectos.";
        }
      } catch (error) {
        this.errorMessage = "Erro de conexión co servidor.";
      } finally {
        this.isLoading = false;
      }
    },
    async handleRegister() {
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(this.correo)) {
        this.errorMessage = "Introduce un formato de correo electrónico válido.";
        return;
      }
      this.isLoading = true;
      this.errorMessage = "";
      try {
        const urlApi = import.meta.env.PUBLIC_API_URL;
        const response = await fetch(`${urlApi}/api/auth/rexistro`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: this.nome,
            email: this.correo,
            contrasinal: this.contrasinal,
          }),
        });

        if (response.ok) {
          const data = await response.json();

          const { error } = await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });

          if (error) {
            this.errorMessage = "Erro ao gardar a sesión";
            this.isLoading = false;
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, 100));
          window.location.href = "/inicio";
        } else {
          const errorData = await response.json();
          this.errorMessage =
            errorData.error || "Erro ao rexistrar. Tente de novo.";
        }
      } catch (error) {
        this.errorMessage = "Erro de conexión co servidor.";
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
      <div class="welcome-intro">
        <span class="welcome-badge">Adestramento Intelixente</span>
        <h2>Benvido a Galentreno</h2>
        <p>Xestiona as túas rutinas, rexistra as túas series e mide a túa evolución.</p>
      </div>
      <div class="welcome-buttons">
        <button @click="showLogin" class="btn-auth btn-auth-primary">
          Iniciar Sesión
        </button>
        <button @click="showRegister" class="btn-auth btn-auth-secondary">
          Crear Conta
        </button>
      </div>
    </div>

    <div v-if="currentView === 'login'" class="auth-form">
      <div class="form-header">
        <button @click="goBack" class="button-back" aria-label="Voltar">
          ← Voltar
        </button>
        <h3>Iniciar Sesión</h3>
      </div>
      <form @submit.prevent="handleLogin">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div class="field">
          <label for="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            v-model="correo"
            placeholder="nome@exemplo.gal"
            required
          />
        </div>

        <div class="field">
          <label for="password">Contrasinal</label>
          <input
            type="password"
            id="password"
            v-model="contrasinal"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" class="btn-auth btn-auth-primary" :disabled="isLoading">
          <span v-if="isLoading">Accedendo...</span>
          <span v-else>Entrar</span>
        </button>
      </form>
    </div>

    <div v-if="currentView === 'registro'" class="auth-form">
      <div class="form-header">
        <button @click="goBack" class="button-back" aria-label="Voltar">
          ← Voltar
        </button>
        <h3>Crear Conta</h3>
      </div>
      <form @submit.prevent="handleRegister">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div class="field">
          <label for="nome">Nome</label>
          <input
            type="text"
            id="nome"
            v-model="nome"
            placeholder="O teu nome"
            required
          />
        </div>

        <div class="field">
          <label for="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            v-model="correo"
            placeholder="nome@exemplo.gal"
            required
          />
        </div>

        <div class="field">
          <label for="password">Contrasinal</label>
          <input
            type="password"
            id="password"
            v-model="contrasinal"
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>

        <button type="submit" class="btn-auth btn-auth-primary" :disabled="isLoading">
          <span v-if="isLoading">Creando conta...</span>
          <span v-else>Rexistrarse</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  width: 100%;
}

.welcome-screen {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  text-align: center;
}

.welcome-badge {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #60a5fa;
  background: rgba(59, 130, 246, 0.14);
  border: 1px solid rgba(59, 130, 246, 0.3);
  margin-bottom: 0.75rem;
}

.welcome-intro h2 {
  font-size: 1.65rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.welcome-intro p {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.5;
}

.welcome-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  width: 100%;
}

.btn-auth {
  width: 100%;
  padding: 0.875rem 1.25rem;
  border-radius: 0.75rem;
  font-family: inherit;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.btn-auth-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 20px -4px rgba(59, 130, 246, 0.45);
}

.btn-auth-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -4px rgba(59, 130, 246, 0.6);
}

.btn-auth-secondary {
  background: rgba(30, 41, 59, 0.7);
  color: #f8fafc;
  border: 1px solid rgba(148, 163, 184, 0.22);
}

.btn-auth-secondary:hover:not(:disabled) {
  background: rgba(51, 65, 85, 0.8);
  border-color: rgba(59, 130, 246, 0.5);
  transform: translateY(-2px);
}

.btn-auth:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
}

.form-header h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
}

.button-back {
  background: transparent;
  color: #94a3b8;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.button-back:hover {
  color: #f8fafc;
  background: rgba(148, 163, 184, 0.1);
}

.auth-form form {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #cbd5e1;
}

input {
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(9, 13, 22, 0.85);
  color: #f8fafc;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.75rem;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input::placeholder {
  color: #64748b;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.error-message {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.75rem;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
}
</style>