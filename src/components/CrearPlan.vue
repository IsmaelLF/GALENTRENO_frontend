<script>
import { supabase } from '../lib/supabase.js';
export default {
  data() {
    return {
      planNome: '',
      planDescricion: '',
      dias: [
        {
          nome_dia: 'Día 1',
          exercicios: [
            { exercicio_id: null, series: null, repeticions: null, peso: null }
          ]
        }
      ],
      todosExercicios: [],
      estaCargando: false,
      mensaxeErro: '',
    };
  },
  async mounted() {
    await this.cargarExercicios();
  },
  methods: {
    async cargarExercicios() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/';
        return;
      }

      const token = session.access_token;
      // @ts-expect-error
      const urlApi = import.meta.env.PUBLIC_API_URL;
      try {
        const resposta = await fetch(`${urlApi}/api/exercicios`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resposta.ok) throw new Error('Non se puideron cargar os exercicios');
        this.todosExercicios = await resposta.json();
      } catch (erro) {
        this.mensaxeErro = erro.message;
      }
    },
    engadirDia() {
      const numDia = this.dias.length + 1;
      this.dias.push({
        nome_dia: `Día ${numDia}`,
        exercicios: [
          { exercicio_id: null, series: null, repeticions: null, peso: null }
        ]
      });
    },
    eliminarDia(indice) {
      if (this.dias.length > 1) {
        this.dias.splice(indice, 1);
      }
    },
    engadirExercicio(indiceDia) {
      this.dias[indiceDia].exercicios.push({
        exercicio_id: null,
        series: null,
        repeticions: null,
        peso: null
      });
    },
    eliminarExercicio(indiceDia, indiceExercicio) {
      if (this.dias[indiceDia].exercicios.length > 1) {
        this.dias[indiceDia].exercicios.splice(indiceExercicio, 1);
      }
    },
    async manexarEnvio() {
      this.estaCargando = true;
      this.mensaxeErro = '';

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/';
        return;
      }

      const token = session.access_token;
      // @ts-expect-error
      const urlApi = import.meta.env.PUBLIC_API_URL;

      try {
        const resposta = await fetch(`${urlApi}/api/plans/novo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            nome: this.planNome,
            descricion: this.planDescricion,
            dias: this.dias
          })
        });

        if (resposta.ok) {
          alert('Plan creado con éxito!');
          window.location.href = '/meus-plans';
        } else {
          const datosErro = await resposta.json();
          this.mensaxeErro = datosErro.error || 'Non se puido crear o plan.';
        }
      } catch (erro) {
        this.mensaxeErro = 'Erro de conexión ao crear o plan.';
      } finally {
        this.estaCargando = false;
      }
    }
  }
};
</script>

<template>
  <form @submit.prevent="manexarEnvio" class="create-plan-form">
    <p v-if="mensaxeErro" style="color: red;">{{ mensaxeErro }}</p>

    <div>
      <label for="planNome">Nome do Plan:</label>
      <input type="text" id="planNome" v-model="planNome" required>
    </div>

    <div>
      <label for="planDescricion">Descrición (opcional):</label>
      <input type="text" id="planDescricion" v-model="planDescricion">
    </div>

    <hr>
    <div class="dias-header">
      <h3>Días de Adestramento</h3>
      <button type="button" @click="engadirDia" class="button button-secondary">
        + Engadir Día
      </button>
    </div>

    <div v-for="(dia, indiceDia) in dias" :key="indiceDia" class="dia-section">
      <div class="dia-header">
        <input
          type="text"
          v-model="dia.nome_dia"
          placeholder="Nome do día"
          class="dia-nombre-input"
          required
        >
        <button
          type="button"
          @click="eliminarDia(indiceDia)"
          class="button-remove"
          :disabled="dias.length === 1"
        >
          X
        </button>
      </div>

      <div class="exercicios-container">
        <h4>Exercicios para {{ dia.nome_dia }}</h4>

        <div v-for="(exercicio, indiceExercicio) in dia.exercicios" :key="indiceExercicio" class="exercicio-fila">
          <div class="input-group">
            <label class="input-label">Exercicio</label>
            <select v-model="exercicio.exercicio_id" required>
              <option :value="null" disabled>Selecciona un exercicio...</option>
              <option v-for="ex in todosExercicios" :key="ex.id" :value="ex.id">
                {{ ex.nome }} ({{ ex.grupo_muscular }})
              </option>
            </select>
          </div>
          <div class="input-group">
            <label class="input-label">Series</label>
            <input type="number" v-model.number="exercicio.series" placeholder="Series" min="1" required>
          </div>
          <div class="input-group">
            <label class="input-label">Repeticións</label>
            <input type="number" v-model.number="exercicio.repeticions" placeholder="Repeticións" min="1" required>
          </div>
          <div class="input-group">
            <label class="input-label">Peso (kg)</label>
            <input type="number" v-model.number="exercicio.peso" placeholder="Peso" min="0" step="0.5" required>
          </div>
          <button
            type="button"
            @click="eliminarExercicio(indiceDia, indiceExercicio)"
            class="button-remove"
            :disabled="dia.exercicios.length === 1"
          >
            X
          </button>
        </div>

        <button
          type="button"
          @click="engadirExercicio(indiceDia)"
          class="button button-tertiary"
        >
          + Engadir Exercicio a este día
        </button>
      </div>
    </div>

    <button type="submit" :disabled="estaCargando" class="button button-primary">
      <span v-if="estaCargando">Gardando...</span>
      <span v-else>Crear Plan</span>
    </button>
  </form>
</template>

<style>
  .create-plan-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .dias-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .dia-section {
    background-color: #2a2a2e;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    border: 2px solid #444;
  }

  .dia-header {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
  }

  .dia-nombre-input {
    flex: 1;
    font-size: 1.1rem;
    font-weight: 600;
    padding: 0.5rem;
    background-color: #333;
    color: #fff;
    border: 1px solid #555;
    border-radius: 8px;
  }

  .exercicios-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .exercicios-container h4 {
    color: #0d6efd;
    margin: 0.5rem 0;
  }

  .exercicio-fila {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr auto;
    gap: 0.75rem;
    align-items: end;
    background-color: #1a1a1e;
    padding: 0.75rem;
    border-radius: 8px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .input-label {
    font-size: 0.75rem;
    color: #aaa;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .exercicio-fila input,
  .exercicio-fila select {
    padding: 0.75rem;
    font-size: 1rem;
    background-color: #333;
    color: #fff;
    border: 1px solid #555;
    border-radius: 8px;
    width: 100%;
  }

  .button-remove {
    background-color: #ff5630;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    padding: 0.5rem 0.75rem;
    min-width: 40px;
  }

  .button-remove:disabled {
    background-color: #666;
    cursor: not-allowed;
    opacity: 0.5;
  }

  .button-tertiary {
    background-color: #28a745;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 0.5rem;
  }

  .button-tertiary:hover {
    background-color: #218838;
  }

  @media (max-width: 768px) {
    .exercicio-fila {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .dia-section {
      padding: 1rem;
    }

    .button-remove {
      width: 100%;
      margin-top: 0.5rem;
    }
  }
</style>
