<script>
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
      nome: "",
      correo: "",
      contrasinal: "",
      isLoading: false,
      errorMessage: "",
    };
  },
  methods: {
    validateEmail(rawEmail) {
      const email = (rawEmail || "").trim().toLowerCase();
      const strictEmailRegex =
        /^[a-z0-9]+([._+-][a-z0-9]+)*@[a-z0-9]+([.-][a-z0-9]+)*\.[a-z]{2,12}$/;

      if (!strictEmailRegex.test(email)) {
        return "Por favor, introduce un formato de correo electrónico válido.";
      }

      const [localPart, domain] = email.split("@");
      const domainName = domain.split(".")[0];

      if (
        localPart.length < 2 ||
        domainName.length < 3 ||
        BLOCKED_DOMAINS.has(domain) ||
        localPart === domainName
      ) {
        return "Por favor, utiliza un correo electrónico persoal válido.";
      }

      return null;
    },
    validatePassword(password) {
      if (!password || password.length < 8) {
        return "O contrasinal debe ter polo menos 8 caracteres.";
      }
      if (
        !/[A-ZÁÉÍÓÚÑ]/.test(password) ||
        !/[a-záéíóúñ]/.test(password) ||
        !/\d/.test(password)
      ) {
        return "O contrasinal debe incluír maiúsculas, minúsculas e números.";
      }
      return null;
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
          window.location.href = "/";
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
  <div class="register-card">
    <h2 class="h2-form">Rexistrarse</h2>
    <form @submit.prevent="handleRegister" novalidate>
      <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

      <div>
        <label for="nome">Nome</label>
        <input type="text" id="nome" v-model="nome" required />
      </div>

      <div>
        <label for="email">Correo electrónico</label>
        <input type="email" id="email" v-model="correo" required />
      </div>

      <div>
        <label for="password">Contrasinal</label>
        <input
          type="password"
          id="password"
          v-model="contrasinal"
          placeholder="Mín. 8 caracteres, maiúscula e número"
          required
        />
      </div>

      <button type="submit" class="button" :disabled="isLoading">
        <span v-if="isLoading">Cargando...</span>
        <span v-else>Rexistrarse</span>
      </button>

      <div class="login-section">
        <p class="p-text-acc">Xa tes unha conta?</p>
        <a href="/" class="link-secondary">Inicia Sesión</a>
      </div>
    </form>
  </div>
</template>

<style scoped>
.register-card {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}

.h2-form {
  text-align: center;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.error-msg {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.75rem;
  border-radius: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
}

.login-section {
  text-align: center;
  margin-top: 0.5rem;
}

.p-text-acc {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.link-secondary {
  font-weight: 600;
  color: var(--color-primary);
}
</style>