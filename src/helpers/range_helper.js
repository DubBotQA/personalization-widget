export function initRange(target, config) {
  target.setAttribute("default", config.default);
  target.setAttribute("min", config.min);
  target.setAttribute("max", config.max);
  target.setAttribute("step", config.step);
}
