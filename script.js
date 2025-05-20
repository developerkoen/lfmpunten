// Stap 1: Je Firebase configuratie (VERVANG DIT MET JE EIGEN CONFIGURATIE!)
const firebaseConfig = {
  apiKey: "AIzaSyDTPncO2mOeyIJxqDHv6YPZxd8GXMsVmvU",
  authDomain: "lfmpuntenlogin.firebaseapp.com",
  projectId: "lfmpuntenlogin",
  storageBucket: "lfmpuntenlogin.firebasestorage.app",
  messagingSenderId: "944765155415",
  appId: "1:944765155415:web:ad265f7c1ebdcfc43a0b12",
  measurementId: "G-01CSRDL101"
};

// Initialiseer Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Bepaal welke pagina we zijn (index.html of puntenoverzicht.html)
const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
const isDashboardPage = window.location.pathname.endsWith('puntenoverzicht.html');

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

// *** Logica voor de index.html (Inlogpagina) ***
if (isLoginPage) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');

    loginBtn.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (email && password) {
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Succesvolle login, stuur door naar puntenoverzicht.html
                    console.log("Gebruiker ingelogd:", userCredential.user.email);
                    window.location.href = 'puntenoverzicht.html'; // Navigeer naar de dashboard pagina
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

    // Controleer inlogstatus bij laden van index.html
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Als de gebruiker al is ingelogd, stuur direct door naar het dashboard
            console.log("Gebruiker al ingelogd op index.html, doorsturen...");
            window.location.href = 'puntenoverzicht.html';
        }
    });
}

// *** Logica voor de puntenoverzicht.html (Dashboard pagina) ***
if (isDashboardPage) {
    const logoutBtn = document.getElementById('logoutBtn');
    const userEmailSpan = document.getElementById('user-email');

    logoutBtn.addEventListener('click', () => {
        auth.signOut()
            .then(() => {
                // Succesvol uitgelogd, stuur terug naar de inlogpagina
                console.log("Gebruiker uitgelogd van puntenoverzicht.html.");
                window.location.href = 'index.html'; // Navigeer terug naar de login pagina
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.error("Fout bij uitloggen:", errorMessage);
                // Je kunt hier eventueel een melding tonen op de dashboard pagina,
                // maar voor nu loggen we alleen de fout.
            });
    });

    // Controleer inlogstatus bij laden van puntenoverzicht.html
    auth.onAuthStateChanged((user) => {
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
