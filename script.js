const loader = document.getElementById("loader");
const scrollProgress = document.getElementById("scrollProgress");
const openHeart = document.getElementById("openHeart");
const letterCard = document.getElementById("letterCard");
const themeToggle = document.getElementById("themeToggle");
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");
const typingText = document.getElementById("typingText");
const giftBox = document.getElementById("giftBox");
const giftMessage = document.getElementById("giftMessage");
const stars = document.getElementById("stars");
const particles = document.getElementById("particles");
const floatingElements = document.getElementById("floatingElements");
const cursorGlow = document.getElementById("cursorGlow");
const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");

const typedLine =
  "Every heartbeat of today whispers one truth: I cherish you, deeply and always.";
let typingIndex = 0;
let confettiBits = [];
let heartBurst = [];

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hide"), 500);
  typingLoop();
});

openHeart.addEventListener("click", (event) => {
  event.preventDefault();
  letterCard.classList.add("open");
  letterCard.setAttribute("aria-hidden", "false");
  document.getElementById("apology").scrollIntoView({ behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((section) => revealObserver.observe(section));

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
});

musicToggle.addEventListener("click", async () => {
  if (bgMusic.paused) {
    try {
      await bgMusic.play();
      musicToggle.textContent = "⏸️";
    } catch (_error) {
      musicToggle.textContent = "🎵";
    }
  } else {
    bgMusic.pause();
    musicToggle.textContent = "🎵";
  }
});

function typingLoop() {
  if (typingIndex <= typedLine.length) {
    typingText.textContent = typedLine.slice(0, typingIndex);
    typingIndex += 1;
    setTimeout(typingLoop, 38);
  }
}

function seedElements(container, count, symbolFn, className) {
  for (let i = 0; i < count; i += 1) {
    const node = document.createElement("span");
    node.className = className;
    node.style.left = `${Math.random() * 100}%`;
    node.style.top = `${Math.random() * 100}%`;
    node.style.animationDelay = `${Math.random() * 8}s`;
    if (symbolFn) {
      node.textContent = symbolFn();
      node.style.setProperty("--fall-duration", `${8 + Math.random() * 10}s`);
      node.style.left = `${Math.random() * 100}vw`;
      node.style.top = `${-20 - Math.random() * 200}px`;
    }
    container.appendChild(node);
  }
}

seedElements(stars, 90, null, "star");
seedElements(particles, 30, null, "particle");
seedElements(
  floatingElements,
  28,
  () => (Math.random() > 0.5 ? "❤" : "❀"),
  "floating-icon"
);

if (window.matchMedia("(pointer:fine)").matches) {
  window.addEventListener("mousemove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function launchSurprise() {
  if (!giftBox.classList.contains("open")) {
    giftBox.classList.add("open");
    giftMessage.classList.add("show");
  }

  confettiBits = Array.from({ length: 140 }, () => ({
    x: window.innerWidth / 2,
    y: window.innerHeight * 0.62,
    vx: (Math.random() - 0.5) * 7,
    vy: Math.random() * -7 - 2,
    size: Math.random() * 5 + 4,
    color: ["#ffd983", "#ffc8ea", "#f5e2ff", "#ffffff"][Math.floor(Math.random() * 4)],
    life: 120,
  }));

  heartBurst = Array.from({ length: 26 }, () => ({
    x: window.innerWidth / 2,
    y: window.innerHeight * 0.6,
    vx: (Math.random() - 0.5) * 5,
    vy: Math.random() * -4 - 1,
    life: 80,
  }));
}

giftBox.addEventListener("click", launchSurprise);

function animateParticles() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiBits = confettiBits.filter((bit) => bit.life > 0);
  confettiBits.forEach((bit) => {
    bit.x += bit.vx;
    bit.y += bit.vy;
    bit.vy += 0.08;
    bit.life -= 1;

    ctx.fillStyle = bit.color;
    ctx.fillRect(bit.x, bit.y, bit.size, bit.size * 0.7);
  });

  heartBurst = heartBurst.filter((heart) => heart.life > 0);
  heartBurst.forEach((heart) => {
    heart.x += heart.vx;
    heart.y += heart.vy;
    heart.vy += 0.05;
    heart.life -= 1;

    ctx.save();
    ctx.globalAlpha = heart.life / 80;
    ctx.fillStyle = "#ff89cf";
    ctx.font = "20px serif";
    ctx.fillText("❤", heart.x, heart.y);
    ctx.restore();
  });

  requestAnimationFrame(animateParticles);
}

resizeCanvas();
animateParticles();
window.addEventListener("resize", resizeCanvas);
