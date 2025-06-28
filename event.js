import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const container = document.getElementById("events-container");
const tabContainer = document.getElementById("tabs");
const tabButtons = document.getElementById("tab-buttons");
const tabContent = document.getElementById("tab-content");

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name)?.toLowerCase();
}

const login = getQueryParam("login");

if (!login) {
  container.innerHTML = "<p>🚫 Kein Benutzer angegeben.</p>";
} else {
  loadGuestAndEvents(login);
}

async function loadGuestAndEvents(login) {
  try {
    const guestsSnapshot = await getDocs(collection(db, "Guests"));
    const guestDoc = guestsSnapshot.docs.find(doc => doc.data().login.toLowerCase() === login);

    if (!guestDoc) {
      container.innerHTML = `<p>❌ Benutzer "${login}" wurde nicht gefunden.</p>`;
      return;
    }

   /* // Namen der Gäste anzeigen
    const guestNames = [];
    if (guest.g1_firstname) guestNames.push(guest.g1_firstname);
    if (guest.g2_firstname) guestNames.push(guest.g2_firstname);
    if (guestNames.length > 0) {
      const namesDiv = document.createElement("div");
      namesDiv.classList.add("guest-names");
      namesDiv.innerHTML = `<p>👋 Hi ${guestNames.join(" und ")}</p>`;
      container.appendChild(namesDiv);
    }
*/
    const guest = guestDoc.data();
    const allowed = [];
    if (guest.invite06) allowed.push("hochzeitsfest");
    if (guest.invite09) allowed.push("standesamt");

    if (allowed.length === 0) {
      container.innerHTML = "<p>🚫 Du hast keine gültige Einladung.</p>";
      return;
    }

    const eventsSnapshot = await getDocs(collection(db, "Events"));
    const allEvents = eventsSnapshot.docs.map(doc => doc.data());

    const filtered = allEvents.filter(event =>
      allowed.map(t => t.toLowerCase().trim()).includes(event.title?.toLowerCase().trim())
    );

    if (filtered.length === 0) {
      container.innerHTML = "<p>❌ Keine passenden Events gefunden.</p>";
      return;
    }

    container.innerHTML = ""; // leeren

    filtered.forEach(event => {
      const eventDiv = document.createElement("div");
      eventDiv.classList.add("event");

      eventDiv.innerHTML = `
        <h2>${event.title}</h2>
        ${event.EventInfo ? `<p>${event.EventInfo}</p>` : ""}
        ${event.date ? `<p>📅 ${new Date(event.date.seconds * 1000).toLocaleString("de-CH")}</p>` : ""}
        ${event.location ? `<p>📍 ${event.location}</p>` : ""}
        ${event.Anmeldeschluss ? `<p>📌 Anmeldeschluss: ${new Date(event.Anmeldeschluss.seconds * 1000).toLocaleString("de-CH")}</p>` : ""}
        ${event.address ? `<p>🏠 ${event.address}</p>` : ""}
        ${event.dresscode ? `<p>👗 Dresscode: ${event.dresscode}</p>` : ""}
        ${event.Programm?.length ? `<p>📋 Programm:<ul>${event.Programm.map(p => `<li>${p}</li>`).join("")}</ul></p>` : ""}
        ${event.ProgrammInfo ? `<p>ℹ️ ${event.ProgrammInfo}</p>` : ""}
        ${event.Anfahrt?.length ? `<p>🚗 Anfahrt:<ul>${event.Anfahrt.map(p => `<li>${p}</li>`).join("")}</ul></p>` : ""}
        ${event.BaselSBB?.[0] ? `<p>🚆 <a href="${event.BaselSBB[0]}" target="_blank">SBB-Verbindung</a></p>` : ""}
        ${event.map ? `<p>🗺️ <a href="${event.map}" target="_blank">Karte anzeigen</a></p>` : ""}
        ${event.Geschenke ? `<div id=gif<p>🗺️${event.Geschenke}</p>` : ""}
      `;

      container.appendChild(eventDiv);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>🔥 Fehler beim Laden der Einladung.</p>";
  }
}

// Theme toggle
function toggleTheme() {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
}

