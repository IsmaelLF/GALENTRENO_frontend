<script>
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
    async handleRegister() {
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(this.correo)) {
        this.errorMessage =
          "Por favor, introduce un formato de correo electrónico válido.";
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
    <form @submit.prevent="handleRegister">
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
        <input type="password" id="password" v-model="contrasinal" required />
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