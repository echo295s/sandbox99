const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const colors = [
  '#d32f2f', '#388e3c', '#1976d2', '#fbc02d',
  '#7b1fa2', '#00796b', '#5d4037', '#455a64'
];
let colorIndex = 0;
const labelStyles = {};
// 描画した要素とそのパラメータを保持する配列
const elements = [];
const controls = document.getElementById('elementControls');

function getColor(label) {
  if (!labelStyles[label]) {
    labelStyles[label] = colors[colorIndex % colors.length];
    colorIndex++;
  }
  return labelStyles[label];
}

let currentX = 0;
let currentY = 0;
let currentAngle = 0; // degrees

function drawPoint(x, y, label) {
  const color = getColor(label);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawLine(x1, y1, x2, y2, label) {
  const color = getColor(label);
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function addPoint(x, y, label, params) {
  elements.push({ type: 'point', x, y, label, params });
  drawPoint(x, y, label);
}

function addLine(x1, y1, x2, y2, label, params) {
  elements.push({ type: 'line', x1, y1, x2, y2, label, params });
  drawLine(x1, y1, x2, y2, label);
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const el of elements) {
    if (el.type === 'point') {
      drawPoint(el.x, el.y, el.label);
    } else if (el.type === 'line') {
      drawLine(el.x1, el.y1, el.x2, el.y2, el.label);
    }
  }
}

function recomputeAll() {
  currentX = canvas.width / 2;
  currentY = canvas.height / 2;
  currentAngle = 0;
  for (const el of elements) {
    if (el.type === 'point') {
      if (el.params.mode === 'abs') {
        el.x = el.params.x;
        el.y = el.params.y;
      } else if (el.params.mode === 'rel') {
        el.x = currentX + el.params.dx;
        el.y = currentY + el.params.dy;
      }
      currentX = el.x;
      currentY = el.y;
    } else if (el.type === 'line') {
      if (el.params.overrideStartX !== undefined) {
        currentX = el.params.overrideStartX;
        currentY = el.params.overrideStartY;
      }
      el.x1 = currentX;
      el.y1 = currentY;
      let angle;
      if (el.params.angleMode === 'abs') {
        angle = el.params.angle;
      } else {
        angle = currentAngle + el.params.angle;
      }
      const rad = (angle * Math.PI) / 180;
      el.x2 = el.x1 + el.params.length * Math.cos(rad);
      el.y2 = el.y1 + el.params.length * Math.sin(rad);
      el.angle = angle;
      currentAngle = angle;
      currentX = el.x2;
      currentY = el.y2;
    }
  }
  redraw();
  updateControls();
}

function updateControls() {
  if (!controls) return;
  controls.innerHTML = '';
  elements.forEach((el, i) => {
    const row = document.createElement('div');
    if (el.type === 'point') {
      const label = document.createTextNode(`Point ${i} (${el.label}) `);
      const xInput = document.createElement('input');
      xInput.type = 'number';
      xInput.value = el.x;
      xInput.step = 'any';
      const yInput = document.createElement('input');
      yInput.type = 'number';
      yInput.value = el.y;
      yInput.step = 'any';
      const btn = document.createElement('button');
      btn.textContent = 'Update';
      btn.addEventListener('click', () => {
        editPoint(i, parseFloat(xInput.value), parseFloat(yInput.value));
      });
      row.appendChild(label);
      row.appendChild(xInput);
      row.appendChild(yInput);
      row.appendChild(btn);
    } else if (el.type === 'line') {
      const label = document.createTextNode(`Line ${i} (${el.label}) `);
      const x1 = document.createElement('input');
      x1.type = 'number';
      x1.value = el.x1;
      x1.step = 'any';
      const y1 = document.createElement('input');
      y1.type = 'number';
      y1.value = el.y1;
      y1.step = 'any';
      const x2 = document.createElement('input');
      x2.type = 'number';
      x2.value = el.x2;
      x2.step = 'any';
      const y2 = document.createElement('input');
      y2.type = 'number';
      y2.value = el.y2;
      y2.step = 'any';
      const btn = document.createElement('button');
      btn.textContent = 'Update';
      btn.addEventListener('click', () => {
        editLine(i, parseFloat(x1.value), parseFloat(y1.value), parseFloat(x2.value), parseFloat(y2.value));
      });
      row.appendChild(label);
      row.appendChild(x1);
      row.appendChild(y1);
      row.appendChild(x2);
      row.appendChild(y2);
      row.appendChild(btn);
    }
    controls.appendChild(row);
  });
}

// 編集用関数。index は elements 配列の位置
function editPoint(index, x, y) {
  const el = elements[index];
  if (el && el.type === 'point') {
    el.params = { mode: 'abs', x, y };
    recomputeAll();
  }
}

function editLine(index, x1, y1, x2, y2) {
  const el = elements[index];
  if (el && el.type === 'line') {
    const dx = x2 - x1;
    const dy = y2 - y1;
    el.params = {
      length: Math.hypot(dx, dy),
      angleMode: 'abs',
      angle: (Math.atan2(dy, dx) * 180) / Math.PI,
      overrideStartX: x1,
      overrideStartY: y1,
    };
    recomputeAll();
  }
}

function resetState() {
  currentX = canvas.width / 2;
  currentY = canvas.height / 2;
  currentAngle = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  colorIndex = 0;
  for (const key in labelStyles) delete labelStyles[key];
  elements.length = 0;
  if (controls) controls.innerHTML = '';
}

function runScript(text) {
  resetState();
  const lines = text.split(/\n/);
  let i = 0;
  const stack = [];
  while (i < lines.length) {
    let line = lines[i].trim();
    if (!line || line.startsWith('#')) {
      i++;
      continue;
    }
    const parts = line.split(/\s+/);
    const cmd = parts[0];
    if (cmd === 'repeat') {
      const times = parseInt(parts[1], 10) || 0;
      stack.push({ times, start: i });
      i++;
    } else if (cmd === 'end') {
      if (stack.length) {
        const frame = stack[stack.length - 1];
        frame.times--;
        if (frame.times > 0) {
          i = frame.start + 1;
        } else {
          stack.pop();
          i++;
        }
      } else {
        i++;
      }
    } else if (cmd === 'point') {
      const label = parts[1] || '';
      let params;
      if (parts[2] === 'abs') {
        params = {
          mode: 'abs',
          x: parseFloat(parts[3]) || 0,
          y: parseFloat(parts[4]) || 0,
        };
      } else if (parts[2] === 'rel') {
        params = {
          mode: 'rel',
          dx: parseFloat(parts[3]) || 0,
          dy: parseFloat(parts[4]) || 0,
        };
      } else {
        params = { mode: 'abs', x: currentX, y: currentY };
      }

      if (params.mode === 'abs') {
        currentX = params.x;
        currentY = params.y;
      } else {
        currentX += params.dx;
        currentY += params.dy;
      }

      addPoint(currentX, currentY, label, params);
      i++;
    } else if (cmd === 'line') {
      const label = parts[1] || '';
      const length = parseFloat(parts[2]) || 0;
      let angleMode = 'abs';
      let angleVal;
      if (parts[3] === 'abs') {
        angleMode = 'abs';
        angleVal = parseFloat(parts[4]) || 0;
      } else if (parts[3] === 'rel') {
        angleMode = 'rel';
        angleVal = parseFloat(parts[4]) || 0;
      } else {
        angleMode = 'abs';
        angleVal = parseFloat(parts[3]) || 0;
      }

      const startX = currentX;
      const startY = currentY;
      const actualAngle =
        angleMode === 'rel' ? currentAngle + angleVal : angleVal;
      const rad = (actualAngle * Math.PI) / 180;
      const newX = startX + length * Math.cos(rad);
      const newY = startY + length * Math.sin(rad);

      currentAngle = actualAngle;
      currentX = newX;
      currentY = newY;

      const params = { length, angleMode, angle: angleVal };
      addLine(startX, startY, newX, newY, label, params);
      i++;
    } else {
      i++;
    }
  }
  updateControls();
}

document.getElementById('run').addEventListener('click', () => {
  const text = document.getElementById('editor').value;
  runScript(text);
});
