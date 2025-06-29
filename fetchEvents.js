import {
  getFirestore,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// nur Events laden, für die der Gast eingeladen ist
export async function fetchEventsForGuest(guest) {
  const q = query(
    collection(db, "events"),
    where("invitees", "array-contains", guest.login)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
