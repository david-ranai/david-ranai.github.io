// Grab the overlay element
const overlay = document.querySelector(".hero-overlay");

// Listen for mouse movement over the entire window
window.addEventListener("mousemove", (e) => {
  // Calculate cursor position as a fraction of viewport (centered at 0)
  const xRatio = e.clientX / window.innerWidth - 0.5; // range [-0.5, +0.5]
  const yRatio = e.clientY / window.innerHeight - 0.5;

  // How many pixels max you want the overlay to shift
  const maxShift = 20;

  // Compute translate offsets
  const xOffset = xRatio * maxShift;
  const yOffset = yRatio * maxShift;

  // Apply the translation
  overlay.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
});
