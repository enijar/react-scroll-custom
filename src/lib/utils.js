export const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const getBoundingBox = node => node.getBoundingClientRect();
