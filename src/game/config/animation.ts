/** Dev-only flags (guides stay off unless toggled in code). */
export const GameDebug = {
  showGuides: false,
};

/** Extra canvas pixels for the same on-screen layout. Layout numbers stay in 540×960 space. */
export const RENDER_SCALE = 2;

export const SCORE_FEEDBACK_CONFIG = {
  top: 170,
  offsetX: 0,
  duration: 1000,
  startScale: 0.9,
  endScale: 1,
  rise: 20,
  depth: 90,
};

/** Per-lane straight paths: spawnX/riderX are [left, center, right]. */
export const FOOD_LANE_CONFIG = {
  spawnY: 635,
  riderY: 885,
  spawnX: [258, 283, 306],
  riderX: [140, 271, 400],
  markerHeight: 30,
  lineAlpha: 0.8,
};

/** Scale / speed / opacity + curveYPower (shared pathProgress for X, Y, and scale). */
export const FOOD_PERSPECTIVE_CONFIG = {
  spawnDepth: 0.025,
  approachSpeed: 0.34,
  spawnEvery: 0.62,
  minScale: 0.22,
  maxScale: 0.91,
  scaleReachProgress: 0.72,
  baseSize: 72,
  curveYPower: 2,
  minOpacity: 0.82,
  fullOpacityProgress: 0.14,
};
