/** Dev-only flags (guides stay off unless toggled in code). */
export const GameDebug = {
  showGuides: false,
};

export const SCORE_FEEDBACK_CONFIG = {
  top: 120,
  offsetX: 0,
  duration: 650,
  startScale: 0.9,
  endScale: 1,
  rise: 20,
  depth: 90,
};

/** Per-lane straight paths: spawnX/riderX are [left, center, right]. */
export const FOOD_LANE_CONFIG = {
  spawnY: 632,
  riderY: 920,
  spawnX: [268, 289, 306],
  riderX: [174, 270, 383],
  markerHeight: 30,
  lineAlpha: 0.8,
};

/** Scale / speed / opacity + curveYPower (shared pathProgress for X and Y). */
export const FOOD_PERSPECTIVE_CONFIG = {
  spawnDepth: 0.03,
  approachSpeed: 0.34,
  spawnEvery: 0.62,

  minScale: 0.22,
  maxScale: 1,
  scaleReachProgress: 0.72,
  baseSize: 48,

  /** pathProgress = pow(visualProgress, curveYPower) — used for both X and Y. */
  curveYPower: 1.15,

  minOpacity: 0.82,
  fullOpacityProgress: 0.14,
};
