import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js"; // Assuming you have a config.js file for Firebase config
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    alert("Invite not found.");
    return;
  }

  const data = userSnap.data();
  const container = document.getElementById("event-details");
// TODO: Event details should be dynamically loaded from Firestore
  if (data.eventA) container.innerHTML += `<p>🎉 You're invited to <strong>Event A</strong>!</p>`;
  if (data.eventB) container.innerHTML += `<p>🍾 You're invited to <strong>Event B</strong>!</p>`;

  document.getElementById("rsvp-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const rsvpData = {
      attending: form.attending.value,
      guests: parseInt(form.guests.value),
      allergies: form.allergies.value,
      timestamp: new Date()
    };

    await setDoc(doc(db, "rsvps", user.uid), rsvpData);
    alert("RSVP submitted. Thank you!");
  });
});
