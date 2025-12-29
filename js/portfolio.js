document.addEventListener('DOMContentLoaded', () => {
    fetch('json/cyberfolio.json') 
        .then(response => response.json())
        .then(data => {
            const tableComp = data.find(t => t.name === "competences").data;
            const tableProjets = data.find(t => t.name === "projets").data;
            const tableLiaisons = data.find(t => t.name === "projet_competences").data;

            // --- 1. COMPETENCES ---
            const listeCompElement = document.getElementById('liste-competences');
            if (listeCompElement) {
                listeCompElement.innerHTML = ''; 
                tableComp.forEach(comp => {
                    const li = document.createElement('li');
                    li.textContent = comp.nom;
                    listeCompElement.appendChild(li);
                });
            }

            // --- 2. PROJETS (SANS LIENS) ---
            const conteneurProjets = document.getElementById('projets-conteneur');
            if (conteneurProjets) {
                conteneurProjets.innerHTML = ''; 
                tableProjets.forEach(projet => {
                    const idsCompDuProjet = tableLiaisons
                        .filter(liaison => liaison.ID_Projet === projet.id)
                        .map(liaison => liaison.ID_Competence);

                    const competencesLiees = tableComp
                        .filter(c => idsCompDuProjet.includes(c.id))
                        .map(c => c.nom)
                        .join(', ');

                    const dateD = new Date(projet.date_debut).toLocaleDateString('fr-FR');
                    const dateF = projet.date_fin ? new Date(projet.date_fin).toLocaleDateString('fr-FR') : 'En cours';

                    // ICI : On a enlevé la balise <a> pour supprimer l'accès
                    const card = `
                        <div class="carte-projet">
                            <h3>${projet.nom}</h3>
                            <p>${projet.description}</p>
                            <span class="projet-compétence">
                                <strong>Technologies :</strong> ${competencesLiees}
                                <p class="projet-dates">Du ${dateD} au ${dateF}</p>
                            </span>
                        </div>
                    `;
                    conteneurProjets.insertAdjacentHTML('beforeend', card);
                });
            }
        })
        .catch(err => console.error("Erreur :", err));
});

// Garde le Smooth Scroll pour le menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
