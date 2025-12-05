// Liste des phases dans l'ordre
const phases = ["intro", "step1", "level1", "qcm2", "level2", "level3"];
let currentPhase = 0;

// Sélectionne tous les boutons "fleche-btn"
document.querySelectorAll(".fleche-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Cache la phase actuelle
    const current = phases[currentPhase];
    document.getElementById(current).style.display = "none";

    // Passe à la phase suivante si elle existe
    currentPhase++;
    if (currentPhase < phases.length) {
      const next = phases[currentPhase];
      document.getElementById(next).style.display = "block";

      // stockage des donnée

      const btnEtape1 = document.querySelectorAll(".q1");
      // .querySelectorAll("button");
      const btnEtape2 = document.querySelectorAll(".q2");

      for (let i = 0; i < btnEtape1.length; i++) {
        const elements = btnEtape1[i].querySelectorAll("button");
        for (let j = 0; j < elements.length; j++) {
          const element = elements[j];
          element.addEventListener("click", (e) => {
            e.currentTarget.classList.add("active");
          });
        }
      }

      for (let i = 0; i < btnEtape2.length; i++) {
        const elements = btnEtape2[i].querySelectorAll("button");
        for (let j = 0; j < elements.length; j++) {
          const element = elements[j];
          element.addEventListener("click", (e) => {
            e.currentTarget.classList.add("active");
          });
        }
      }
    } else {
      // Si plus de phase, on peut afficher un message ou revenir au début
      alert("Toutes les phases sont terminées !");
    }
  });
});

const btnsTrash1 = document.getElementById("btnTrash1"); // bouton principal du clicker
const btnsTrash2 = document.getElementById("btnTrash2"); // bouton principal du clicker
const btnsTrash3 = document.getElementById("btnTrash3"); // bouton principal du clicker

const upgradeBtn = document.getElementById("upgradeBtn"); // bouton d'amélioration
const userScoreElement = document.getElementById("score1");

let scoreClicker = 0; //score de l'utilisateur

userScoreElement.textContent = scoreClicker; // affichage du score dès le chargement de la page

btnsTrash1.addEventListener("click", click);
btnsTrash2.addEventListener("click", click);
btnsTrash3.addEventListener("click", click);

function click() {
  if (scoreClicker < 10) {
    // detection du clique sur le bouton principale
    scoreClicker += 1; //incrementation du score
    userScoreElement.textContent = scoreClicker; //affichage du score
  }
}
