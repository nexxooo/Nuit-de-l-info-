// Liste des phases dans l'ordre
const phases = ["intro", "step1", "level1", "level2", "level3"];
let currentPhase = 0;

// Sélectionne tous les boutons "fleche-btn"
document.querySelectorAll(".fleche-btn").forEach(btn => {
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
        } else {
            // Si plus de phase, on peut afficher un message ou revenir au début
            alert("Toutes les phases sont terminées !");
        }
    });
});
