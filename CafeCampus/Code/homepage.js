// Sélection des éléments
const logo = document.getElementById("logo");
const modal = document.getElementById("container");
const closeBtn = document.querySelector(".close");

// Quand on clique sur le logo
// Vérifier que les éléments existent avant d'ajouter les écouteurs d'événements
if (logo && modal) {
    // Afficher la fenêtre au clic sur le logo
    logo.addEventListener("click", () => {
        modal.style.display = "flex";
        logo.style.display = "none";
    });

    // Masquer la fenêtre au clic sur le bouton de fermeture (si présent)
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
            logo.style.display = "block";
        });
    }

    // Masquer la fenêtre au clic en dehors
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            logo.style.display = "block";
        }
    });
}

const container = document.getElementById("container");
const registerbtn = document.getElementById("register");
const loginbtn = document.getElementById("login");

registerbtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginbtn.addEventListener("click", () => {
  container.classList.remove("active");
});
