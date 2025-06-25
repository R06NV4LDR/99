import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Firebase init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");
  errorMsg.textContent = "";

  if (!username || !password) {
    errorMsg.textContent = "Bitte Benutzername und Passwort eingeben.";
    return;
  }

  try {
    console.log("🔍 Suche Benutzername:", username);
    const q = query(collection(db, "Guests"), where("login", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      errorMsg.textContent = `Benutzer "${username}" wurde nicht gefunden.`;
      console.warn("❌ Kein Dokument mit Benutzername gefunden:", username);
      return;
    }

    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();

    if (data.passw !== password) {
      errorMsg.textContent = "Falsches Passwort.";
      console.warn("❌ Passwort falsch für:", username);
      return;
    }

    console.log("✅ Login erfolgreich:", username);
    window.location.href = `/public/event.html?login=${username}`;
  } catch (err) {
    console.error("🔥 Fehler beim Login:", err);
    errorMsg.textContent = "Ein Fehler ist aufgetreten: " + (err.message || err);
  }
});
