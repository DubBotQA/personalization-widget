export function hexToRgb(hex) {
  const match = hex.replace('#', '').match(/.{1,2}/g);
  if (!match) return '';

  const [r, g, b] = match.map((x) => parseInt(x, 16));
  return `${r}, ${g}, ${b}`;
}
