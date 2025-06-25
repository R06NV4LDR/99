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
      container.innerHTML = `<p>❌ Benutzer "${login}" nicht gefunden.</p>`;
      return;
    }

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

    console.log("📦 Events geladen:", allEvents);
    console.log("👤 Erlaubte Titel:", allowed);
    console.log("📦 Alle Events:", allEvents.map(e => `"${e.title}"`));


    const filtered = allEvents.filter(event =>
      allowed.map(t => t.toLowerCase().trim()).includes(event.title?.toLowerCase().trim())
    );

    if (filtered.length === 0) {
      container.innerHTML = "<p>❌ Keine passenden Events gefunden.</p>";
      return;
    }

    tabContainer.style.display = "block";
    container.style.display = "none";

    filtered.forEach((event, index) => {
      const button = document.createElement("button");
      button.textContent = event.title;
      button.classList.add("tab-button");
      if (index === 0) button.classList.add("active");
      button.addEventListener("click", () => showTab(index));
      tabButtons.appendChild(button);

      const content = document.createElement("div");
      content.classList.add("event");
      if (index === 0) content.classList.add("active");

      content.innerHTML = `
        <h2>${event.title}</h2>
        ${event.EventInfo ? `<p>${event.EventInfo}</p>` : ""}
        ${event.date ? `<p>📅 ${new Date(event.date.seconds * 1000).toLocaleString("de-CH")}</p>` : ""}
        ${event.location ? `<p>📍 ${event.location}</p>` : ""}
        ${event.address ? `<p>🏠 ${event.address}</p>` : ""}
        ${event.dresscode ? `<p>👗 Dresscode: ${event.dresscode}</p>` : ""}
        ${event.map ? `<p>🗺️ <a href="${event.map}" target="_blank">Karte anzeigen</a></p>` : ""}
        ${event.Programm?.length ? `<p>📋 Programm:<ul>${event.Programm.map(p => `<li>${p}</li>`).join("")}</ul></p>` : ""}
        ${event.Anfahrt?.length ? `<p>🚗 Anfahrt:<ul>${event.Anfahrt.map(p => `<li>${p}</li>`).join("")}</ul></p>` : ""}
        ${event.BaselSBB?.[0] ? `<p>🚆 <a href="${event.BaselSBB[0]}" target="_blank">SBB-Verbindung</a></p>` : ""}
        ${event.Anmeldeschluss ? `<p>📌 Anmeldeschluss: ${new Date(event.Anmeldeschluss.seconds * 1000).toLocaleString("de-CH")}</p>` : ""}
      `;

      tabContent.appendChild(content);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>🔥 Fehler beim Laden der Einladung.</p>";
  }
}

function showTab(index) {
  const allButtons = tabButtons.querySelectorAll(".tab-button");
  const allTabs = tabContent.querySelectorAll(".event");

  allButtons.forEach(btn => btn.classList.remove("active"));
  allTabs.forEach(tab => tab.classList.remove("active"));

  allButtons[index].classList.add("active");
  allTabs[index].classList.add("active");
}

// Theme toggle
function toggleTheme() {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
}

