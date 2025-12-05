// On attend que le DOM soit chargé
document.addEventListener("DOMContentLoaded", () => {
  // ========================
  // 1. PHASES & NAVIGATION
  // ========================

  const phases = ["intro", "step1", "level1", "qcm2", "level2", "level3"];
  let currentPhase = 0;

  // Liens Décathlon
  const liensDecathlon = [
    "https://www.decathlon.fr/p/chaussures-de-running-homme-kiprun-kf-light-noir/_/R-p-324921",
    "https://www.decathlon.fr/p/tapis-de-course-domyos-tf1/_/R-p-309842",
    "https://www.decathlon.fr/p/halteres-musculation-domyos-5kg-x2/_/R-p-356724",
    "https://www.decathlon.fr/p/gants-fitness-pvc-domyos/_/R-p-678532"
  ];

  // Fonction qui ajoute le bouton Décathlon à la fin de level3
  function createDecathlonButton() {
    // Ne pas recréer si déjà là
    if (document.getElementById("btnDecathlon")) return;

    const container = document.querySelector("#level3 .dialogue:last-of-type");
    if (!container) return;

    const btnDecathlon = document.createElement("button");
    btnDecathlon.id = "btnDecathlon";
    btnDecathlon.textContent = "Mon équipement conseillé Decathlon 🏋️";
    btnDecathlon.classList.add("decathlon-link");

    btnDecathlon.addEventListener("click", () => {
      const lien = liensDecathlon[Math.floor(Math.random() * liensDecathlon.length)];
      window.open(lien, "_blank");
    });

    // Ajoute le bouton juste après la phrase du Coach
    container.insertAdjacentElement("afterend", btnDecathlon);
  }

  // Gestion des boutons "Passer à la phase suivante"
  document.querySelectorAll(".fleche-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const currentId = phases[currentPhase];
      const currentEl = document.getElementById(currentId);
      if (currentEl) currentEl.style.display = "none";

      currentPhase++;

      if (currentPhase < phases.length) {
        const nextId = phases[currentPhase];
        const nextElement = document.getElementById(nextId);
        if (nextElement) nextElement.style.display = "block";

        // Si on arrive à level3 → bouton Decathlon
        if (nextId === "level3") {
          createDecathlonButton();
        }
      } else {
        alert("Toutes les phases sont terminées !");
      }
    });
  });

  // ========================
  // 2. QCM : rendre les réponses actives
  // ========================

  const btnEtape1 = document.querySelectorAll(".q1");
  const btnEtape2 = document.querySelectorAll(".q2");

  // Pour chaque bloc de question .q1
  btnEtape1.forEach((block) => {
    const buttons = block.querySelectorAll("button");
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        buttons.forEach((b) => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
      });
    });
  });

  // Pour chaque bloc de question .q2
  btnEtape2.forEach((block) => {
    const buttons = block.querySelectorAll("button");
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        buttons.forEach((b) => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
      });
    });
  });

  // ========================
  // 3. CLICKER DÉCHARGE (Etape 2)
  // ========================

  const btnsTrash1 = document.getElementById("btnTrash1"); 
  const btnsTrash2 = document.getElementById("btnTrash2"); 
  const btnsTrash3 = document.getElementById("btnTrash3"); 

  const userScoreElement = document.getElementById("score1");
  let scoreClicker = 0;

  if (userScoreElement) {
    userScoreElement.textContent = scoreClicker;
  }

  function clickTrash() {
    if (scoreClicker < 10) {
      scoreClicker += 1;
      if (userScoreElement) {
        userScoreElement.textContent = scoreClicker;
      }
    }
  }

  if (btnsTrash1) btnsTrash1.addEventListener("click", clickTrash);
  if (btnsTrash2) btnsTrash2.addEventListener("click", clickTrash);
  if (btnsTrash3) btnsTrash3.addEventListener("click", clickTrash);

  // ========================
  // 4. ASSEMBLAGE COMPOSANTS (Etape 3)
  // ========================

  const componentItems = document.querySelectorAll(".component-item");
  const pcCase = document.getElementById("pc-case");

  if (pcCase && componentItems.length > 0) {
    componentItems.forEach((item) => {
      item.addEventListener("click", () => {
        const clone = item.cloneNode(true);
        clone.classList.remove("component-item");
        clone.style.cursor = "default";
        clone.style.borderColor = "#0f0";
        pcCase.appendChild(clone);
      });
    });
  }
});

