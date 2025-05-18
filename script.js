const canvas = document.getElementById('cosmic-background');
const ctx = canvas.getContext('2d');
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const shuffleBtn = document.getElementById('shuffle-stars');

let width, height;
let stars = [];
let constellations = [];
let animationId;

const quotes = [
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "I think, therefore I am.", author: "René Descartes" },
  { text: "To be is to be perceived.", author: "George Berkeley" },
  { text: "One cannot step twice in the same river.", author: "Heraclitus" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle" },
  { text: "The only thing I know is that I know nothing.", author: "Socrates" },
  { text: "Man is the measure of all things.", author: "Protagoras" },
  { text: "God is dead.", author: "Friedrich Nietzsche" },
  { text: "Life must be understood backward. But it must be lived forward.", author: "Søren Kierkegaard" },
  { text: "The greatest happiness of the greatest number is the foundation of morals and legislation.", author: "Jeremy Bentham" }
];

// Star class
class Star {
  constructor(x, y, radius, speed, angle) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.angle = angle;
    this.baseX = x;
    this.baseY = y;
  }

  update() {
    this.angle += this.speed;
    this.x = this.baseX + Math.cos(this.angle) * 10;
    this.y = this.baseY + Math.sin(this.angle) * 10;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.shadowColor = '#88ffff';
    ctx.shadowBlur = 8;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Constellation class
class Constellation {
  constructor(stars) {
    this.stars = stars;
    this.rotation = 0;
    this.rotationSpeed = 0.001 + Math.random() * 0.002;
  }

  update() {
    this.rotation += this.rotationSpeed;
  }

  draw() {
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(136, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      const nextStar = this.stars[(i + 1) % this.stars.length];
      ctx.moveTo(star.x - width / 2, star.y - height / 2);
      ctx.lineTo(nextStar.x - width / 2, nextStar.y - height / 2);
    }
    ctx.stroke();
    ctx.restore();

    this.stars.forEach(star => star.draw());
  }
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

function createStars(count) {
  stars = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 1.5 + 0.5;
    const speed = (Math.random() - 0.5) * 0.02;
    const angle = Math.random() * Math.PI * 2;
    stars.push(new Star(x, y, radius, speed, angle));
  }
}

function createConstellations() {
  constellations = [];
  for (let i = 0; i < 3; i++) {
    const constellationStars = [];
    for (let j = 0; j < 5; j++) {
      const x = width / 2 + Math.cos((j / 5) * Math.PI * 2) * 100 + (Math.random() - 0.5) * 20;
      const y = height / 2 + Math.sin((j / 5) * Math.PI * 2) * 100 + (Math.random() - 0.5) * 20;
      constellationStars.push(new Star(x, y, 2, 0, 0));
    }
    constellations.push(new Constellation(constellationStars));
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  stars.forEach(star => {
    star.update();
    star.draw();
  });

  constellations.forEach(constellation => {
    constellation.update();
    constellation.draw();
  });

  animationId = requestAnimationFrame(animate);
}

function shuffleStars() {
  createStars(100);
  createConstellations();
  displayRandomQuote();
}

function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteText.textContent = `"${quote.text}"`;
  quoteAuthor.textContent = `- ${quote.author}`;
}

window.addEventListener('resize', () => {
  resize();
  shuffleStars();
});

shuffleBtn.addEventListener('click', () => {
  shuffleStars();
});

function init() {
  resize();
  createStars(100);
  createConstellations();
  displayRandomQuote();
  animate();
}

init();
