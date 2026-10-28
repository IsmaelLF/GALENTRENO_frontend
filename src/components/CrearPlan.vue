<script>
import { supabase } from "../lib/supabase.js";

export default {
  data() {
    return {
      planNome: "",
      planDescricion: "",
      dias: [
        {
          nome_dia: "Día 1",
          exercicios: [
            { exercicio_id: null, series: null, repeticions: null, peso: null },
          ],
        },
      ],
      todosExercicios: [],
      estaCargando: false,
      planCreado: false,
      mensaxeErro: "",
    };
  },
  async mounted() {
    await this.cargarExercicios();
  },
  methods: {
    async cargarExercicios() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/";
        return;
      }

      const token = session.access_token;
      const urlApi = import.meta.env.PUBLIC_API_URL;
      try {
        const resposta = await fetch(`${urlApi}/api/exercicios`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resposta.status === 401) {
          await supabase.auth.signOut();
          alert("A túa sesión expirou. Por favor, inicia sesión novamente.");
          window.location.href = "/";
          return;
        }
        if (!resposta.ok)
          throw new Error("Non se puideron cargar os exercicios");
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
          { exercicio_id: null, series: null, repeticions: null, peso: null },
        ],
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
        peso: null,
      });
    },
    eliminarExercicio(indiceDia, indiceExercicio) {
      if (this.dias[indiceDia].exercicios.length > 1) {
        this.dias[indiceDia].exercicios.splice(indiceExercicio, 1);
      }
    },
    async manexarEnvio() {
      this.estaCargando = true;
      this.mensaxeErro = "";

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/";
        return;
      }

      const token = session.access_token;
      const urlApi = import.meta.env.PUBLIC_API_URL;

      try {
        const resposta = await fetch(`${urlApi}/api/plans/novo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome: this.planNome,
            descricion: this.planDescricion,
            dias: this.dias,
          }),
        });

        if (resposta.status === 401) {
          await supabase.auth.signOut();
          alert("A túa sesión expirou. Por favor, inicia sesión novamente.");
          window.location.href = "/";
          return;
        }

        if (resposta.ok) {
          this.planCreado = true;
          this.estaCargando = false;
          setTimeout(() => {
            window.location.href = "/meus-plans";
          }, 1500);
        } else {
          const datosErro = await resposta.json();
          this.mensaxeErro = datosErro.error || "Non se puido crear o plan.";
          this.estaCargando = false;
        }
      } catch (erro) {
        this.mensaxeErro = "Erro de conexión ao crear o plan.";
        this.estaCargando = false;
      }
    },
  },
};
</script>

<template>
  <form @submit.prevent="manexarEnvio" class="create-plan-form">
    <p v-if="mensaxeErro" class="error-banner">{{ mensaxeErro }}</p>

    <div class="plan-meta-grid">
      <div>
        <label for="planNome">Nome do Plan</label>
        <input
          type="text"
          id="planNome"
          v-model="planNome"
          placeholder="Ex: Forza e Hipertrofia 4 Días"
          required
        />
      </div>

      <div>
        <label for="planDescricion">Descrición (opcional)</label>
        <input
          type="text"
          id="planDescricion"
          v-model="planDescricion"
          placeholder="Ex: Rutina torso-perna enfocada en básicos"
        />
      </div>
    </div>

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
        />
        <button
          type="button"
          @click="eliminarDia(indiceDia)"
          class="button-remove"
          :disabled="dias.length === 1"
          aria-label="Eliminar día"
        >
          ✕
        </button>
      </div>

      <div class="exercicios-container">
        <h4>Exercicios para {{ dia.nome_dia }}</h4>

        <div
          v-for="(exercicio, indiceExercicio) in dia.exercicios"
          :key="indiceExercicio"
          class="exercicio-fila"
        >
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
            <input
              type="number"
              v-model.number="exercicio.series"
              placeholder="4"
              min="1"
              required
            />
          </div>
          <div class="input-group">
            <label class="input-label">Repeticións</label>
            <input
              type="number"
              v-model.number="exercicio.repeticions"
              placeholder="10"
              min="1"
              required
            />
          </div>
          <div class="input-group">
            <label class="input-label">Peso (kg)</label>
            <input
              type="number"
              v-model.number="exercicio.peso"
              placeholder="60"
              min="0"
              step="0.5"
              required
            />
          </div>
          <button
            type="button"
            @click="eliminarExercicio(indiceDia, indiceExercicio)"
            class="button-remove"
            :disabled="dia.exercicios.length === 1"
            aria-label="Eliminar exercicio"
          >
            ✕
          </button>
        </div>

        <button
          type="button"
          @click="engadirExercicio(indiceDia)"
          class="button-add-exercise"
        >
          + Engadir Exercicio a {{ dia.nome_dia }}
        </button>
      </div>
    </div>

    <button
      type="submit"
      :disabled="estaCargando || planCreado"
      class="button submit-plan-btn"
      :class="{ 'plan-creado': planCreado }"
    >
      <span v-if="planCreado">✓ Plan Creado!</span>
      <span v-else-if="estaCargando">Gardando...</span>
      <span v-else>Gardar Plan Completo</span>
    </button>
  </form>
</template>

<style scoped>
.create-plan-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 100%;
}

.error-banner {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #fca5a5;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-md);
  margin: 0;
}

.plan-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.dias-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.dias-header h3 {
  margin: 0;
}

.dia-section {
  background: rgba(15, 23, 42, 0.65);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.dia-header {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.25rem;
}

.dia-nombre-input {
  flex: 1;
  font-size: 1.05rem;
  font-weight: 700;
}

.exercicios-container {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.exercicios-container h4 {
  color: var(--color-primary);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.exercicio-fila {
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr 1fr auto;
  gap: 0.75rem;
  align-items: end;
  background: rgba(9, 13, 22, 0.6);
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.input-label {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.button-remove {
  background: rgba(239, 68, 68, 0.14);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-md);
  cursor: pointer;
  height: 42px;
  width: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.button-remove:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.28);
  border-color: rgba(239, 68, 68, 0.55);
}

.button-remove:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.button-add-exercise {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  border: 1px dashed rgba(59, 130, 246, 0.4);
  padding: 0.7rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.button-add-exercise:hover {
  background: rgba(59, 130, 246, 0.18);
  border-color: var(--color-primary);
}

.submit-plan-btn {
  align-self: flex-end;
  min-width: 240px;
}

.plan-creado {
  background: var(--color-success) !important;
}

@media (max-width: 768px) {
  .exercicio-fila {
    grid-template-columns: 1fr 1fr;
  }

  .exercicio-fila .input-group:first-child {
    grid-column: 1 / -1;
  }

  .exercicio-fila .button-remove {
    grid-column: 1 / -1;
    width: 100%;
  }

  .submit-plan-btn {
    width: 100%;
  }
}
</style>