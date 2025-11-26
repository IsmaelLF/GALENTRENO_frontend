import { supabase } from "../lib/supabase.js";

const apiUrl = "https://galentreno-backend.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "/";
    return;
  }

  const token = session.access_token;
  const planId = window.location.pathname.split("/").pop();
  const parametrosUrl = new URLSearchParams(window.location.search);
  const diaSeleccionadoId = parametrosUrl.get("dia");

  if (!diaSeleccionadoId) {
    window.location.href = "/meus-plans";
    return;
  }

  const contidoAdestramento = document.getElementById("training-content");
  const elementoNomePlan = document.getElementById("plan-name");
  const elementoDescPlan = document.getElementById("plan-description");
  const botonFinalizar = document.getElementById("finish-training-btn");
  const botonCancelar = document.getElementById("cancel-training-btn");

  let datosPlan = null;
  let diaSeleccionado = null;

  try {
    const resposta = await fetch(`${apiUrl}/api/plans/${planId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (resposta.status === 401) {
      await supabase.auth.signOut();
      alert("A túa sesión expirou. Por favor, inicia sesión novamente.");
      window.location.href = "/";
      return;
    }

    if (!resposta.ok) throw new Error("Non se puido cargar o plan");

    datosPlan = await resposta.json();

    diaSeleccionado = datosPlan.dias.find((d) => d.id == diaSeleccionadoId);

    if (!diaSeleccionado) {
      throw new Error("Día non atopado");
    }

    if (elementoNomePlan)
      elementoNomePlan.textContent = `${datosPlan.nome} - ${diaSeleccionado.nome_dia}`;
    if (elementoDescPlan)
      elementoDescPlan.textContent = datosPlan.descricion || "";

    renderizarAdestramento(diaSeleccionado);

    if (botonFinalizar) botonFinalizar.disabled = false;
  } catch (erro) {
    if (contidoAdestramento) {
      contidoAdestramento.innerHTML = "<p>Erro ao cargar o plan.</p>";
    }
  }

  function renderizarAdestramento(dia) {
    if (!contidoAdestramento) return;

    let html = "";

    if (dia.exercicios && dia.exercicios.length > 0) {
      dia.exercicios.forEach((ex, indiceEx) => {
        html += `
          <div class="exercicio-card" data-dia-id="${dia.id}" data-exercicio-index="${indiceEx}">
            <h3>${ex.nome_exercicio}</h3>
            <p class="exercicio-info">
              ${ex.series} series × ${ex.repeticions} repeticions @ ${ex.peso} kg
            </p>
            <div class="series-container">
        `;

        for (let i = 1; i <= ex.series; i++) {
          html += `
            <div class="serie-row">
              <span class="serie-label">Serie ${i}</span>
              <div class="input-group-inline">
                <label>Repeticions</label>
                <input
                  type="number"
                  class="reps-input"
                  data-serie="${i}"
                  value="${ex.repeticions}"
                  min="0"
                  required
                >
              </div>
              <div class="input-group-inline">
                <label>Peso (kg)</label>
                <input
                  type="number"
                  class="weight-input"
                  data-serie="${i}"
                  value="${ex.peso}"
                  min="0"
                  step="0.5"
                  required
                >
              </div>
            </div>
          `;
        }

        html += `
            </div>
          </div>
        `;
      });
    } else {
      html = "<p>Este día non ten exercicios asignados.</p>";
    }

    contidoAdestramento.innerHTML = html;
  }

  if (botonCancelar) {
    botonCancelar.addEventListener("click", () => {
      if (confirm("Seguro que queres cancelar o adestramento?")) {
        window.location.href = "/meus-plans";
      }
    });
  }

  if (botonFinalizar) {
    botonFinalizar.addEventListener("click", async () => {
      botonFinalizar.disabled = true;
      botonFinalizar.textContent = "Gardando...";

      try {
        const datosAdestramento = recollerDatosAdestramento();

        const resposta = await fetch(`${apiUrl}/api/sesions/nova`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan_id: planId,
            exercicios: datosAdestramento,
          }),
        });

        if (resposta.status === 401) {
          await supabase.auth.signOut();
          alert("A túa sesión expirou. Por favor, inicia sesión novamente.");
          window.location.href = "/";
          return;
        }

        if (resposta.ok) {
          botonFinalizar.textContent = "✓ Gardado!";
          botonFinalizar.style.backgroundColor =
            "var(--color-success, #10b981)";

          setTimeout(() => {
            window.location.href = "/inicio";
          }, 1500);
        } else {
          throw new Error("Non se puido gardar o adestramento");
        }
      } catch (erro) {
        alert("Erro ao gardar o adestramento: " + erro.message);
        botonFinalizar.disabled = false;
        botonFinalizar.textContent = "Finalizar Adestramento";
      }
    });
  }

  function recollerDatosAdestramento() {
    const tarxetasExercicio = document.querySelectorAll(".exercicio-card");
    const datos = [];

    tarxetasExercicio.forEach((tarxeta) => {
      const diaId = tarxeta.dataset.diaId;
      const indiceExercicio = parseInt(tarxeta.dataset.exercicioIndex);

      const dia = datosPlan.dias.find((d) => d.id == diaId);
      const exercicio = dia.exercicios[indiceExercicio];

      const series = [];
      const filasSerie = tarxeta.querySelectorAll(".serie-row");

      filasSerie.forEach((fila) => {
        const inputReps = fila.querySelector(".reps-input");
        const inputPeso = fila.querySelector(".weight-input");

        series.push({
          repeticions: parseInt(inputReps.value) || 0,
          peso: parseFloat(inputPeso.value) || 0,
        });
      });

      datos.push({
        exercicio_id: exercicio.exercicio_id,
        series: series,
      });
    });

    return datos;
  }
});
