<script>
export default {
    data(){
        return {
            nome: '',
            correo: '',
            contrasinal: '',
            isLoading: false,
            errorMessage: '',
        };
    },
    methods: {
        async handleRegister(){
            this.isLoading = true;
            this.errorMessage = '';

            try {
                const response = await fetch('http://localhost:3000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome: this.nome, email: this.correo, contrasinal: this.contrasinal }),
                });

                if (response.ok) {
                    window.location.href = '/login';
                } else {
                    const errorData = await response.json();
                    this.errorMessage = errorData.error || 'Erro ao rexistrar. Tente de novo.';
                }
            } catch (error) {
                this.errorMessage = 'Error de conexión con o servidor.';
            } finally {
                this.isLoading = false;
            }
        }
    }
}

</script>
<template>
    <form @submit.prevent="handleRegister">
        <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>

        <div>
            <label for="nome">Nome:</label>
            <input type="text" id="nome" v-model="nome" required>
        </div>

        <div>
            <label for="email">Correo:</label>
            <input type="email" id="email" v-model="correo" required>
        </div>

        <div>
            <label for="password">Contrasinal</label>
            <input type="password" id="password" v-model="contrasinal" required>
        </div>

<button type="submit" class="button button-register" :disabled="isLoading">
            <span v-if="isLoading">Cargando...</span>
            <span v-else>Rexistrar</span>
        </button>
    </form>
</template>
<style scoped>
.button-register{
    width: 75% !important;
}
</style>