// guest.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Gastdaten global laden (z.B. basierend auf login/session)
export async function getGuest(login) {
  if (!login || typeof login !== "string") {
    throw new Error("Ungültiger Login (leer oder null).");
  }

  const q = query(collection(db, "guests"), where("login", "==", login));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("Gast nicht gefunden");
  }

  const docSnap = querySnapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}
