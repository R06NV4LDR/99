import { firebaseConfig } from './config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import bcrypt from "https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.min.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorEl = document.getElementById("error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const login = document.getElementById("login").value.trim().toLowerCase();
    const passw = document.getElementById("passw").value;

    if (!login || !passw) return;

    try {
      const q = query(collection(db, "Guests"), where("login", "==", login));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        errorEl.textContent = "Login not found.";
        return;
      }

      const guest = snapshot.docs[0].data();
      const storedHash = guest.passw;

      if (!bcrypt.compareSync(passw, storedHash)) {
        errorEl.textContent = "Incorrect password.";
        return;
      }

      // Login success
      sessionStorage.setItem("guestLogin", login);
      window.location.href = `/rsvp.html?login=${login}`;
    } catch (err) {
      console.error(err);
      errorEl.textContent = "Unexpected error.";
    }
  });
});
