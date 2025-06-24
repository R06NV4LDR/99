const XLSX = require("xlsx");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp } = require("firebase/firestore");
const { firebaseConfig } = require("./config.js");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper to create login
function createLogin(g1, g2) {
  const safe = (n) => (n || "").trim().toLowerCase().slice(0, 3);
  return safe(g1) + safe(g2);
}

// Read Excel
const workbook = XLSX.readFile("Guestlist.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

async function importGuests() {
  for (const row of rows) {
    const g1 = row["Vorname 1"];
    const g2 = row["Vorname 2"];

    const toBool = (v) => String(v).toLowerCase().trim() === "true";
    const invite06 = toBool(row["06.09.2025"]);
    const invite09 = toBool(row["09.09.2025"]);

    const guest = {
      g1_firstname: g1,
      g2_firstname: g2,
      plus_one_allowed: g2.trim() === "",
      plus_one_name: "",
      plus_one_attending: false,
      g1_attending06: false,
      g2_attending06: false,
      plus_one_attending06: false,
      g1_attending09: false,
      g2_attending09: false,
      plus_one_attending09: false,
      invite06,
      invite09,
      RSVP06: false,
      RSVP09: false,
      contact: "",
      login: createLogin(g1, g2),
      passw: "",
      confirmed: false,
      g1_allergies: "",
      g2_allergies: "",
      plus_one_allergies: "",
      last_updated: serverTimestamp()
    };


    try {
      await addDoc(collection(db, "Guests"), guest);
      console.log(`✔ Imported: ${guest.login}`);
    } catch (err) {
      console.error(`❌ Failed to import ${guest.login}`, err);
    }
  }
}

importGuests();
