import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore();

// Fetch all events
async function fetchEvents() {
  const querySnapshot = await getDocs(collection(db, "events"));
  const events = [];
  querySnapshot.forEach((doc) => {
    events.push({ id: doc.id, ...doc.data() });
  });
  return events;
}

// Display in DOM
fetchEvents().then(events => {
  const container = document.getElementById("event-list");
  events.forEach(event => {
    const el = document.createElement("div");
    el.innerHTML = `
      <h3>${event.title}</h3>
      <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <p><strong>Dress Code:</strong> ${event.dressCode}</p>
      <p>${event.description}</p>
    `;
    container.appendChild(el);
  });
});
