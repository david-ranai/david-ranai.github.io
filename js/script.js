// ─── 1. PLACE EACH PLANET FROM data-x / data-y ──────────────────────────────
document.querySelectorAll(".planet").forEach((planet) => {
  const xPercent = parseFloat(planet.dataset.x); // 0…100
  const yPercent = parseFloat(planet.dataset.y);

  // Set inline CSS top/left (as percentages of universe width/height)
  planet.style.left = `${xPercent}%`;
  planet.style.top  = `${yPercent}%`;
});


// ─── 2. ROCKET-FOLLOWER LOGIC ────────────────────────────────────────────────
const rocket = document.getElementById("rocket");
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Smooth-follow parameters
let rocketX = mouseX;
let rocketY = mouseY;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// On each animation frame, nudge rocket toward cursor
function animateRocket() {
  // Interpolate (lerp) rocket position → cursor position
  rocketX += (mouseX - rocketX) * 0.15;
  rocketY += (mouseY - rocketY) * 0.15;

  // Compute angle so rocket “points” toward cursor
  const dx = mouseX - rocketX;
  const dy = mouseY - rocketY;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // rotate so nose faces cursor

  rocket.style.transform = `translate(${rocketX - 30}px, ${rocketY - 30}px) rotate(${angle}deg)`;
  // (subtract 30 so that rocket.png’s center is at rocketX,rocketY if rocket.png is 60×60)

  // Check collisions with debris
  checkDebrisCollisions();

  requestAnimationFrame(animateRocket);
}
requestAnimationFrame(animateRocket);


// ─── 3. RANDOM DEBRIS GENERATION & COLLISION ─────────────────────────────────
// On load, position each .debris at a random spot inside #universe, give it animation speeds.
const universe = document.getElementById("universe");
const debrisElements = document.querySelectorAll(".debris");

debrisElements.forEach((deb) => {
  // Random starting X/Y inside universe
  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight;
  deb.style.left = `${startX}px`;
  deb.style.top  = `${startY}px`;

  // Random drift duration (3s to 12s) and spin duration (2s to 6s)
  const driftDuration = 3 + Math.random() * 9;   // between 3 and 12 s
  const spinDuration  = 2 + Math.random() * 4;   // between 2 and 6 s
  const driftDir      = Math.random() < 0.5 ? "normal" : "reverse";
  const spinDir       = Math.random() < 0.5 ? "normal" : "reverse";

  deb.style.animation = `
    drift ${driftDuration}s ${driftDir} infinite,
    spin  ${spinDuration}s ${spinDir} infinite
  `;
});

// Helper: get bounding box of rocket & debris
function getBounds(el) {
  return el.getBoundingClientRect();
}

// On each frame, check if rocket overlaps any debris; if so, “break” that debris
function checkDebrisCollisions() {
  const rocketBounds = getBounds(rocket);
  debrisElements.forEach((deb) => {
    if (!deb) return;
    const debBounds = getBounds(deb);

    // AABB collision detection
    if (
      rocketBounds.left < debBounds.right &&
      rocketBounds.right > debBounds.left &&
      rocketBounds.top < debBounds.bottom &&
      rocketBounds.bottom > debBounds.top
    ) {
      // Collision detected → “break” debris
      explodeDebris(deb);
    }
  });
}

function explodeDebris(deb) {
  // Replace debris image with a small “explosion” or simply fade out
  deb.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  deb.style.opacity = 0;
  deb.style.transform = "scale(0.5) rotate(45deg)";

  // After fade, remove from DOM so we don’t check it again
  setTimeout(() => {
    if (deb.parentNode) deb.parentNode.removeChild(deb);
  }, 300);
}


// ─── 4. POKÉDEX PANEL LOGIC (unchanged from before, except we adapt selectors) ──
const projectData = {
  "led-blinker": {
    name: "Blinking LED Driver",
    flavor: "A microcontroller–based LED driver that uses a 555 timer to flash an LED at 1 Hz. Keeps current at 20 mA.",
    voltage: "5 V",
    current: "20 mA",
    type: "Embedded Systems (🌀)",
    techRadar: [
      ["C/C++", 40],
      ["Verilog", 0],
      ["MATLAB", 10],
      ["LTspice", 50],
    ],
  },
  // …add more project entries here matching your data-project-id…
};

const cards = document.querySelectorAll(".project-card");
const pokedexPanel = document.getElementById("pokedex-panel");
const closeBtn = document.getElementById("close-panel");
const nameField = document.getElementById("proj-name");
const flavorField = document.getElementById("proj-flavor");
const voltageField = document.getElementById("stat-voltage");
const currentField = document.getElementById("stat-current");
const typeField = document.getElementById("stat-type");
const radarSVG = document.getElementById("radar-chart");
const radarLegend = document.getElementById("radar-legend");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const id = card.parentElement.dataset.projectId; // parent is .planet
    const data = projectData[id];
    if (!data) return;

    // Populate panel fields
    nameField.textContent = data.name;
    flavorField.textContent = data.flavor;
    voltageField.textContent = data.voltage;
    currentField.textContent = data.current;
    typeField.textContent = data.type;

    // Draw radar
    drawRadarChart(data.techRadar);

    // Show panel
    pokedexPanel.classList.add("visible");
  });
});

closeBtn.addEventListener("click", () => {
  pokedexPanel.classList.remove("visible");
});

function drawRadarChart(radarData) {
  // Clear any existing slices
  while (radarSVG.firstChild) {
    radarSVG.removeChild(radarSVG.firstChild);
  }
  radarLegend.innerHTML = "";

  const centerX = 100;
  const centerY = 100;
  const radius = 80;
  const total = radarData.reduce((sum, [, pct]) => sum + pct, 0) || 100;

  let startAngle = 0;
  radarData.forEach(( [label, value], idx ) => {
    const sliceAngle = (value / total) * 360;
    const endAngle = startAngle + sliceAngle;
    const startRad = (Math.PI/180) * startAngle;
    const endRad   = (Math.PI/180) * endAngle;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    const largeArc = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `Z`
    ].join(" ");

    const hue = (idx * 60) % 360;
    const fillColor = `hsl(${hue}, 70%, 50%)`;

    const pathElem = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElem.setAttribute("d", pathData);
    pathElem.setAttribute("fill", fillColor);
    pathElem.setAttribute("stroke", "#1E1E1E");
    pathElem.setAttribute("stroke-width", "1");
    radarSVG.appendChild(pathElem);

    // Legend
    const li = document.createElement("li");
    const bullet = document.createElement("span");
    bullet.classList.add("legend-color");
    bullet.style.background = fillColor;
    li.appendChild(bullet);
    li.appendChild(document.createTextNode(label));
    radarLegend.appendChild(li);

    startAngle += sliceAngle;
  });
}
