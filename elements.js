class ElementManager {
  constructor() {
    this.nextId = 1;
    this.elements = {};
  }

  addPoint(x, y, parentId = null) {
    const id = this.nextId++;
    this.elements[id] = { id, type: 'point', x, y, parentId };
    return id;
  }

  addLine(startPointId, length, angle, parentId = null) {
    const id = this.nextId++;
    this.elements[id] = { id, type: 'line', startPointId, length, angle, parentId };
    return id;
  }

  updatePoint(id, x, y) {
    const el = this.elements[id];
    if (el && el.type === 'point') {
      if (typeof x === 'number') el.x = x;
      if (typeof y === 'number') el.y = y;
    }
  }

  updateLine(id, startPointId, length, angle) {
    const el = this.elements[id];
    if (el && el.type === 'line') {
      if (typeof startPointId === 'number') el.startPointId = startPointId;
      if (typeof length === 'number') el.length = length;
      if (typeof angle === 'number') el.angle = angle;
    }
  }

  getElement(id) {
    return this.elements[id] || null;
  }

  getChildren(parentId) {
    return Object.values(this.elements).filter(e => e.parentId === parentId);
  }
}

export { ElementManager };
