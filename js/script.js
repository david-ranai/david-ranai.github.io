// ─── 1. POSITION EACH PLANET BY data-x / data-y ─────────────────────────────
document.querySelectorAll(".planet").forEach((planet) => {
  const xPct = parseFloat(planet.dataset.x); // 0…100
  const yPct = parseFloat(planet.dataset.y); // 0…100
  planet.style.left = `${xPct}%`;
  planet.style.top  = `${yPct}%`;
});


// ─── 2. ROCKET-FOLLOWER LOGIC ────────────────────────────────────────────────
const rocket = document.getElementById("rocket");
const rocketShadow = document.getElementById("rocket-shadow");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let rocketX = mouseX;
let rocketY = mouseY;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateRocket() {
  // 2.1 Smoothly interpolate rocketX/Y → mouseX/Y
  rocketX += (mouseX - rocketX) * 0.15;
  rocketY += (mouseY - rocketY) * 0.15;

  // 2.2 Compute angle so rocket “points” toward the cursor
  const dx = mouseX - rocketX;
  const dy = mouseY - rocketY;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; 
  // (+90° because rocket image is drawn pointing “up”)

  rocket.style.transform = `translate(${rocketX}px, ${rocketY}px) rotate(${angle}deg)`;
  rocket.style.left = '0';  // we override left/top in transform
  rocket.style.top  = '0';  

  // 2.3 Check if rocket overlaps any planet to show/hide shadow
  checkPlanetOverlap();
  
  requestAnimationFrame(animateRocket);
}
requestAnimationFrame(animateRocket);


// ─── 3. DETECT OVERLAP BETWEEN ROCKET & ANY PLANET ──────────────────────────
function checkPlanetOverlap() {
  const rBounds = rocket.getBoundingClientRect();
  let isOverPlanet = false;

  document.querySelectorAll(".planet").forEach((planet) => {
    const pBounds = planet.getBoundingClientRect();
    // Simple AABB collision test:
    if (
      rBounds.left < pBounds.right &&
      rBounds.right > pBounds.left &&
      rBounds.top < pBounds.bottom &&
      rBounds.bottom > pBounds.top
    ) {
      isOverPlanet = true;
    }
  });

  if (isOverPlanet) {
    // Position shadow directly under rocket, slightly below rocketY
    rocketShadow.style.transform = `translate(${rocketX}px, ${rocketY + 20}px)`;
    rocketShadow.style.opacity = 1;
  } else {
    rocketShadow.style.opacity = 0;
  }
}


// ─── 4. OPTIONAL: Make Planets Clickable (opens a GitHub link) ──────────────
document.querySelectorAll(".planet").forEach((planet) => {
  const projectName = planet.dataset.name;
  // If you want to route clicks somewhere, you could store a data-link attribute,
  // e.g. data-link="https://github.com/david-ranai/led-blinker" and then:
  // const url = planet.dataset.link; if (url) planet.addEventListener("click", () => window.open(url, "_blank"));
  planet.addEventListener("click", () => {
    alert(`You clicked on: ${projectName}`);
  });
});
