<script>
export default {
  data() {
    return {
      correo: '',
      contrasinal: '',
      isLoading: false,
      errorMessage: '',
    };
  },

  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
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
  },
};
</script>

<template>
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
  </form>
</template>

<style scoped>
.button-login{
  width: 75% !important;
}
</style>