// login.js (type="module" is OK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  try {
    const userRef = doc(db, "Guests", username);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("Benutzer nicht gefunden.");
    }

    const userData = userSnap.data();
    const storedHash = userData.passw; // e.g. bcrypt-hashed password

    if (bcrypt.compareSync(password, storedHash)) {
      window.location.href = `event.html?login=${username}`;
    } else {
      showError("Falsches Passwort.");
    }
  } catch (err) {
    showError(err.message || "Fehler beim Login.");
  }
});

function showError(msg) {
  document.getElementById("error-msg").textContent = msg;
}
