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

  const listaPlans = document.getElementById("plans-list");
  const modal = document.getElementById("plan-modal");
  const botonPechar = document.getElementById("close-modal");
  const nomePlanModal = document.getElementById("modal-plan-name");
  const detallePlanModal = document.getElementById("modal-plan-detail");
  const botonIniciar = document.getElementById("start-training-btn");
  const selectorDia = document.getElementById("day-select");

  let planActualId = null;

  function pecharModal() {
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  function abrirModal() {
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  async function cargarDetallesPlan(planId) {
    planActualId = planId;

    if (!detallePlanModal || !nomePlanModal) return;

    detallePlanModal.innerHTML = "<p>Cargando detalle do plan...</p>";
    abrirModal();

    try {
      const resposta = await fetch(`${apiUrl}/api/plans/${planId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resposta.ok) throw new Error("Non se puido cargar o plan");

      const plan = await resposta.json();

      nomePlanModal.textContent = plan.nome;

      let htmlDetalle = "";

      if (plan.descricion) {
        htmlDetalle += `<p style="margin-bottom: var(--spacing-lg); color: var(--color-text-muted);">${plan.descricion}</p>`;
      }

      if (plan.dias && plan.dias.length > 0) {
        plan.dias.forEach((dia) => {
          let htmlExercicios = "";
          if (dia.exercicios && dia.exercicios.length > 0) {
            dia.exercicios.forEach((ex) => {
              htmlExercicios += `<li>${ex.nome_exercicio} - ${ex.series} series × ${ex.repeticions} reps</li>`;
            });
          } else {
            htmlExercicios = "<li>Sen exercicios asignados</li>";
          }

          htmlDetalle += `
                <div class="dia-card">
                  <h3>${dia.nome_dia}</h3>
                  <ul>${htmlExercicios}</ul>
                </div>
              `;
        });
      } else {
        htmlDetalle += "<p>Este plan non ten días configurados.</p>";
      }

      detallePlanModal.innerHTML = htmlDetalle;

      if (selectorDia) {
        selectorDia.innerHTML = '<option value="">Escolle un día...</option>';

        if (plan.dias && plan.dias.length > 0) {
          plan.dias.forEach((dia) => {
            const opcion = document.createElement("option");
            opcion.value = dia.id;
            opcion.textContent = dia.nome_dia;
            selectorDia.appendChild(opcion);
          });
        }

        selectorDia.disabled = false;
      }
    } catch (erro) {
      console.error(erro);
      detallePlanModal.innerHTML = "<p>Erro ao cargar os detalles do plan.</p>";
    }
  }

  try {
    const resposta = await fetch(`${apiUrl}/api/plans/creados`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resposta.ok) throw new Error("Non se puideron cargar os plans");
    if (!listaPlans) return;

    const plans = await resposta.json();
    listaPlans.innerHTML = "";

    if (plans.length === 0) {
      listaPlans.innerHTML = "<p>Aínda non creaches ningún plan persoal.</p>";
    } else {
      plans.forEach((plan) => {
        const tarxeta = document.createElement("div");
        tarxeta.className = "plan-card";
        tarxeta.setAttribute("role", "button");
        tarxeta.setAttribute("tabindex", "0");
        tarxeta.setAttribute("aria-label", `Ver detalles do plan ${plan.nome}`);

        const numDias = plan.dias?.length || 0;
        const numExercicios =
          plan.dias?.reduce(
            (total, dia) => total + (dia.exercicios?.length || 0),
            0
          ) || 0;

        tarxeta.innerHTML = `
              <h3>${plan.nome}</h3>
              <p>${plan.descricion || "Sen descrición"}</p>
              <div class="plan-card-footer">
                <span>${numDias} día${numDias !== 1 ? "s" : ""}</span>
                <span>${numExercicios} exercicio${
          numExercicios !== 1 ? "s" : ""
        }</span>
              </div>
            `;

        tarxeta.addEventListener("click", () => cargarDetallesPlan(plan.id));

        tarxeta.addEventListener("keypress", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            cargarDetallesPlan(plan.id);
          }
        });

        listaPlans.appendChild(tarxeta);
      });
    }
  } catch (erro) {
    console.error(erro);
    if (listaPlans)
      listaPlans.innerHTML = "<p>Erro ao cargar os teus plans.</p>";
  }

  if (botonPechar) {
    botonPechar.addEventListener("click", pecharModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        pecharModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("active")) {
      pecharModal();
    }
  });

  if (selectorDia) {
    selectorDia.addEventListener("change", () => {
      if (botonIniciar) {
        botonIniciar.disabled = !selectorDia.value;
      }
    });
  }

  if (botonIniciar) {
    botonIniciar.addEventListener("click", () => {
      const diaSeleccionadoId = selectorDia?.value;
      if (planActualId && diaSeleccionadoId) {
        window.location.href = `/adestramento/${planActualId}?dia=${diaSeleccionadoId}`;
      }
    });
  }
});
