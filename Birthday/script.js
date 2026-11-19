const h1  = document.querySelector('h1');
const text = h1 .childNodes;

// wrap each letter in a span, skipping mark tags
text.forEach(node => {
  if (node.nodeType === 3) { // plain text node
    const letters = node.textContent.split('').map(char => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.cssText = `
        display: inline-block;
        animation: wave 2.5s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
      `;
      return span;
    });
    const fragment = document.createDocumentFragment();
    letters.forEach(l => fragment.appendChild(l));
    node.replaceWith(fragment);
  }
});






const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pieces = [];

const colors = ['#ff4444', '#ff9900', '#ffff00', '#00cc44', '#3399ff', '#cc44ff', '#ff66aa'];

function spawnConfetti() {
  for (let i = 0; i < 200; i++) {
    pieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 12,
      speedY: (Math.random() - 0.5) * 12,
      gravity: 0.3,
      alpha: 1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 5
    });
  }
  animate();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces = pieces.filter(p => p.alpha > 0);

  pieces.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.speedY += p.gravity;
    p.alpha -= 0.012;
    p.rotation += p.rotationSpeed;

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  });

  if (pieces.length > 0) requestAnimationFrame(animate);
}

document.addEventListener('click', function () {
  document.getElementById('mySong').play();
  document.getElementById('musicText').style.display = 'none';
  spawnConfetti();
}, { once: true });