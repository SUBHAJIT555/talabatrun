"use client";

import { useCallback, useState } from "react";
import {
  FOOD_LANE_CONFIG,
  FOOD_PERSPECTIVE_CONFIG,
  GameDebug,
  SCORE_FEEDBACK_CONFIG,
} from "@/game/config/animation";
import { GAME_RULES } from "@/game/config/rules";

type SliderSpec = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  get: () => number;
  set: (value: number) => void;
};

const LANE_SLIDERS: SliderSpec[] = [
  {
    key: "spawnY",
    label: "spawnY (green)",
    min: 400,
    max: 750,
    step: 1,
    get: () => FOOD_LANE_CONFIG.spawnY,
    set: (v) => {
      FOOD_LANE_CONFIG.spawnY = v;
    },
  },
  {
    key: "riderY",
    label: "riderY (yellow)",
    min: 700,
    max: 950,
    step: 1,
    get: () => FOOD_LANE_CONFIG.riderY,
    set: (v) => {
      FOOD_LANE_CONFIG.riderY = v;
    },
  },
  {
    key: "spawnX0",
    label: "spawnX left",
    min: 140,
    max: 300,
    step: 1,
    get: () => FOOD_LANE_CONFIG.spawnX[0],
    set: (v) => {
      FOOD_LANE_CONFIG.spawnX[0] = v;
    },
  },
  {
    key: "spawnX1",
    label: "spawnX center",
    min: 200,
    max: 340,
    step: 1,
    get: () => FOOD_LANE_CONFIG.spawnX[1],
    set: (v) => {
      FOOD_LANE_CONFIG.spawnX[1] = v;
    },
  },
  {
    key: "spawnX2",
    label: "spawnX right",
    min: 240,
    max: 400,
    step: 1,
    get: () => FOOD_LANE_CONFIG.spawnX[2],
    set: (v) => {
      FOOD_LANE_CONFIG.spawnX[2] = v;
    },
  },
  {
    key: "riderX0",
    label: "riderX left",
    min: 140,
    max: 300,
    step: 1,
    get: () => FOOD_LANE_CONFIG.riderX[0],
    set: (v) => {
      FOOD_LANE_CONFIG.riderX[0] = v;
    },
  },
  {
    key: "riderX1",
    label: "riderX center",
    min: 200,
    max: 340,
    step: 1,
    get: () => FOOD_LANE_CONFIG.riderX[1],
    set: (v) => {
      FOOD_LANE_CONFIG.riderX[1] = v;
    },
  },
  {
    key: "riderX2",
    label: "riderX right",
    min: 240,
    max: 400,
    step: 1,
    get: () => FOOD_LANE_CONFIG.riderX[2],
    set: (v) => {
      FOOD_LANE_CONFIG.riderX[2] = v;
    },
  },
];

const FOOD_SLIDERS: SliderSpec[] = [
  {
    key: "curveYPower",
    label: "curveYPower (path)",
    min: 0.6,
    max: 2,
    step: 0.01,
    get: () => FOOD_PERSPECTIVE_CONFIG.curveYPower,
    set: (v) => {
      FOOD_PERSPECTIVE_CONFIG.curveYPower = v;
    },
  },
  {
    key: "spawnDepth",
    label: "spawnDepth",
    min: 0.01,
    max: 0.2,
    step: 0.005,
    get: () => FOOD_PERSPECTIVE_CONFIG.spawnDepth,
    set: (v) => {
      FOOD_PERSPECTIVE_CONFIG.spawnDepth = v;
    },
  },
  {
    key: "minScale",
    label: "minScale",
    min: 0.1,
    max: 0.6,
    step: 0.01,
    get: () => FOOD_PERSPECTIVE_CONFIG.minScale,
    set: (v) => {
      FOOD_PERSPECTIVE_CONFIG.minScale = v;
    },
  },
  {
    key: "scaleReachProgress",
    label: "scaleReachProgress",
    min: 0.4,
    max: 1,
    step: 0.01,
    get: () => FOOD_PERSPECTIVE_CONFIG.scaleReachProgress,
    set: (v) => {
      FOOD_PERSPECTIVE_CONFIG.scaleReachProgress = v;
    },
  },
  {
    key: "approachSpeed",
    label: "approachSpeed",
    min: 0.1,
    max: 0.8,
    step: 0.01,
    get: () => FOOD_PERSPECTIVE_CONFIG.approachSpeed,
    set: (v) => {
      FOOD_PERSPECTIVE_CONFIG.approachSpeed = v;
    },
  },
  {
    key: "baseSize",
    label: "baseSize",
    min: 24,
    max: 80,
    step: 1,
    get: () => FOOD_PERSPECTIVE_CONFIG.baseSize,
    set: (v) => {
      FOOD_PERSPECTIVE_CONFIG.baseSize = v;
    },
  },
  {
    key: "maxScale",
    label: "maxScale",
    min: 0.5,
    max: 1.2,
    step: 0.01,
    get: () => FOOD_PERSPECTIVE_CONFIG.maxScale,
    set: (v) => {
      FOOD_PERSPECTIVE_CONFIG.maxScale = v;
    },
  },
  {
    key: "spawnEvery",
    label: "spawnEvery",
    min: 0.3,
    max: 1.5,
    step: 0.02,
    get: () => FOOD_PERSPECTIVE_CONFIG.spawnEvery,
    set: (v) => {
      FOOD_PERSPECTIVE_CONFIG.spawnEvery = v;
    },
  },
  {
    key: "minOpacity",
    label: "minOpacity",
    min: 0.2,
    max: 1,
    step: 0.02,
    get: () => FOOD_PERSPECTIVE_CONFIG.minOpacity,
    set: (v) => {
      FOOD_PERSPECTIVE_CONFIG.minOpacity = v;
    },
  },
  {
    key: "fullOpacityProgress",
    label: "fullOpacityProgress",
    min: 0.02,
    max: 0.5,
    step: 0.01,
    get: () => FOOD_PERSPECTIVE_CONFIG.fullOpacityProgress,
    set: (v) => {
      FOOD_PERSPECTIVE_CONFIG.fullOpacityProgress = v;
    },
  },
];

const SCORE_SLIDERS: SliderSpec[] = [
  {
    key: "top",
    label: "top",
    min: 60,
    max: 220,
    step: 1,
    get: () => SCORE_FEEDBACK_CONFIG.top,
    set: (v) => {
      SCORE_FEEDBACK_CONFIG.top = v;
    },
  },
  {
    key: "offsetX",
    label: "offsetX",
    min: -120,
    max: 120,
    step: 1,
    get: () => SCORE_FEEDBACK_CONFIG.offsetX,
    set: (v) => {
      SCORE_FEEDBACK_CONFIG.offsetX = v;
    },
  },
  {
    key: "duration",
    label: "duration",
    min: 200,
    max: 1500,
    step: 10,
    get: () => SCORE_FEEDBACK_CONFIG.duration,
    set: (v) => {
      SCORE_FEEDBACK_CONFIG.duration = v;
    },
  },
  {
    key: "startScale",
    label: "startScale",
    min: 0.5,
    max: 1.2,
    step: 0.05,
    get: () => SCORE_FEEDBACK_CONFIG.startScale,
    set: (v) => {
      SCORE_FEEDBACK_CONFIG.startScale = v;
    },
  },
  {
    key: "endScale",
    label: "endScale",
    min: 0.8,
    max: 1.4,
    step: 0.05,
    get: () => SCORE_FEEDBACK_CONFIG.endScale,
    set: (v) => {
      SCORE_FEEDBACK_CONFIG.endScale = v;
    },
  },
  {
    key: "rise",
    label: "rise",
    min: 0,
    max: 60,
    step: 1,
    get: () => SCORE_FEEDBACK_CONFIG.rise,
    set: (v) => {
      SCORE_FEEDBACK_CONFIG.rise = v;
    },
  },
  {
    key: "depth",
    label: "depth",
    min: 70,
    max: 120,
    step: 1,
    get: () => SCORE_FEEDBACK_CONFIG.depth,
    set: (v) => {
      SCORE_FEEDBACK_CONFIG.depth = v;
    },
  },
];

function formatValue(value: number, step: number) {
  if (step >= 1) return String(Math.round(value));
  const digits = Math.max(0, String(step).split(".")[1]?.length ?? 0);
  return value.toFixed(digits);
}

function buildCopySnippet() {
  const lanes = FOOD_LANE_CONFIG;
  const food = FOOD_PERSPECTIVE_CONFIG;
  const score = SCORE_FEEDBACK_CONFIG;
  return `// Paste into src/game/config/animation.ts
// durationSeconds (dev only, leave rules.ts at 60 for production): ${GAME_RULES.durationSeconds}

export const FOOD_LANE_CONFIG = {
  spawnY: ${lanes.spawnY},
  riderY: ${lanes.riderY},
  spawnX: [${lanes.spawnX[0]}, ${lanes.spawnX[1]}, ${lanes.spawnX[2]}],
  riderX: [${lanes.riderX[0]}, ${lanes.riderX[1]}, ${lanes.riderX[2]}],
  markerHeight: ${lanes.markerHeight},
  lineAlpha: ${lanes.lineAlpha},
};

export const FOOD_PERSPECTIVE_CONFIG = {
  spawnDepth: ${food.spawnDepth},
  approachSpeed: ${food.approachSpeed},
  spawnEvery: ${food.spawnEvery},
  minScale: ${food.minScale},
  maxScale: ${food.maxScale},
  scaleReachProgress: ${food.scaleReachProgress},
  baseSize: ${food.baseSize},
  curveYPower: ${food.curveYPower},
  minOpacity: ${food.minOpacity},
  fullOpacityProgress: ${food.fullOpacityProgress},
};

export const SCORE_FEEDBACK_CONFIG = {
  top: ${score.top},
  offsetX: ${score.offsetX},
  duration: ${score.duration},
  startScale: ${score.startScale},
  endScale: ${score.endScale},
  rise: ${score.rise},
  depth: ${score.depth},
};
`;
}

function SliderRow({
  spec,
  value,
  onChange,
}: {
  spec: SliderSpec;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mb-2 block text-[11px] leading-tight text-white/90">
      <span className="mb-0.5 flex justify-between gap-2 font-mono">
        <span>{spec.label}</span>
        <span className="text-orange-300">{formatValue(value, spec.step)}</span>
      </span>
      <input
        type="range"
        min={spec.min}
        max={spec.max}
        step={spec.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-orange-500"
      />
    </label>
  );
}

export default function GameTunePanel() {
  const [open, setOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showGuides, setShowGuides] = useState(GameDebug.showGuides);

  const bump = useCallback(() => setTick((n) => n + 1), []);

  const setSlider = (spec: SliderSpec, value: number) => {
    spec.set(value);
    bump();
  };

  const copyConfig = async () => {
    try {
      await navigator.clipboard.writeText(buildCopySnippet());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  void tick;

  return (
    <div className="pointer-events-none absolute top-2 right-2 z-[200] flex max-h-[min(92%,880px)] flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto rounded bg-[#FF5900] px-3 py-1.5 text-xs font-bold text-white shadow-md"
      >
        {open ? "Close tune" : "Tune"}
      </button>

      {open ? (
        <div className="pointer-events-auto w-[260px] overflow-y-auto rounded-lg border border-white/20 bg-black/85 p-3 text-white shadow-xl backdrop-blur-sm">
          <section className="mb-3">
            <h3 className="mb-2 text-[10px] font-bold tracking-wide text-orange-400 uppercase">
              Session
            </h3>
            <SliderRow
              spec={{
                key: "durationSeconds",
                label: "durationSeconds",
                min: 15,
                max: 600,
                step: 5,
                get: () => GAME_RULES.durationSeconds,
                set: (v) => {
                  GAME_RULES.durationSeconds = v;
                },
              }}
              value={GAME_RULES.durationSeconds}
              onChange={(v) => {
                GAME_RULES.durationSeconds = v;
                bump();
              }}
            />
            <p className="text-[10px] text-white/50">{GAME_RULES.durationSeconds}s run timer</p>
          </section>

          <section className="mb-3">
            <h3 className="mb-2 text-[10px] font-bold tracking-wide text-orange-400 uppercase">
              Lane paths
            </h3>
            <p className="mb-2 text-[10px] text-white/50">
              Keep spawnX/riderX ordered left &lt; center &lt; right. Green = spawn, yellow = rider.
            </p>
            {LANE_SLIDERS.map((spec) => (
              <SliderRow
                key={spec.key}
                spec={spec}
                value={spec.get()}
                onChange={(v) => setSlider(spec, v)}
              />
            ))}
          </section>

          <section className="mb-3">
            <h3 className="mb-2 text-[10px] font-bold tracking-wide text-orange-400 uppercase">
              Food motion
            </h3>
            {FOOD_SLIDERS.map((spec) => (
              <SliderRow
                key={spec.key}
                spec={spec}
                value={spec.get()}
                onChange={(v) => setSlider(spec, v)}
              />
            ))}
          </section>

          <section className="mb-3">
            <h3 className="mb-2 text-[10px] font-bold tracking-wide text-orange-400 uppercase">
              Score feedback
            </h3>
            {SCORE_SLIDERS.map((spec) => (
              <SliderRow
                key={spec.key}
                spec={spec}
                value={spec.get()}
                onChange={(v) => setSlider(spec, v)}
              />
            ))}
          </section>

          <section>
            <h3 className="mb-2 text-[10px] font-bold tracking-wide text-orange-400 uppercase">
              Debug
            </h3>
            <label className="mb-3 flex items-center gap-2 text-[11px]">
              <input
                type="checkbox"
                checked={showGuides}
                onChange={(event) => {
                  const next = event.target.checked;
                  GameDebug.showGuides = next;
                  setShowGuides(next);
                }}
                className="accent-orange-500"
              />
              Show lane guides
            </label>
            <button
              type="button"
              onClick={() => void copyConfig()}
              className="w-full rounded bg-white/15 px-2 py-1.5 text-[11px] font-semibold hover:bg-white/25"
            >
              {copied ? "Copied!" : "Copy config"}
            </button>
            <p className="mt-1 text-[10px] text-white/45">
              Green = spawnY + spawnX ticks. Yellow = riderY + riderX ticks.
            </p>
          </section>
        </div>
      ) : null}
    </div>
  );
}
