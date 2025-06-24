document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const login = document.getElementById("login").value.trim().toLowerCase();
  const passw = document.getElementById("passw").value;

  const q = query(collection(db, "Guests"), where("login", "==", login));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return showError("Login not found.");
  }

  const guest = snapshot.docs[0].data();

  if (!bcrypt.compareSync(passw, guest.passw)) {
    return showError("Incorrect password.");
  }

  // success
  sessionStorage.setItem("guestLogin", login);
  window.location.href = `/rsvp.html?login=${login}`;
});
