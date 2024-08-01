// Fonction pour jouer le son du bot
function playBotSound() {
    const audio = new Audio('assets/sounds/robot-sound.wav'); // Utilisez le format .wav
    audio.play();
}

// Fonction pour nettoyer l'entrée utilisateur
function cleanInput(input) {
    return input
        .toLowerCase() // Convertit en minuscules
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '') // Supprime la ponctuation
        .replace(/\s{2,}/g, ' '); // Remplace les espaces multiples par un seul espace
}

// Fonction pour gérer les choix multiples
function getBotChoiceResponse(input) {
    const cleanedInput = cleanInput(input);
    const choiceResponses = {
        "répétition": [
            "Vous pouvez reformuler votre question.",
            "Essayez de poser la question différemment."
        ],
        "aide": [
            "Je suis ici pour vous aider avec toutes vos questions.",
            "N'hésitez pas à demander de l'aide pour tout ce dont vous avez besoin."
        ]
    };

    for (const [keyword, responses] of Object.entries(choiceResponses)) {
        if (cleanedInput.includes(keyword)) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
    return null;
}

// Fonction pour gérer les réponses du bot
function handleBotResponse(userInput) {
    const chatOutput = document.getElementById('chat-output');
    chatOutput.innerHTML += `<div class="user-message"><strong>Vous:</strong> ${userInput}</div>`;
    document.getElementById('chat-input').value = '';

    // Délai avant de répondre pour simuler la réflexion du bot
    setTimeout(() => {
        const choiceResponse = getBotChoiceResponse(userInput);
        const botResponse = choiceResponse || getBotResponse(userInput);
        chatOutput.innerHTML += `<div class="bot-message"><strong>Bot:</strong> ${botResponse}</div>`;
        chatOutput.scrollTop = chatOutput.scrollHeight;

        // Jouer le son du bot après avoir affiché la réponse
        playBotSound();
    }, 1000); // Délai de 1 seconde avant la réponse du bot
}

// Événements de clic et de touche pour envoyer le message
document.getElementById('send-btn').addEventListener('click', () => {
    const userInput = document.getElementById('chat-input').value.trim();
    if (userInput) {
        handleBotResponse(userInput);
    }
});

document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('send-btn').click();
    }
});

// Fonction pour obtenir une réponse du bot
function getBotResponse(input) {
    const cleanedInput = cleanInput(input);

    // Réponses améliorées avec gestion de contexte et personnalisation
    const responses = [
        // Réponses simples
        { regex: /bonjour/, response: [
            "Bonjour! Comment puis-je vous aider aujourd'hui?",
            "Salut! En quoi puis-je vous assister?",
            "Bonjour! Que puis-je faire pour vous aujourd'hui?",
            "Bonjour! Avez-vous des questions pour moi aujourd'hui?"
        ]},
        { regex: /quel est ton nom/, response: [
            "Je suis un chatbot sans nom spécifique. Et vous?",
            "Je n'ai pas de nom propre, mais je suis là pour vous aider!",
            "Je n'ai pas de nom, mais vous pouvez m'appeler comme vous voulez!"
        ]},
        { regex: /comment ça va/, response: [
            "Je suis un programme, donc je vais toujours bien! Et vous?",
            "Je vais bien, merci! Comment se passe votre journée?",
            "Je suis en pleine forme, merci! Et vous, comment allez-vous?"
        ]},
        { regex: /qui es-tu/, response: [
            "Je suis un chatbot ici pour répondre à vos questions simples et vous assister.",
            "Je suis un assistant virtuel. Comment puis-je vous aider aujourd'hui?",
            "Je suis un programme conçu pour aider et fournir des informations. Que puis-je faire pour vous?"
        ]},
        { regex: /quelle heure est-il/, response: `Il est ${new Date().toLocaleTimeString()}.` },
        { regex: /au revoir/, response: [
            "Au revoir! Passez une excellente journée. À bientôt!",
            "Au revoir! J'espère vous revoir bientôt. Prenez soin de vous!",
            "À la prochaine! Passez une bonne journée."
        ]},
        { regex: /quel temps fait-il/, response: [
            "Je suis désolé, je ne peux pas vous dire la météo actuelle. Peut-être consulter une application météo?",
            "Je ne peux pas fournir les conditions météo, mais une application météo devrait pouvoir vous aider!",
            "Je ne peux pas accéder aux données météorologiques. Je vous recommande de vérifier une application météo."
        ]},
        { regex: /combien de jours dans une semaine/, response: "Il y a 7 jours dans une semaine." },
        { regex: /quel est le capital de la france/, response: "Le capital de la France est Paris." },
        { regex: /que fais-tu/, response: [
            "Je suis ici pour répondre à vos questions et vous assister de mon mieux.",
            "Je suis un chatbot conçu pour vous aider. Que puis-je faire pour vous?",
            "Je suis un assistant virtuel prêt à répondre à vos questions. Comment puis-je vous aider aujourd'hui?"
        ]},
        { regex: /quelle est la couleur du ciel/, response: "En général, le ciel est bleu pendant la journée, mais il peut changer en fonction des conditions météorologiques." },
        { regex: /combien de continents y a-t-il/, response: "Il y a 7 continents sur Terre." },
        { regex: /quel est le plus grand océan/, response: "Le plus grand océan est l'océan Pacifique." },
        { regex: /quand est-ce que le soleil se lève/, response: "Cela dépend de votre emplacement et de la période de l'année. En général, il se lève à l'est." },

        // Réponses pour des questions plus complexes et courantes
        { regex: /quels sont tes hobbies/, response: [
            "Je n'ai pas de hobbies, mais j'aime discuter et aider les gens!",
            "Je suis un chatbot, donc je n'ai pas de hobbies. Mais je suis toujours prêt à aider!",
            "Je n'ai pas de hobbies personnels, mais j'apprécie les conversations intéressantes avec vous!"
        ]},
        { regex: /d'où viens-tu/, response: [
            "Je suis un programme informatique, donc je viens du monde numérique!",
            "Je viens du code et des serveurs! Je suis ici pour vous aider.",
            "Je suis un produit de la technologie numérique. Comment puis-je vous assister aujourd'hui?"
        ]},
        { regex: /quel est ton plat préféré/, response: [
            "Je ne mange pas, mais j'entends que beaucoup de gens aiment les pizzas!",
            "Je n'ai pas de préférences alimentaires, mais je suis curieux de connaître vos plats préférés!",
            "Je suis un chatbot, donc je n'ai pas de plat préféré. Mais les pizzas sont souvent populaires!"
        ]},
        { regex: /quel est le sens de la vie/, response: "C'est une question philosophique profonde. De nombreux philosophes ont des réponses différentes à cette question." },
        { regex: /que penses-tu de la technologie/, response: "La technologie est fascinante et elle évolue rapidement. Elle a beaucoup de potentiel pour améliorer nos vies." },

        // Questions et réponses plus philosophiques et complexes
        { regex: /que sais-tu sur l'intelligence artificielle/, response: [
            "L'intelligence artificielle est un domaine de l'informatique qui vise à créer des systèmes capables d'apprendre et de s'adapter comme le ferait un être humain.",
            "L'IA utilise des algorithmes pour imiter la cognition humaine. Elle est utilisée dans de nombreux domaines comme la reconnaissance vocale, la vision par ordinateur et la robotique.",
            "L'intelligence artificielle est un champ d'étude qui se concentre sur la création de systèmes capables de réaliser des tâches nécessitant normalement de l'intelligence humaine."
        ]},
        { regex: /comment fonctionne un ordinateur/, response: [
            "Un ordinateur fonctionne en traitant des données à l'aide de circuits électroniques. Les données sont envoyées au processeur, qui exécute des instructions pour produire des résultats.",
            "Les ordinateurs utilisent des composants tels que le processeur, la mémoire et le stockage pour traiter et stocker des informations. Le système d'exploitation gère les ressources et les applications.",
            "Un ordinateur traite les informations en exécutant des programmes stockés en mémoire. Il utilise des circuits électroniques pour manipuler les données et produire des sorties."
        ]},
        { regex: /quelles sont les dernières avancées technologiques/, response: [
            "Les dernières avancées incluent l'amélioration des algorithmes d'apprentissage automatique, les développements en robotique, et les progrès dans le domaine de la réalité augmentée et virtuelle.",
            "Des technologies émergentes telles que les réseaux neuronaux profonds, l'informatique quantique et les systèmes autonomes sont à la pointe de l'innovation technologique actuelle.",
            "Les avancées récentes incluent les améliorations dans les semi-conducteurs, la 5G, et les innovations en matière d'énergie renouvelable."
        ]},
        { regex: /quels sont les défis de l'intelligence artificielle/, response: [
            "Les défis incluent la gestion des biais dans les algorithmes, la protection de la vie privée, et la création de systèmes éthiques et responsables.",
            "L'IA fait face à des défis tels que l'explicabilité des modèles, les préoccupations éthiques, et la nécessité de grandes quantités de données pour l'apprentissage.",
            "Les principaux défis de l'IA sont l'intégration de l'éthique dans les algorithmes, la protection contre les abus, et la gestion de l'impact social des technologies."
        ]},
        { regex: /quels sont les avantages et les inconvénients de la technologie/, response: [
            "Les avantages incluent une meilleure connectivité, des avancées en médecine, et des améliorations dans l'efficacité des tâches. Les inconvénients peuvent inclure des problèmes de sécurité, une dépendance accrue, et des impacts environnementaux.",
            "La technologie offre des avantages tels que l'automatisation des processus, la facilitation de la communication, et l'accès à l'information. Cependant, elle peut également entraîner des inconvénients comme la perte d'emploi, la cybersécurité, et des préoccupations sur la vie privée.",
            "Les avantages de la technologie comprennent des innovations en matière de santé et d'éducation, ainsi que l'amélioration de la qualité de vie. Les inconvénients peuvent inclure des problèmes de sécurité, des impacts sur la santé mentale, et des disparités d'accès."
        ]},
        { regex: /quels sont les impacts environnementaux des technologies/, response: [
            "Les impacts environnementaux incluent la consommation d'énergie élevée des centres de données, les déchets électroniques, et l'extraction des ressources rares nécessaires pour fabriquer les composants électroniques.",
            "Les technologies peuvent contribuer à des problèmes environnementaux tels que la pollution électronique, la consommation excessive de ressources, et la production de déchets non recyclables.",
            "Les effets environnementaux des technologies incluent l'empreinte carbone des infrastructures technologiques, la gestion des déchets électroniques, et l'utilisation de matériaux rares dans la fabrication des appareils."
        ]}
    ];

    for (const { regex, response } of responses) {
        if (regex.test(cleanedInput)) {
            if (Array.isArray(response)) {
                return response[Math.floor(Math.random() * response.length)];
            }
            return response;
        }
    }
    return "Je ne comprends pas bien. Pouvez-vous reformuler votre question ou essayer quelque chose d'autre svp ?";
}




