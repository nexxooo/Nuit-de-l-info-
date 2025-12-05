const intro = document.getElementById("intro");
const introEtape1 = document.getElementById("introEtape1");
const level1 = document.getElementById("level1");
const level2 = document.getElementById("level2");
const level3 = document.getElementById("level3");

const etape1 = document.getElementById("etape1");

const btnEntrerJeu = document.getElementById("enterGame");

// intro.classList.add("hide");
introEtape1.classList.add("hide");
level1.classList.add("hide");
level2.classList.add("hide");
level3.classList.add("hide");
etape1.classList.add("etape1");

btnEntrerJeu.addEventListener("click", () => {
  introEtape1.classList.remove("hide");
});
