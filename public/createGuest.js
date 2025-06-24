import * as XLSX from 'xlsx/node';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper to create login
function createLogin(g1, g2) {
  const safe = (n) => (n || "").trim().toLowerCase().slice(0, 3);
  return safe(g1) + safe(g2);
}

// Read XLSX
const workbook = XLSX.readFile("guests.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

async function importGuests() {
  for (const row of rows) {
    const g1 = row["Vorname 1"];
    const g2 = row["Vorname 2"];
    const invite06 = row["06.09.2025"] === true;
    const invite09 = row["09.09.2025"] === true;

    const guest = {
      g1_firstname: g1,
      g2_firstname: g2,
      login: createLogin(g1, g2),
      contact: "",
      passw: "",
      g1_allergies: "",
      g2_allergies: "",
      invite06,
      invite09,
      RSVP06: false,
      RSVP09: false,
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "Guests"), guest);
      console.log(`✔ Added: ${guest.login}`);
    } catch (e) {
      console.error(`❌ Error adding ${guest.login}:`, e);
    }
  }
}

importGuests();
