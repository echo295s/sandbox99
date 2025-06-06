import { ElementManager } from './elements.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const manager = new ElementManager();

function drawPoint(x, y) {
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawLine(x1, y1, x2, y2) {
  ctx.strokeStyle = '#333';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Object.values(manager.elements).forEach(el => {
    if (el.type === 'point') {
      drawPoint(el.x, el.y);
    } else if (el.type === 'line') {
      const start = manager.getElement(el.startPointId);
      if (!start) return;
      const rad = (el.angle * Math.PI) / 180;
      const endX = start.x + el.length * Math.cos(rad);
      const endY = start.y + el.length * Math.sin(rad);
      drawLine(start.x, start.y, endX, endY);
    }
  });
}

// expose for manual testing
window.elementManager = manager;
window.redraw = draw;
