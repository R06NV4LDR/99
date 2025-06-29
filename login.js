import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Firebase initialisieren
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
    console.log("🔍 Suche Benutzer:", username);
    const q = query(collection(db, "guests"), where("login", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      errorMsg.textContent = `Benutzer "${username}" wurde nicht gefunden.`;
      console.warn("❌ Kein Benutzer gefunden:", username);
      return;
    }

    const docSnap = querySnapshot.docs[0];
    const guestData = docSnap.data();

    if (guestData.passw !== password) {
      errorMsg.textContent = "Falsches Passwort.";
      console.warn("❌ Passwort falsch:", username);
      return;
    }

    // ✅ Login erfolgreich → Werte speichern
    console.log("✅ Login erfolgreich:", username);
    localStorage.setItem("login", guestData.login);
    localStorage.setItem("passw", guestData.passw);
    localStorage.setItem("guestId", docSnap.id);

    // 📥 Loginlog speichern
    await addDoc(collection(db, "loginlog"), {
      login: guestData.login,
      timestamp: serverTimestamp()
    });

    // 🔁 Weiterleitung
    window.location.href = "/event.html";

  } catch (err) {
    console.error("🔥 Fehler beim Login:", err);
    errorMsg.textContent = "Ein Fehler ist aufgetreten: " + (err.message || err);
  }
});
