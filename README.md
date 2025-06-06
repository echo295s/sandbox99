# sandbox99

This is a simple demo for managing drawable elements on a canvas.
Open `index.html` in a browser and use the exposed API from the
JavaScript console.

## API

`elementManager` is a global instance that manages elements.
Elements have unique ids and optional parent-child relationships.

- `addPoint(x, y, parentId)`: add a point at `(x, y)`.
- `addLine(startPointId, length, angle, parentId)`: add a line that begins at
  the point specified by `startPointId` and extends with `length` and `angle`.
- `updatePoint(id, x, y)`: change the coordinates of an existing point.
- `updateLine(id, startPointId, length, angle)`: update the parameters of a
  line.

After adding or updating elements call `redraw()` to refresh the canvas.
