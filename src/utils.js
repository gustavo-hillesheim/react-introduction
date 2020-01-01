export function coordsAsIndex({ x, y }) {
  return y * 3 + x;
}

export function indexAsCoords(index) {

  const x = index % 3;
  const y = (index - x) / 3;
  return { x, y };
}
