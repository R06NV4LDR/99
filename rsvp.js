import { guest } from "./event.js"; // nutzt bereits geladenen Gast

const container = document.getElementById("rsvp-container");

if (!guest) {
    container.innerHTML = "<p>⚠️ Gastdaten fehlen. Bitte erneut einloggen.</p>";
} else {
    const events = [];

    if (guest.invite06) {
        events.push({
            title: "Hochzeitsfest",
            date: "Samstag, 6. September 2025",
            keys: ["g1_attending06", "g2_attending06", "plus_one_attending06"],
        });
    }

    if (guest.invite09) {
        events.push({
            title: "Standesamt",
            date: "Dienstag, 9. September 2025",
            keys: ["g1_attending09", "g2_attending09", "plus_one_attending09"],
        });
    }

    if (events.length === 0) {
        container.innerHTML = "<p>🚫 Du bist zu keinem Event eingeladen.</p>";
    } else {
        events.forEach(event => {
            const section = document.createElement("section");
            section.classList.add("rsvp-block");

            const title = `<h2>${event.title}</h2><p>${event.date}</p>`;
            let form = "<form>";

            if (guest.g1_firstname) {
                form += `<label>${guest.g1_firstname} kommt: <input type="checkbox" data-key="${event.keys[0]}" ${guest[event.keys[0]] ? "checked" : ""}></label><br>`;
            }

            if (guest.g2_firstname) {
                form += `<label>${guest.g2_firstname} kommt: <input type="checkbox" data-key="${event.keys[1]}" ${guest[event.keys[1]] ? "checked" : ""}></label><br>`;
            }

            if (guest.plus_one_allowed) {
                form += `<label>Plus 1 (${guest.plus_one_name || "Name folgt"}) kommt: <input type="checkbox" data-key="${event.keys[2]}" ${guest[event.keys[2]] ? "checked" : ""}></label><br>`;
            }

            form += `<button type="submit">Antwort speichern</button></form>`;
            section.innerHTML = title + form;
            container.appendChild(section);

            section.querySelector("form").addEventListener("submit", async e => {
                e.preventDefault();
                const { doc, updateDoc, getFirestore } = await import("https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js");
                const db = getFirestore();
                const guestRef = doc(db, "guests", guest.id);

                const updates = {};
                section.querySelectorAll("input[type=checkbox]").forEach(input => {
                    updates[input.dataset.key] = input.checked;
                    guest[input.dataset.key] = input.checked;
                });

                try {
                    updates.login = guest.login;
                    updates.passw = guest.passw;
                    await updateDoc(guestRef, updates);
                    alert("✅ Antwort gespeichert!");
                } catch (err) {
                    console.error(err);
                    alert("❌ Fehler beim Speichern.");
                }

            });
        });
    }
}
