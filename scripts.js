// scripts.js

document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll('.star');
    const menuItems = document.querySelectorAll('.menu-item');

    // Positions prédéfinies pour chaque étoile
    const positions = [
        { left: '20%', top: '40%' },  // Position pour 'À propos'
        { left: '40%', top: '20%' },  // Position pour 'CV et Lettre de Motivation'
        { left: '60%', top: '50%' },  // Position pour 'Chatbot'
        { left: '80%', top: '30%' },  // Position pour 'Mini Jeux'
        { left: '50%', top: '70%' }   // Position pour 'Me Contacter'
    ];

    // Liens pour chaque étoile/menu
    const links = [
        "about.html",
        "cv.html",
        "chatbot.html",
        "games.html",
        "contact.html"
    ];

    // Fonction pour initialiser les étoiles et les événements associés
    stars.forEach((star, index) => {
        const menuItem = menuItems[index];
        const position = positions[index];

        // Placer chaque étoile à sa position prédéfinie
        positionStar(star, position);

        // Ajouter les attributs d'accessibilité
        configureElementAttributes(star, {
            'aria-label': `Lien vers ${menuItem.textContent}`, // Description pour les lecteurs d'écran
            'role': 'button', // Rôle de bouton pour l'accessibilité
            'tabindex': '0' // Permet la navigation au clavier
        });

        configureElementAttributes(menuItem, {
            'aria-hidden': 'true', // Cacher le menu pour les lecteurs d'écran
        });

        // Gérer l'entrée et la sortie de la souris
        star.addEventListener('mouseenter', () => handleMenuVisibility(menuItem, true));
        star.addEventListener('mouseleave', () => handleMenuVisibility(menuItem, false));
        
        // Gérer le clic et la navigation au clavier
        star.addEventListener('click', () => window.location.href = links[index]);
        star.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                window.location.href = links[index];
            }
        });

        // Empêcher les événements de clic direct sur le menu
        menuItem.style.pointerEvents = 'none';

        // Gérer l'entrée et la sortie de la souris sur le menu
        menuItem.addEventListener('mouseenter', () => handleMenuVisibility(menuItem, true));
        menuItem.addEventListener('mouseleave', () => handleMenuVisibility(menuItem, false));
    });

    // Fonction pour afficher le contenu de l'onglet sélectionné
    showContent('cv');
});

/**
 * Place l'étoile à la position spécifiée.
 * @param {HTMLElement} star - L'élément étoile à positionner.
 * @param {Object} position - Les coordonnées de position { left, top }.
 */
function positionStar(star, position) {
    star.style.left = position.left;
    star.style.top = position.top;
}

/**
 * Configure les attributs d'un élément.
 * @param {HTMLElement} element - L'élément à configurer.
 * @param {Object} attributes - Un objet contenant les paires clé-valeur pour les attributs.
 */
function configureElementAttributes(element, attributes) {
    for (const key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            element.setAttribute(key, attributes[key]);
        }
    }
}

/**
 * Gère la visibilité du menu avec une animation d'opacité.
 * @param {HTMLElement} menuItem - L'élément menu à afficher/masquer.
 * @param {boolean} show - Indique si le menu doit être affiché ou masqué.
 */
function handleMenuVisibility(menuItem, show) {
    if (show) {
        animateMenuIn(menuItem);
    } else {
        animateMenuOut(menuItem);
    }
}

/**
 * Anime l'affichage du menu avec une transition d'opacité.
 * @param {HTMLElement} menuItem - L'élément menu à afficher.
 */
function animateMenuIn(menuItem) {
    menuItem.style.display = 'block';
    menuItem.style.opacity = '0';
    menuItem.style.transition = 'opacity 0.3s ease-in-out';
    
    // Utilisation de requestAnimationFrame pour une animation plus fluide
    requestAnimationFrame(() => {
        menuItem.style.opacity = '1';
    });
}

/**
 * Anime la disparition du menu avec une transition d'opacité.
 * @param {HTMLElement} menuItem - L'élément menu à masquer.
 */
function animateMenuOut(menuItem) {
    menuItem.style.opacity = '0';
    menuItem.style.transition = 'opacity 0.3s ease-in-out';

    // Masquer l'élément après la transition
    setTimeout(() => {
        menuItem.style.display = 'none';
    }, 300);
}

/**
 * Affiche le contenu de l'onglet sélectionné.
 * @param {string} tabName - Le nom de l'onglet à afficher.
 */
function showContent(tabName) {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    tabContents.forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });

    // Afficher le contenu de l'onglet sélectionné
    const activeContent = document.getElementById(`${tabName}-content`);
    activeContent.style.display = 'block';
    activeContent.classList.add('active');

    // Activer le bouton de l'onglet sélectionné
    document.querySelector(`button[onclick="showContent('${tabName}')"]`).classList.add('active');
}
