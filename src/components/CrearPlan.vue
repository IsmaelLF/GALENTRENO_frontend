<script>
export default {
  data() {
    return {
      planNome: '',
      planDescricion: '',
      exercicios: [
        { exercicio_id: null, series: 3, repeticions: 10, peso: 0 }
      ],
      todosExercicios: [],
      isLoading: false,
      errorMessage: '',
    };
  },
  async mounted() {
    await this.fetchExercicios();
  },
  methods: {
    async fetchExercicios() {
      const token = localStorage.getItem('jwt_token');
      const apiUrl = import.meta.env.PUBLIC_API_URL || "https://galentreno.vercel.app";
      try {
        const response = await fetch(`${apiUrl}/api/exercicios`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Non se puideron cargar os exercicios');
        this.todosExercicios = await response.json();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    addExercicio() {
      this.exercicios.push({ exercicio_id: null, series: 3, repeticions: 10, peso: 0 });
    },
    removeExercicio(index) {
      this.exercicios.splice(index, 1);
    },
    async handleSubmit() {
      this.isLoading = true;
      this.errorMessage = '';
      const token = localStorage.getItem('jwt_token');
      const apiUrl = import.meta.env.PUBLIC_API_URL || "https://galentreno.vercel.app";

      try {
        const response = await fetch(`${apiUrl}/api/plans/novo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            nome: this.planNome,
            descricion: this.planDescricion,
            exercicios: this.exercicios
          })
        });

        if (response.ok) {
          alert('Plan creado con éxito!');
          window.location.href = '/meus-plans';
        } else {
          const errorData = await response.json();
          this.errorMessage = errorData.error || 'Non se puido crear o plan.';
        }
      } catch (error) {
        this.errorMessage = 'Erro de conexión ao crear o plan.';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="create-plan-form">
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>

    <div>
      <label for="planNome">Nome do Plan:</label>
      <input type="text" id="planNome" v-model="planNome" required>
    </div>

    <div>
      <label for="planDescricion">Descrición (opcional):</label>
      <input type="text" id="planDescricion" v-model="planDescricion">
    </div>

    <hr>
    <h3>Exercicios</h3>

    <div v-for="(exercicio, index) in exercicios" :key="index" class="exercicio-fila">
      <select v-model="exercicio.exercicio_id" required>
        <option :value="null" disabled>Selecciona un exercicio...</option>
        <option v-for="ex in todosExercicios" :key="ex.id" :value="ex.id">
          {{ ex.nome }} ({{ ex.grupo_muscular }})
        </option>
      </select>
      <input type="number" v-model.number="exercicio.series" placeholder="Series" min="1">
      <input type="number" v-model.number="exercicio.repeticions" placeholder="Repeticións" min="1">
      <input type="number" v-model.number="exercicio.peso" placeholder="Peso (kg)" min="0">
      <button type="button" @click="removeExercicio(index)" class="button-remove">X</button>
    </div>

    <button type="button" @click="addExercicio" class="button button-secondary">
      + Engadir Exercicio
    </button>

    <button type="submit" :disabled="isLoading" class="button button-primary">
      <span v-if="isLoading">Gardando...</span>
      <span v-else>Crear Plan</span>
    </button>
  </form>
</template>

<style>
  .create-plan-form { display: flex; flex-direction: column; gap: 1rem; }
  .exercicio-fila { display: grid; grid-template-columns: 3fr 1fr 1fr 1fr auto; gap: 0.5rem; align-items: center; }
  .button-remove { background-color: #ff5630; color: white; border: none; border-radius: 8px; cursor: pointer; }
</style>
