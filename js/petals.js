/**
 * Petals Canvas Animation - Falling Flower Petals Effect
 * Highly optimized, responsive, and battery-friendly.
 */

(function () {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const TOTAL_PETALS = window.innerWidth < 640 ? 22 : 36;
  const petals = [];

  // Romantic color palette for petals: shades of crimson, rose red, blush pink, and subtle gold
  const petalColors = [
    'rgba(217, 38, 56, 0.65)',
    'rgba(186, 24, 40, 0.6)',
    'rgba(235, 87, 87, 0.55)',
    'rgba(255, 183, 197, 0.65)',
    'rgba(212, 175, 55, 0.5)'
  ];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 8 + 8; // Size between 8 and 16
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 1.5;
      this.swing = Math.random() * Math.PI * 2;
      this.swingSpeed = Math.random() * 0.02 + 0.01;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
    }

    update() {
      this.y += this.speedY;
      this.swing += this.swingSpeed;
      this.x += Math.sin(this.swing) * 0.75 + this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      // Draw smooth romantic petal curve
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size * 1.4);
      ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);

      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < TOTAL_PETALS; i++) {
    petals.push(new Petal());
  }

  let animationFrameId = null;
  let isRunning = true;

  function animate() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // Optimize when user switches tab
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else {
      isRunning = true;
      animate();
    }
  });

  animate();
})();
