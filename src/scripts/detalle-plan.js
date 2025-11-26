import { supabase } from "../lib/supabase.js";

const apiUrl = "https://galentreno-backend.onrender.com";

export async function initPlanDetail(planId) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "/";
    return;
  }

  const token = session.access_token;
  const planDetail = document.getElementById("plan-detail");
  const addButton = document.getElementById("add-plan-button");

  try {
    const response = await fetch(`${apiUrl}/api/plans/predefinidos/${planId}`);
    if (!response.ok) throw new Error("Plan non atopado");

    const plan = await response.json();

    planDetail.innerHTML = `
      <h2>${plan.nome}</h2>
      <p>${plan.descricion}</p>
      <hr>
    `;

    plan.dias.forEach((dia) => {
      const diaEx = document.createElement("div");
      diaEx.className = "dia-card";

      let exerciciosHtml = "";
      dia.exercicios.forEach((ex) => {
        exerciciosHtml += `<li>${ex.nome_exercicio} (${ex.series} x ${ex.repeticions})</li>`;
      });

      diaEx.innerHTML = `
        <h3>${dia.nome_dia}</h3>
        <ul>${exerciciosHtml}</ul>
      `;
      planDetail.appendChild(diaEx);
    });
  } catch (error) {
    console.error("Error:", error);
    planDetail.innerHTML = "<p>Erro ao cargar o plan.</p>";
  }

  if (addButton) {
    addButton.addEventListener("click", async () => {
      addButton.textContent = "Engadindo...";
      addButton.disabled = true;

      try {
        const response = await fetch(`${apiUrl}/api/plans/${planId}/copy`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          await supabase.auth.signOut();
          alert("A túa sesión expirou. Por favor, inicia sesión novamente.");
          window.location.href = "/";
          return;
        }

        if (response.ok) {
          await response.json();
          addButton.textContent = "✓ Engadido!";
          addButton.style.backgroundColor = "var(--color-success, #10b981)";

          setTimeout(() => {
            window.location.href = "/meus-plans";
          }, 1500);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Non se puido engadir o plan");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Houbo un erro ao engadir o plan: " + error.message);
        addButton.textContent = "Engadir aos meus plans";
        addButton.disabled = false;
      }
    });
  }
}
