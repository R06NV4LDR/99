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
      plus_one_allowed: g2 === "",
      plus_one_name: "",
      plus_one_foodinfos: "",
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
      console.log(`✔ Imported: ${guest.login}`);
    } catch (err) {
      console.error(`❌ Failed to import ${guest.login}`, err);
    }
  }
}

importGuests();
