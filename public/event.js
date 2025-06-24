import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js"; // your actual config.js file

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get ?login=xyz
const params = new URLSearchParams(window.location.search);
const login = params.get("login");

if (!login) {
  alert("Ungültiger Zugriff – kein Login gefunden.");
  window.location.href = "index.html";
}

// Fetch guest by login
const guestRef = doc(db, "Guests", login);
const guestSnap = await getDoc(guestRef);

if (!guestSnap.exists()) {
  alert("Gast nicht gefunden.");
  window.location.href = "index.html";
}

const guest = guestSnap.data();
const container = document.getElementById("event-details");
container.innerHTML = `
  <p>👋 Willkommen, ${guest.g1_firstname}${guest.g2_firstname ? " & " + guest.g2_firstname : ""}</p>
  <p>Einladung für:</p>
  ${guest.invite06 ? "<p>🌿 Samstag (06.09)</p>" : ""}
  ${guest.invite09 ? "<p>🥂 Dienstag (09.09)</p>" : ""}
`;

document.getElementById("rsvp-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const rsvpData = {
    attending: form.attending.value,
    guests: parseInt(form.guests.value),
    allergies: form.allergies.value,
    updated: new Date()
  };

  await setDoc(doc(db, "rsvps", login), rsvpData);
  alert("Danke für deine Rückmeldung!");
});
