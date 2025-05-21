// Firebase Config - PLAK JOUW CONFIG HIER DIE JE KOPIEERT UIT DE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyDTPncO2mOeyIJxqDHv6YPZxd8GXMsVmvU",
  authDomain: "lfmpuntenlogin.firebaseapp.com",
  projectId: "lfmpuntenlogin",
  storageBucket: "lfmpuntenlogin.firebasestorage.app",
  messagingSenderId: "944765155415",
  appId: "1:944765155415:web:ad265f7c1ebdcfc43a0b12",
  measurementId: "G-01CSRDL101" // Deze is optioneel, als je hem niet hebt, mag hij weg
};

// Importeer de benodigde Firebase functies (modulaire syntax)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js"; // Optioneel, als je Analytics gebruikt

// Initialiseer Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app); // Optioneel, initialiseer alleen als je het nodig hebt

// Bepaal welke pagina we zijn (index.html, puntenoverzicht.html of test.html)
const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
const isDashboardPage = window.location.pathname.endsWith('puntenoverzicht.html');
const isTestPage = window.location.pathname.endsWith('test.html'); // <-- Nieuw: detecteer test.html

// Functie om berichten weer te geven op de inlogpagina
function showMessage(message, type) {
    const authMessage = document.getElementById('auth-message');
    if (authMessage) { // Controleer of het element bestaat (alleen op index.html)
        authMessage.textContent = message;
        authMessage.className = `message ${type}`;
        authMessage.style.display = 'block';
        setTimeout(() => {
            authMessage.style.display = 'none';
            authMessage.textContent = '';
            authMessage.className = 'message';
        }, 5000); // Verberg bericht na 5 seconden
    }
}

// ---

### Logica voor de index.html (Inlogpagina)
if (isLoginPage) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');

    loginBtn.addEventListener('click', async () => { // Gebruik async/await voor modern JS
        const email = emailInput.value;
        const password = passwordInput.value;

        if (email && password) {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                // Succesvolle login, stuur door naar puntenoverzicht.html
                console.log("Gebruiker ingelogd, doorsturen...");
                window.location.href = 'puntenoverzicht.html'; // Navigeer naar de dashboard pagina
            } catch (error) {
                const errorMessage = error.message;
                console.error("Fout bij inloggen:", errorMessage);
                showMessage(`Inloggen mislukt: ${errorMessage}`, "error");
            }
        } else {
            showMessage("Vul alstublieft zowel e-mailadres als wachtwoord in.", "error");
        }
    });

    // Controleer inlogstatus bij laden van index.html
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Als de gebruiker al is ingelogd, stuur direct door naar het dashboard
            console.log("Gebruiker al ingelogd op index.html, doorsturen...");
            window.location.href = 'puntenoverzicht.html';
        }
    });
}

---

### Logica voor de puntenoverzicht.html (Dashboard pagina)
if (isDashboardPage) {
    const logoutBtn = document.getElementById('logoutBtn');
    const userEmailSpan = document.getElementById('user-email');

    logoutBtn.addEventListener('click', async () => { // Gebruik async/await
        try {
            await signOut(auth);
            // Succesvol uitgelogd, stuur terug naar de inlogpagina
            console.log("Gebruiker uitgelogd van puntenoverzicht.html.");
            window.location.href = 'index.html'; // Navigeer terug naar de login pagina
        } catch (error) {
            const errorMessage = error.message;
            console.error("Fout bij uitloggen:", errorMessage);
            // Je kunt hier eventueel een melding tonen op de dashboard pagina,
            // maar voor nu loggen we alleen de fout.
        }
    });

    // Controleer inlogstatus bij laden van puntenoverzicht.html
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Gebruiker is ingelogd, toon e-mailadres
            userEmailSpan.textContent = user.email;
        } else {
            // Gebruiker is NIET ingelogd, stuur terug naar de inlogpagina
            console.log("Gebruiker niet ingelogd op puntenoverzicht.html, doorsturen naar login...");
            window.location.href = 'index.html';
        }
    });
}

---

### Logica voor script.js (Test pagina)
    // Controleer inlogstatus bij laden van script.js
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Gebruiker is ingelogd, toon een welkomstbericht en hun e-mail
            console.log("Gebruiker ingelogd op script.js:", user.email);
            }
        } else {
            // Gebruiker is NIET ingelogd, stuur terug naar de inlogpagina
            console.log("Gebruiker niet ingelogd op script.js, doorsturen naar login...");
            window.location.href = 'index.html';
        }
    });

    // Voeg hier de logout functionaliteit toe voor de test pagina, indien gewenst
    if (logoutBtnTest) {
        logoutBtnTest.addEventListener('click', async () => {
            try {
                await signOut(auth);
                console.log("Gebruiker uitgelogd van test.html.");
                window.location.href = 'index.html';
            } catch (error) {
                console.error("Fout bij uitloggen vanaf test.html:", error.message);
            }
        });
    }

    // Voeg hier eventuele andere specifieke logica voor test.html toe
    // Bijvoorbeeld, interacties met knoppen of het laden van data specifiek voor de test pagina.
}
