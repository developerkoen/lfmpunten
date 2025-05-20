// Stap 1: Je Firebase configuratie (VERVANG DIT MET JE EIGEN CONFIGURATIE UIT STAP 1.4!)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialiseer Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Referenties naar UI-elementen
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn'); // Nu gebruikt in het dashboard
const authMessage = document.getElementById('auth-message');
const authSection = document.getElementById('auth-section'); // De login sectie
const dashboardSection = document.getElementById('dashboard-section'); // De dashboard sectie
const userEmailSpan = document.getElementById('user-email');

// Functie om berichten weer te geven
function showMessage(message, type) {
    authMessage.textContent = message;
    authMessage.className = `message ${type}`;
    authMessage.style.display = 'block';
    setTimeout(() => {
        authMessage.style.display = 'none';
        authMessage.textContent = '';
        authMessage.className = 'message';
    }, 5000); // Verberg bericht na 5 seconden
}

// Inloggen
loginBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (email && password) {
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Succesvolle login - de onAuthStateChanged luisteraar handelt de UI af
                const user = userCredential.user;
                console.log("Gebruiker ingelogd:", user.email);
                showMessage("Succesvol ingelogd!", "success");
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.error("Fout bij inloggen:", errorMessage);
                showMessage(`Inloggen mislukt: ${errorMessage}`, "error");
            });
    } else {
        showMessage("Vul alstublieft zowel e-mailadres als wachtwoord in.", "error");
    }
});

// Uitloggen
logoutBtn.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            // Succesvol uitgelogd - de onAuthStateChanged luisteraar handelt de UI af
            console.log("Gebruiker uitgelogd.");
            showMessage("Succesvol uitgelogd.", "success");
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.error("Fout bij uitloggen:", errorMessage);
            showMessage(`Uitloggen mislukt: ${errorMessage}`, "error");
        });
});

// Realtime luisteraar voor authenticatiestatus
// Deze functie wordt geactiveerd wanneer de inlogstatus verandert
auth.onAuthStateChanged((user) => {
    if (user) {
        // Gebruiker is ingelogd
        authSection.style.display = 'none'; // Verberg de inlogsectie
        dashboardSection.style.display = 'block'; // Toon het dashboard (nu de puntensysteem pagina)
        userEmailSpan.textContent = user.email; // Toon het e-mailadres van de gebruiker
    } else {
        // Gebruiker is uitgelogd
        authSection.style.display = 'flex'; // Toon de inlogsectie (gebruik flex voor centrering)
        dashboardSection.style.display = 'none'; // Verberg het dashboard
        userEmailSpan.textContent = ''; // Leeg het e-mailadres
        emailInput.value = ''; // Leeg de e-mail invoer
        passwordInput.value = ''; // Leeg de wachtwoord invoer
        authMessage.style.display = 'none'; // Verberg eventuele eerdere berichten
    }
});
