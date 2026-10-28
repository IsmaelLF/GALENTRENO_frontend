<script>
import { supabase } from "../lib/supabase.js";

const BLOCKED_DOMAINS = new Set([
  "hi.com",
  "test.com",
  "example.com",
  "ejemplo.com",
  "exemplo.com",
  "mail.com",
  "email.com",
  "123.com",
  "abc.com",
  "qwerty.com",
  "temp.com",
  "fake.com",
  "tempmail.com",
  "mailinator.com",
  "guerrillamail.com",
  "yopmail.com",
  "10minutemail.com",
  "trashmail.com",
]);

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
  computed: {
    passwordChecks() {
      const pwd = this.contrasinal || "";
      return {
        length: pwd.length >= 8,
        upper: /[A-ZÁÉÍÓÚÑ]/.test(pwd),
        lower: /[a-záéíóúñ]/.test(pwd),
        number: /\d/.test(pwd),
      };
    },
    isPasswordStrong() {
      const c = this.passwordChecks;
      return c.length && c.upper && c.lower && c.number;
    },
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
    validateEmail(rawEmail) {
      const email = (rawEmail || "").trim().toLowerCase();
      const strictEmailRegex =
        /^[a-z0-9]+([._+-][a-z0-9]+)*@[a-z0-9]+([.-][a-z0-9]+)*\.[a-z]{2,12}$/;

      if (!strictEmailRegex.test(email)) {
        return "Introduce un enderezo de correo electrónico válido.";
      }

      const [localPart, domain] = email.split("@");
      const domainParts = domain.split(".");
      const domainName = domainParts[0];

      if (localPart.length < 2) {
        return "O nome de usuario do correo é demasiado curto.";
      }

      if (domainName.length < 3) {
        return "O dominio do correo non é válido (ex: gmail.com, outlook.es).";
      }

      if (BLOCKED_DOMAINS.has(domain) || localPart === domainName) {
        return "Por favor, utiliza un correo electrónico persoal real.";
      }

      return null;
    },
    validatePassword(password) {
      if (!password || password.length < 8) {
        return "O contrasinal debe ter polo menos 8 caracteres.";
      }
      if (!/[A-ZÁÉÍÓÚÑ]/.test(password)) {
        return "O contrasinal debe incluír polo menos unha letra maiúscula.";
      }
      if (!/[a-záéíóúñ]/.test(password)) {
        return "O contrasinal debe incluír polo menos unha letra minúscula.";
      }
      if (!/\d/.test(password)) {
        return "O contrasinal debe incluír polo menos un número.";
      }
      return null;
    },
    async handleLogin() {
      const emailError = this.validateEmail(this.correo);
      if (emailError) {
        this.errorMessage = emailError;
        return;
      }

      if (!this.contrasinal || this.contrasinal.length < 6) {
        this.errorMessage = "Introduce o teu contrasinal.";
        return;
      }

      this.isLoading = true;
      this.errorMessage = "";

      try {
        const urlApi =
          import.meta.env.PUBLIC_API_URL ||
          "https://galentreno-backend.onrender.com";
        const response = await fetch(`${urlApi}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.correo.trim().toLowerCase(),
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
            this.errorMessage = "Erro ao gardar a sesión.";
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
      const cleanName = (this.nome || "").trim();
      if (cleanName.length < 2) {
        this.errorMessage = "O nome debe ter polo menos 2 caracteres.";
        return;
      }

      const emailError = this.validateEmail(this.correo);
      if (emailError) {
        this.errorMessage = emailError;
        return;
      }

      const passwordError = this.validatePassword(this.contrasinal);
      if (passwordError) {
        this.errorMessage = passwordError;
        return;
      }

      this.isLoading = true;
      this.errorMessage = "";
      try {
        const urlApi =
          import.meta.env.PUBLIC_API_URL ||
          "https://galentreno-backend.onrender.com";
        const response = await fetch(`${urlApi}/api/auth/rexistro`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: cleanName,
            email: this.correo.trim().toLowerCase(),
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
            this.errorMessage = "Erro ao gardar a sesión.";
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
      <form @submit.prevent="handleLogin" novalidate>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div class="field">
          <label for="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            v-model="correo"
            placeholder="nome@gmail.com"
            autocomplete="email"
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
            autocomplete="current-password"
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
      <form @submit.prevent="handleRegister" novalidate>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div class="field">
          <label for="nome">Nome</label>
          <input
            type="text"
            id="nome"
            v-model="nome"
            placeholder="O teu nome"
            autocomplete="name"
            required
          />
        </div>

        <div class="field">
          <label for="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            v-model="correo"
            placeholder="nome@gmail.com"
            autocomplete="email"
            required
          />
        </div>

        <div class="field">
          <label for="password">Contrasinal</label>
          <input
            type="password"
            id="password"
            v-model="contrasinal"
            placeholder="Mínimo 8 caracteres"
            autocomplete="new-password"
            required
          />
          <ul class="password-Checklist" aria-label="Requisitos do contrasinal">
            <li :class="{ met: passwordChecks.length }">8+ caracteres</li>
            <li :class="{ met: passwordChecks.upper }">1 maiúscula</li>
            <li :class="{ met: passwordChecks.lower }">1 minúscula</li>
            <li :class="{ met: passwordChecks.number }">1 número</li>
          </ul>
        </div>

        <button
          type="submit"
          class="btn-auth btn-auth-primary"
          :disabled="isLoading || !isPasswordStrong"
        >
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
  font-size: clamp(1.4rem, 4vw, 1.65rem);
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.welcome-intro p {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0;
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
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
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
  padding: 0.35rem 0.6rem;
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
  font-size: 1rem;
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

.password-Checklist {
  list-style: none;
  padding: 0;
  margin: 0.35rem 0 0 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.35rem;
}

.password-Checklist li {
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: color 0.2s ease;
}

.password-Checklist li::before {
  content: "○";
  font-size: 0.7rem;
}

.password-Checklist li.met {
  color: #34d399;
  font-weight: 600;
}

.password-Checklist li.met::before {
  content: "✓";
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

@media (max-width: 480px) {
  .password-Checklist {
    grid-template-columns: 1fr 1fr;
  }
}
</style>