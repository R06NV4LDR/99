import { getGuest } from "./guest.js";
import { fetchEventsForGuest } from "./fetchEvents.js";

// global holen
const login = localStorage.getItem("login");
const guest = await getGuest(login);
const events = await fetchEventsForGuest(guest);

// direkt an window weitergeben (optional)
window.guest = guest;

const container = document.getElementById("events-container");

events.forEach(event => {
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
  `;
  container.appendChild(eventDiv);
});

// 🔁 Gast speichern (nur für rsvp.js Zugriff)
export { guest };
