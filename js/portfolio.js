document.addEventListener('DOMContentLoaded', () => {
    fetch('../json/cyberfolio.json')
        .then(response => response.json())
        .then(data => {
            const tableComp = data.find(t => t.name === "competences").data;
            const tableProjets = data.find(t => t.name === "projets").data;
            const tableLiaisons = data.find(t => t.name === "projet_competences").data;

            // --- 1. COMPETENCES ---
            const listeCompElement = document.getElementById('liste-competences');
            listeCompElement.innerHTML = ''; 
            
            tableComp.forEach(comp => {
                const li = document.createElement('li');
                li.textContent = comp.nom;
                listeCompElement.appendChild(li);
            });

            // --- 2. PROJETS ---
            const conteneurProjets = document.getElementById('projets-conteneur');
            conteneurProjets.innerHTML = ''; 

            tableProjets.forEach(projet => {
                // On refait le lien avec les compétences
                const competencesLiees = tableLiaisons
                    .filter(liaison => liaison.ID_Projet === projet.id)
                    .map(liaison => {
                        const c = tableComp.find(item => item.id === liaison.ID_Competence);
                        return c ? c.nom : null;
                    })
                    .filter(nom => nom !== null)
                    .join(', ');

                // On recrée exactement le formatage de date PHP
                const dateD = new Date(projet.date_debut).toLocaleDateString('fr-FR');
                const dateF = projet.date_fin ? new Date(projet.date_fin).toLocaleDateString('fr-FR') : 'En cours';

                // STRUCTURE EXACTE DE TON ANCIEN PHP
                const card = `
                    <div class="carte-projet">
                        <h3>${projet.nom}</h3>
                        <p>${projet.description}</p>

                        <span class="projet-compétence">
                            ${competencesLiees}
                            <p class="projet-dates">Du ${dateD} au ${dateF}</p>
                        </span>
                        <a href="${projet.lien_projet || '#'}" class="lien-projet">Détails du projet</a>
                    </div>
                `;
                conteneurProjets.insertAdjacentHTML('beforeend', card);
            });
        })
        .catch(err => console.error("Erreur :", err));
});

// Gestion du défilement fluide sans changer l'URL (cache le #)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Empêche l'ajout du # dans l'URL

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth' // Défilement fluide
            });
        }
    });
});