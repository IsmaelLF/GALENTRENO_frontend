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

  const dataActual = document.getElementById("current-date");
  if (dataActual) {
    dataActual.textContent = dataActual.dataset.dataFormateada;
  }

  try {
    const resposta = await fetch(`${apiUrl}/api/sesions/recentes`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (resposta.status === 401) {
      await supabase.auth.signOut();
      alert("A túa sesión expirou. Por favor, inicia sesión novamente.");
      window.location.href = "/";
      return;
    }

    const saudo = document.getElementById("user-greeting");

    if (resposta.ok && saudo) {
      const datos = await resposta.json();
      saudo.textContent = `Benvido, ${datos.nome}`;
    }
  } catch (erro) {
  }

  async function cargarPesoHoxe() {
    try {
      const resposta = await fetch(`${apiUrl}/api/peso/hoy`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resposta.status === 401) {
        await supabase.auth.signOut();
        alert("A túa sesión expirou. Por favor, inicia sesión novamente.");
        window.location.href = "/";
        return;
      }

      if (resposta.ok) {
        const datos = await resposta.json();
        const elementoPesoAnterior = document.querySelector("#last-weight");
        const inputPeso = document.getElementById("weight-input");

        if (datos.peso) {
          if (elementoPesoAnterior) {
            elementoPesoAnterior.textContent = `${datos.peso} kg`;
          }
          if (inputPeso) {
            inputPeso.value = datos.peso;
          }
        } else {
          if (elementoPesoAnterior) {
            elementoPesoAnterior.textContent = "Sen datos";
          }
        }
      }
    } catch (erro) {
    }
  }

  const botonGardarPeso = document.getElementById("save-weight-btn");
  const inputPeso = document.getElementById("weight-input");
  const estadoPeso = document.getElementById("weight-status");

  if (botonGardarPeso && inputPeso && estadoPeso) {
    botonGardarPeso.addEventListener("click", async () => {
      const peso = parseFloat(inputPeso.value);

      if (!peso || peso <= 0 || peso > 500) {
        estadoPeso.textContent = "Por favor, introduce un peso válido";
        estadoPeso.className = "weight-status error";
        return;
      }

      botonGardarPeso.textContent = "Gardando...";
      botonGardarPeso.disabled = true;
      estadoPeso.textContent = "";
      estadoPeso.className = "weight-status";

      try {
        const resposta = await fetch(`${apiUrl}/api/peso`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ peso_corporal: peso }),
        });

        if (resposta.status === 401) {
          await supabase.auth.signOut();
          alert("A túa sesión expirou. Por favor, inicia sesión novamente.");
          window.location.href = "/";
          return;
        }

        if (resposta.ok) {
          estadoPeso.textContent = "✓ Peso gardado correctamente";
          estadoPeso.className = "weight-status success";
          await cargarPesoHoxe();
        } else {
          throw new Error("Error ao gardar o peso");
        }
      } catch (erro) {
        estadoPeso.textContent = "✗ Erro ao gardar o peso";
        estadoPeso.className = "weight-status error";
      } finally {
        botonGardarPeso.textContent = "Gardar";
        botonGardarPeso.disabled = false;
      }
    });
  }

  async function cargarEstatisticas() {
    try {
      const resposta = await fetch(`${apiUrl}/api/sesions/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resposta.status === 401) {
        await supabase.auth.signOut();
        alert("A túa sesión expirou. Por favor, inicia sesión novamente.");
        window.location.href = "/";
        return;
      }

      if (resposta.ok) {
        const datos = await resposta.json();

        const elementoTotalAdestramentos =
          document.getElementById("total-trainings");
        const elementoVolumeTotal = document.getElementById("total-volume");
        const elementoAdestramentosSemana =
          document.getElementById("week-trainings");

        if (elementoTotalAdestramentos) {
          elementoTotalAdestramentos.textContent =
            datos.totalAdestramentos || 0;
        }
        if (elementoVolumeTotal) {
          const volume = datos.volumeTotal || 0;
          elementoVolumeTotal.textContent = `${Math.round(volume)} kg`;
        }
        if (elementoAdestramentosSemana) {
          elementoAdestramentosSemana.textContent =
            datos.adestramentsEstaSemana || 0;
        }
      }
    } catch (erro) {
    }
  }

  cargarPesoHoxe();
  cargarEstatisticas();
});
