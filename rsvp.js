// rsvp.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";
import { guest } from "./event.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  if (!guest) return;

  const events = document.querySelectorAll(".event");

  events.forEach(eventDiv => {
    const eventTitle = eventDiv.querySelector("h2")?.textContent?.trim();
    if (!eventTitle) return;

    const hasPlusOne = guest.plus_one_allowed;
    const hasPartner = guest.g2_firstname?.trim();
    const showSecond = hasPartner || hasPlusOne;

    const form = document.createElement("form");
    form.classList.add("rsvp-form");

    form.innerHTML = `
      <fieldset>
        <legend>Deine Antwort für "${eventTitle}"</legend>
        <label>
          <input type="checkbox" name="g1" />
          ${guest.g1_firstname} nimmt teil
        </label><br>

        ${showSecond ? `
          <label>
            <input type="checkbox" name="g2" />
            ${hasPartner ? guest.g2_firstname : "+1"} nimmt teil
          </label><br>
          ${!hasPartner && hasPlusOne ? `
            <input type="text" name="plus_one_name" placeholder="Name +1" />
          ` : ""}
        ` : ""}

        <textarea name="comment" placeholder="Kommentar (optional)" rows="2" style="width: 100%;"></textarea><br>
        <button type="submit">Antwort absenden</button>
        <p class="status" style="color: green;"></p>
      </fieldset>
    `;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const attending1 = form.querySelector('input[name="g1"]').checked;
      const attending2 = showSecond ? form.querySelector('input[name="g2"]')?.checked || false : null;
      const plusOneName = !hasPartner && hasPlusOne ? form.querySelector('input[name="plus_one_name"]').value.trim() : "";
      const comment = form.querySelector('textarea[name="comment"]').value.trim();

      const response = {
        login: guest.login,
        event: eventTitle,
        g1_attending: attending1,
        g2_attending: attending2,
        plus_one_name: plusOneName || null,
        comment,
        timestamp: serverTimestamp()
      };

      try {
        await addDoc(collection(db, "rsvp_responses"), response);
        form.querySelector(".status").textContent = "✅ Antwort gespeichert.";
      } catch (err) {
        console.error("RSVP Fehler:", err);
        form.querySelector(".status").textContent = "❌ Fehler beim Speichern.";
        form.querySelector(".status").style.color = "red";
      }
    });

    eventDiv.appendChild(form);
  });
});
