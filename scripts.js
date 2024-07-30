// scripts.js

document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll('.star');
    const menuItems = document.querySelectorAll('.menu-item');

    const positions = [
        { left: '20%', top: '40%' },  // Position pour 'À propos'
        { left: '40%', top: '20%' },  // Position pour 'CV et Lettre de Motivation'
        { left: '60%', top: '50%' },  // Position pour 'Chatbot'
        { left: '80%', top: '30%' },  // Position pour 'Mini Jeux'
        { left: '50%', top: '70%' }   // Position pour 'Me Contacter'
    ];

    const links = [
        "about.html",
        "cv.html",
        "chatbot.html",
        "games.html",
        "contact.html"
    ];

    stars.forEach((star, index) => {
        const menuItem = menuItems[index];
        const position = positions[index];

        // Place chaque étoile à une position prédéfinie
        star.style.left = position.left;
        star.style.top = position.top;

        star.addEventListener('mouseenter', () => {
            menuItem.style.display = 'block';
            menuItem.style.left = `${star.offsetLeft - menuItem.offsetWidth / 2 + star.offsetWidth / 2}px`;
            menuItem.style.top = `${star.offsetTop - 50}px`;
        });

        star.addEventListener('mouseleave', () => {
            menuItem.style.display = 'none';
        });

        star.addEventListener('click', () => {
            window.location.href = links[index]; // Redirection à l'URL spécifiée
        });

        menuItem.style.pointerEvents = 'none'; // Empêche le clic direct sur l'élément menu

        menuItem.addEventListener('mouseenter', () => {
            menuItem.style.display = 'block';
        });

        menuItem.addEventListener('mouseleave', () => {
            menuItem.style.display = 'none';
        });
    });
});

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

    document.getElementById(`${tabName}-content`).style.display = 'block';
    document.getElementById(`${tabName}-content`).classList.add('active');

    document.querySelector(`button[onclick="showContent('${tabName}')"]`).classList.add('active');
}

// Initialiser par défaut sur le CV
document.addEventListener("DOMContentLoaded", () => {
    showContent('cv');
});