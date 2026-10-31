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
      <div class="welcome-copy">
        <div class="welcome-intro">
          <span class="welcome-badge">Adestra ao teu ritmo</span>
          <h2>Cada sesión conta.<br />Comeza pola seguinte.</h2>
          <p>
            Organiza as túas rutinas, apunta cada serie e céntrate no que importa:
            ir progresando, pouco a pouco.
          </p>
        </div>
        <div class="welcome-buttons">
          <button @click="showRegister" class="btn-auth btn-auth-primary">
            Crear a miña conta
            <span aria-hidden="true">→</span>
          </button>
          <button @click="showLogin" class="btn-auth btn-auth-secondary">
            Xa teño conta
          </button>
        </div>
        <p class="welcome-note">Sen presión. Só ti, a túa rutina e o seguinte adestramento.</p>
      </div>

      <article class="training-preview" aria-label="Exemplo de rexistro de adestramento">
        <header class="preview-header">
          <div>
            <span class="preview-eyebrow">Exemplo de rutina</span>
            <h3>Tren superior</h3>
          </div>
          <span class="preview-day">DÍA 01</span>
        </header>

        <div class="preview-exercises">
          <div class="preview-exercise">
            <span class="exercise-number">01</span>
            <div class="exercise-details">
              <strong>Press de banca</strong>
              <span>3 series · 8 repeticións</span>
            </div>
            <span class="exercise-check" aria-label="Completado">✓</span>
          </div>
          <div class="preview-exercise">
            <span class="exercise-number">02</span>
            <div class="exercise-details">
              <strong>Remo con barra</strong>
              <span>3 series · 10 repeticións</span>
            </div>
            <span class="exercise-check" aria-label="Completado">✓</span>
          </div>
          <div class="preview-exercise">
            <span class="exercise-number">03</span>
            <div class="exercise-details">
              <strong>Press de ombreiros</strong>
              <span>3 series · 10 repeticións</span>
            </div>
            <span class="exercise-check" aria-label="Completado">✓</span>
          </div>
        </div>

        <p class="preview-footnote">
          Un exemplo sinxelo. A túa rutina, ao teu xeito.
        </p>
      </article>

      <div class="welcome-benefits" aria-label="O que podes facer con Galentreno">
        <div>
          <span class="benefit-mark" aria-hidden="true">01</span>
          <p><strong>Rexistro doado</strong><span>Apunta series e pesos sen interromper o ritmo.</span></p>
        </div>
        <div>
          <span class="benefit-mark" aria-hidden="true">02</span>
          <p><strong>Plans á túa medida</strong><span>Adapta cada rutina aos teus obxectivos.</span></p>
        </div>
        <div>
          <span class="benefit-mark" aria-hidden="true">03</span>
          <p><strong>Progreso real</strong><span>Consulta como avanzas co paso do tempo.</span></p>
        </div>
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
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 0.86fr);
  column-gap: clamp(2rem, 6vw, 6rem);
  row-gap: 3.5rem;
  align-items: center;
}

.welcome-copy {
  max-width: 580px;
}

.welcome-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--auth-primary);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.015em;
  margin-bottom: 1.1rem;
}

.welcome-badge::before {
  content: "";
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: currentColor;
}

.welcome-intro h2 {
  font-size: clamp(2.5rem, 5vw, 4.25rem);
  font-weight: 700;
  color: var(--auth-text);
  margin-bottom: 1rem;
  letter-spacing: -0.055em;
  line-height: 1.08;
}

.welcome-intro p {
  max-width: 490px;
  font-size: 1.05rem;
  color: var(--auth-text-secondary);
  line-height: 1.75;
  margin: 0;
}

.welcome-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.btn-auth {
  min-height: 3.25rem;
  padding: 0.8rem 1.25rem;
  border-radius: 0.65rem;
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
  background: var(--auth-primary);
  color: #241e31;
  border: 1px solid transparent;
  box-shadow: none;
}

.btn-auth-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  background: var(--auth-primary-hover);
  box-shadow: none;
}

.btn-auth-secondary {
  background: transparent;
  color: var(--auth-text-secondary);
  border: 1px solid rgba(233, 225, 245, 0.2);
}

.btn-auth-secondary:hover:not(:disabled) {
  background: var(--auth-primary-light);
  border-color: rgba(167, 139, 223, 0.35);
  color: var(--auth-text);
}

.welcome-note {
  margin: 0.9rem 0 0;
  color: var(--auth-muted);
  font-size: 0.8rem;
}

.training-preview {
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 1px solid var(--auth-border);
  border-radius: 1rem;
  background: #24212a;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--auth-border);
}

.preview-eyebrow {
  color: var(--auth-muted);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.preview-header h3 {
  margin: 0.35rem 0 0;
  color: var(--auth-text);
  font-size: 1.35rem;
  letter-spacing: -0.03em;
}

.preview-day {
  padding: 0.35rem 0.55rem;
  border-radius: 0.35rem;
  color: var(--auth-primary);
  background: var(--auth-primary-light);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.preview-exercises {
  padding-top: 0.25rem;
}

.preview-exercise {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--auth-border);
}

.exercise-number {
  color: var(--auth-muted);
  font-size: 0.72rem;
  font-variant-numeric: tabular-nums;
}

.exercise-details {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.2rem;
}

.exercise-details strong {
  color: var(--auth-text-secondary);
  font-size: 0.88rem;
  font-weight: 600;
}

.exercise-details span {
  color: var(--auth-muted);
  font-size: 0.76rem;
}

.exercise-check {
  display: grid;
  width: 1.35rem;
  height: 1.35rem;
  place-items: center;
  border: 1px solid rgba(112, 196, 160, 0.35);
  border-radius: 50%;
  color: #70c4a0;
  font-size: 0.72rem;
}

.preview-footnote {
  margin: 1rem 0 0;
  color: var(--auth-muted);
  font-size: 0.76rem;
}

.welcome-benefits {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--auth-border);
  padding-top: 1.5rem;
}

.welcome-benefits > div {
  display: flex;
  gap: 0.8rem;
  padding: 0 1.25rem;
}

.welcome-benefits > div:first-child {
  padding-left: 0;
}

.welcome-benefits > div + div {
  border-left: 1px solid var(--auth-border);
}

.benefit-mark {
  color: var(--auth-primary);
  font-size: 0.7rem;
  font-weight: 700;
  padding-top: 0.15rem;
}

.welcome-benefits p {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
}

.welcome-benefits strong {
  color: var(--auth-text-secondary);
  font-size: 0.82rem;
  font-weight: 600;
}

.welcome-benefits p span {
  color: var(--auth-muted);
  font-size: 0.75rem;
  line-height: 1.5;
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
  border-bottom: 1px solid var(--auth-border);
}

.form-header h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--auth-text);
  margin: 0;
}

.button-back {
  background: transparent;
  color: var(--auth-muted);
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.35rem 0.6rem;
  border-radius: 0.5rem;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.button-back:hover {
  color: var(--auth-text);
  background: var(--auth-primary-light);
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
  color: var(--auth-text-secondary);
}

input {
  width: 100%;
  padding: 0.8rem 1rem;
  background: var(--auth-input);
  color: var(--auth-text);
  border: 1px solid var(--auth-border);
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input::placeholder {
  color: var(--auth-muted);
}

input:focus {
  outline: none;
  border-color: var(--auth-primary);
  box-shadow: 0 0 0 3px var(--auth-primary-light);
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
  color: var(--auth-muted);
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

@media (max-width: 760px) {
  .welcome-screen {
    grid-template-columns: 1fr;
    row-gap: 2rem;
  }

  .welcome-intro h2 {
    font-size: clamp(2.35rem, 10vw, 3.5rem);
  }

  .welcome-benefits {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .welcome-benefits > div,
  .welcome-benefits > div:first-child {
    padding: 0;
  }

  .welcome-benefits > div + div {
    border-left: 0;
  }
}

@media (max-width: 420px) {
  .welcome-buttons {
    flex-direction: column;
  }

  .welcome-buttons .btn-auth {
    width: 100%;
  }
}
</style>