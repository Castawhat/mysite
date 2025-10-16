// count.js - countdown to Oct 27, 2025
(function() {
  const target = new Date('2025-10-27T00:00:00');
  const el = document.getElementById('countdown-timer');
  if (!el) return;

  function update() {
    const now = new Date();
    let diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
    diff -= hours * (1000 * 60 * 60);
    const minutes = String(Math.floor(diff / (1000 * 60))).padStart(2, '0');
    diff -= minutes * (1000 * 60);
    const seconds = String(Math.floor(diff / 1000)).padStart(2, '0');

  el.textContent = `${days} days, ${hours}:${minutes}:${seconds}`;

    if (target - now <= 0) {
      clearInterval(interval);
      el.textContent = `It's today!`;
    }
  }

  update();
  const interval = setInterval(update, 1000);
})();
