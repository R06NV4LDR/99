import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Login-Formular
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginInput = document.getElementById("username");
  const passwInput = document.getElementById("password");
  const errorMsg = document.getElementById("error-msg");

  const username = loginInput.value.trim().toLowerCase();
  const password = passwInput.value;

  errorMsg.textContent = ""; // alte Fehlermeldung zurücksetzen

  if (!username || !password) {
    errorMsg.textContent = "Bitte Benutzername und Passwort eingeben.";
    return;
  }

  try {
    console.log("🔍 Suche Benutzer:", username);
    const docRef = doc(db, "Guests", username);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      errorMsg.textContent = `Benutzer "${username}" wurde nicht gefunden.`;
      console.warn("❌ Dokument nicht gefunden:", username);
      return;
    }

    const data = docSnap.data();
    const hashed = data.passw;

    if (!hashed) {
      errorMsg.textContent = "Kein Passwort für diesen Benutzer hinterlegt.";
      console.error("❗ Kein Feld 'passw' gefunden im Dokument.");
      return;
    }

    // bcrypt kommt über ein <script> Tag rein → global verfügbar
    const match = bcrypt.compareSync(password, hashed);

    if (match) {
      console.log("✅ Login erfolgreich:", username);
      window.location.href = `/event.html?login=${username}`;
    } else {
      errorMsg.textContent = "Falsches Passwort.";
      console.warn("❌ Passwort falsch für:", username);
    }
  } catch (err) {
    console.error("🔥 Fehler beim Login:", err);
    errorMsg.textContent = "Es ist ein Fehler aufgetreten: " + (err.message || err);
  }
});
