function getRandomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function createFireworks(button, colors, nColor) {
  const fireworkContainer = document.createElement("div");
  fireworkContainer.className = "firework-container";
  button.appendChild(fireworkContainer);

  const particlesCount = 15;

  for (let i = 0; i < particlesCount; i++) {
    const particle = document.createElement("div");
    particle.className = "firework-particle";

    const angle = (Math.PI * 2 * i) / particlesCount;
    const dx = Math.cos(angle) + (Math.random() - 0.5) * 0.5;
    const dy = Math.sin(angle) + (Math.random() - 0.5) * 0.5;
    const size = getRandomInRange(8, 16);
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particle.style.setProperty("--dx", dx);
    particle.style.setProperty("--dy", dy);
    particle.style.background = `${colors[i % nColor]}`;

    fireworkContainer.appendChild(particle);
  }

  setTimeout(() => {
    fireworkContainer.remove();
  }, 1000);
}

export default createFireworks;
