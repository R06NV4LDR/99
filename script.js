// Floating rockets animation ®
function createRocket() {
  const rocket = document.createElement('div');
  rocket.classList.add('rocket');
  rocket.style.left = Math.random() * 100 + "vw";
  rocket.textContent = '🚀';
  document.body.appendChild(rocket);

  setTimeout(() => rocket.remove(), 10000);
}
setInterval(createRocket, 300);

// Countdown logic
const partyDate = new Date("2025-09-06T13:00:00").getTime();

const weddingDate = new Date("2025-09-09T11:00:00").getTime();
const countdown = document.getElementById("countdown");

setInterval(() => {
  const now = new Date().getTime();
  const distance = partyDate - now;

  if (distance < 0) {
    countdown.innerHTML = "🎉 The party has started! 🎉";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  countdown.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s until the party!`;
}, 1000);

setInterval(() => {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance < 0) {
    countdown.innerHTML = "🎉 We're married! 🎉";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  countdown.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}, 1000);

// Theme toggle
function toggleTheme() {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
}
