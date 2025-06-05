// ─── 1. POSITION EACH PLANET BY data-x / data-y ─────────────────────────────
document.querySelectorAll(".planet").forEach((planet) => {
  const xPct = parseFloat(planet.dataset.x); // e.g. 20
  const yPct = parseFloat(planet.dataset.y); // e.g. 30
  planet.style.left = `${xPct}%`;
  planet.style.top  = `${yPct}%`;
});


// ─── 2. ROCKET FOLLOWS CURSOR ───────────────────────────────────────────────
const rocket = document.getElementById("rocket");
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let rocketX = mouseX;
let rocketY = mouseY;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateRocket() {
  // Smoothly interpolate rocketX/Y toward mouseX/Y
  rocketX += (mouseX - rocketX) * 0.15;
  rocketY += (mouseY - rocketY) * 0.15;

  // Compute angle so rocket “points” toward mouse
  const dx = mouseX - rocketX;
  const dy = mouseY - rocketY;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

  rocket.style.transform = `translate(${rocketX - 30}px, ${rocketY - 30}px) rotate(${angle}deg)`;

  // Check debris collisions on each frame
  checkDebrisCollisions();

  requestAnimationFrame(animateRocket);
}
requestAnimationFrame(animateRocket);


// ─── 3. SPAWN & ANIMATE SPACE DEBRIS ───────────────────────────────────────
// Grab all .debris elements
const debrisElems = document.querySelectorAll(".debris");

debrisElems.forEach((deb) => {
  // Place each at a random (x, y) within the viewport
  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight;
  deb.style.left = `${startX}px`;
  deb.style.top  = `${startY}px`;

  // Randomize drift (3s–12s) and spin (2s–6s) durations and directions
  const driftDur = (3 + Math.random() * 9).toFixed(2);
  const spinDur  = (2 + Math.random() * 4).toFixed(2);
  const driftDir = Math.random() < 0.5 ? "normal" : "reverse";
  const spinDir  = Math.random() < 0.5 ? "normal" : "reverse";

  deb.style.animation = `
    drift ${driftDur}s ${driftDir} infinite,
    spin ${spinDur}s ${spinDir} infinite
  `;
});

// Helper: get bounding rect of an element
function getBounds(el) {
  return el.getBoundingClientRect();
}

// Check if rocket overlaps any debris → “break” the debris
function checkDebrisCollisions() {
  const rBounds = getBounds(rocket);
  debrisElems.forEach((deb) => {
    if (!deb.parentNode) return; // skip if already removed

    const dBounds = getBounds(deb);
    if (
      rBounds.left < dBounds.right &&
      rBounds.right > dBounds.left &&
      rBounds.top < dBounds.bottom &&
      rBounds.bottom > dBounds.top
    ) {
      // Collision! “explode” the debris
      explodeDebris(deb);
    }
  });
}

function explodeDebris(deb) {
  deb.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  deb.style.opacity = 0;
  deb.style.transform = "scale(0.5) rotate(45deg)";
  setTimeout(() => {
    if (deb.parentNode) deb.parentNode.removeChild(deb);
  }, 300);
}


// ─── 4. OPTIONAL: IF YOU WANT CLICK TO OPEN PROJECT LINK ────────────────────
// In this simplified version, the overlay already contains a direct GitHub link.
// If you want to, you could also make the entire planet clickable:
document.querySelectorAll(".planet").forEach((planet) => {
  const url = planet.dataset.link; // e.g. GitHub URL
  if (url) {
    planet.addEventListener("click", () => {
      window.open(url, "_blank");
    });
  }
});
