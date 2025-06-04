// ─── 1. PROJECT DATA STORE ───────────────────────────────────────────────────
// You can expand this object to include all your projects.
// Each key matches a `data-project-id` value on the HTML card.
const projectData = {
  "led-blinker": {
    name: "Blinking LED Driver",
    flavor: "A microcontroller‐based LED driver that uses a 555 timer to flash an LED at 1 Hz. Keeps current constant at 20 mA.",
    voltage: "5 V",
    current: "20 mA",
    type: "Embedded Systems (🌀)",
    // For the tech radar, we list pairs [label, percentageOutOf100]
    techRadar: [
      ["C/C++", 40],
      ["Verilog", 0],
      ["MATLAB", 10],
      ["LTspice", 50],
    ],
  },

  // Add more entries here...
  // "another-project-id": { name: "...", flavor: "...", voltage: "...", current: "...", type: "...", techRadar: [ ... ] }
};

// ─── 2. WHEN A CARD IS CLICKED → SHOW PANEL ────────────────────────────────────
const cards = document.querySelectorAll(".project-card");
const pokedexPanel = document.getElementById("pokedex-panel");
const closeBtn = document.getElementById("close-panel");

// Elements inside panel to populate:
const nameField = document.getElementById("proj-name");
const flavorField = document.getElementById("proj-flavor");
const voltageField = document.getElementById("stat-voltage");
const currentField = document.getElementById("stat-current");
const typeField = document.getElementById("stat-type");

const radarSVG = document.getElementById("radar-chart");
const radarLegend = document.getElementById("radar-legend");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const id = card.dataset.projectId; // e.g. "led-blinker"
    const data = projectData[id];
    if (!data) return;

    // 2.1 Populate text fields
    nameField.textContent = data.name;
    flavorField.textContent = data.flavor;
    voltageField.textContent = data.voltage;
    currentField.textContent = data.current;
    typeField.textContent = data.type;

    // 2.2 Draw the tech radar chart
    drawRadarChart(data.techRadar);

    // 2.3 Show the panel
    pokedexPanel.classList.add("visible");
  });
});

// 2.4 Close button hides panel
closeBtn.addEventListener("click", () => {
  pokedexPanel.classList.remove("visible");
});

// ─── 3. DRAW RADAR CHART (SIMPLE SVG PIE CHART) ───────────────────────────────
function drawRadarChart(radarData) {
  // Clear previous SVG content
  while (radarSVG.firstChild) {
    radarSVG.removeChild(radarSVG.firstChild);
  }
  radarLegend.innerHTML = "";

  const centerX = 100;
  const centerY = 100;
  const radius = 80;

  // Sum of all percentages in radarData
  const total = radarData.reduce((sum, [, pct]) => sum + pct, 0) || 100;

  let startAngle = 0; // in degrees
  radarData.forEach(([label, value], index) => {
    const sliceAngle = (value / total) * 360;
    const endAngle = startAngle + sliceAngle;

    // Convert degrees to radians
    const startRadians = (Math.PI / 180) * startAngle;
    const endRadians = (Math.PI / 180) * endAngle;

    // Compute arc endpoint coordinates
    const x1 = centerX + radius * Math.cos(startRadians);
    const y1 = centerY + radius * Math.sin(startRadians);
    const x2 = centerX + radius * Math.cos(endRadians);
    const y2 = centerY + radius * Math.sin(endRadians);

    // Flag for large arc (slice > 180°)
    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    // Create SVG path for this slice
    const pathData = [
      `M ${centerX} ${centerY}`,               // Move to center
      `L ${x1} ${y1}`,                         // Line to start arc
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arc
      `Z`,                                     // Close path to center
    ].join(" ");

    // Random pastel color for each slice
    const hue = (index * 60) % 360; // vary hue by index
    const fillColor = `hsl(${hue}, 70%, 50%)`;

    const pathElem = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElem.setAttribute("d", pathData);
    pathElem.setAttribute("fill", fillColor);
    pathElem.setAttribute("stroke", "#1E1E1E");
    pathElem.setAttribute("stroke-width", "1");
    radarSVG.appendChild(pathElem);

    // Add a legend bullet & label
    const li = document.createElement("li");
    const bullet = document.createElement("span");
    bullet.classList.add("legend-color");
    bullet.style.background = fillColor;
    li.appendChild(bullet);
    const text = document.createTextNode(label);
    li.appendChild(text);
    radarLegend.appendChild(li);

    startAngle += sliceAngle;
  });
}
