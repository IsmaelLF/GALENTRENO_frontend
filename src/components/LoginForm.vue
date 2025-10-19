<script>
export default {
  data() {
    return {
      email: '',
      password: '',
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
          body: JSON.stringify({ email: this.email, contrasinal: this.password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('jwt_token', data.token);
          window.location.href = '/home';
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
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required>
    </div>
    
    <div>
      <label for="password">Contraseña:</label>
      <input type="password" id="password" v-model="password" required>
    </div>
    
    <button type="submit" :disabled="isLoading">
      <span v-if="isLoading">Cargando...</span>
      <span v-else>Iniciar Sesión</span>
    </button>
  </form>
</template>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>