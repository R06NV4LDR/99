import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginInput = document.getElementById("username");
  const passwInput = document.getElementById("password");
  const errorMsg = document.getElementById("error-msg");

  const username = loginInput.value.trim();
  const password = passwInput.value;

  errorMsg.textContent = "";

  if (!username || !password) {
    errorMsg.textContent = "Bitte Benutzername und Passwort eingeben.";
    return;
  }

  try {
    console.log("🔍 Suche Benutzername:", username);

    const guestsRef = collection(db, "Guests");
    const q = query(guestsRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      errorMsg.textContent = `Benutzer "${username}" wurde nicht gefunden.`;
      console.warn("❌ Kein Dokument mit Benutzername gefunden:", username);
      return;
    }

    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    const hashed = data.passw;

    if (!hashed) {
      errorMsg.textContent = "Kein Passwort für diesen Benutzer hinterlegt.";
      console.error("❗ Kein Feld 'passw' gefunden im Dokument.");
      return;
    }

    const match = bcrypt.compareSync(password, hashed);

    if (match) {
      console.log("✅ Login erfolgreich:", username);
      // 🔁 docSnap.id ist die echte Firestore-Dokument-ID
      window.location.href = `/event.html?login=${docSnap.id}`;
    } else {
      errorMsg.textContent = "Falsches Passwort.";
      console.warn("❌ Passwort falsch für:", username);
    }
  } catch (err) {
    console.error("🔥 Fehler beim Login:", err);
    errorMsg.textContent = "Fehler beim Login: " + (err.message || err);
  }
});
