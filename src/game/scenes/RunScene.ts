import Phaser from "phaser";
import { GAME_RULES, HEALTHY, JUNK, type FoodName } from "@/game/config/rules";

const WIDTH = 540;
const HEIGHT = 960;

type FoodItem = {
  sprite: Phaser.GameObjects.Image;
  shadow: Phaser.GameObjects.Image;
  lane: number;
  depth: number;
  spawnDepth: number;
  kind: "healthy" | "junk";
  phase: number;
  active: boolean;
};

const RIDER_W = 122;
const RIDER_H = 214;
const RIDER_Y = HEIGHT * 0.95;
/** Vanishing tip of the asphalt in gamescene.webm (after 112% crop). */
const HORIZON = HEIGHT * 0.64;
/** Ground contact on the near road, just ahead of the rider's wheels. */
const CONTACT = HEIGHT * 0.92;
const LANE = 78;
const FAR_LANE_HALF = 6;
const SPAWN_DEPTH = 0.14;
const FADE_IN_DEPTH = 0.08;
const FOOD_SIZE_FAR = 14;
const FOOD_SIZE_NEAR = 50;
/** Collect on the open road in front of the bike, before food overlaps the rider. */
const PICKUP_DEPTH = 0.7;
/** Depth units per second — tuned to the blurred road video. */
const APPROACH_SPEED = 0.44;
const SPAWN_EVERY = 0.62;

export class RunScene extends Phaser.Scene {
  private world!: Phaser.GameObjects.Container;
  private rider!: Phaser.GameObjects.Image;
  private riderShadow!: Phaser.GameObjects.Image;
  private riderBaseScaleX = 1;
  private riderBaseScaleY = 1;
  private punching = false;
  private sparks: Phaser.GameObjects.Arc[] = [];
  private sparkCursor = 0;
  private glow!: Phaser.GameObjects.Arc;
  private hitFlash!: Phaser.GameObjects.Rectangle;
  private lane = 1;
  private laneTween = false;
  private laneMove?: Phaser.Tweens.Tween;
  private punchTween?: Phaser.Tweens.Tween;
  private foods: FoodItem[] = [];
  private score = 0;
  private timeLeft = GAME_RULES.durationSeconds;
  private elapsed = 0;
  private spawnIn = 0.8;
  private ended = false;
  private stickHeld = false;
  private scoreText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private healthyCount = 0;
  private junkCount = 0;
  private onComplete: (result: { score: number; healthy: number; junk: number }) => void;

  constructor(onComplete: (result: { score: number; healthy: number; junk: number }) => void) {
    super("run");
    this.onComplete = onComplete;
  }

  preload() {
    this.load.image("rider", "/images/game/rider.png");
    this.load.image("hud-score", "/images/game/hud-score.png");
    this.load.image("hud-time", "/images/game/hud-time.png");
    this.load.image("pop-plus", "/images/game/pop-plus.png");
    this.load.image("pop-minus", "/images/game/pop-minus.png");
    for (const name of [...HEALTHY, ...JUNK]) {
      this.load.image(name, `/images/game/foods/${name}.png`);
    }
    this.load.audio("sfx-good", "/sounds/game/good.ogg");
    this.load.audio("sfx-bad", "/sounds/game/bad.wav");
  }

  create() {
    this.world = this.add.container(0, 0);
    this.addShadowTexture();

    for (let i = 0; i < 12; i += 1) {
      const shadow = this.add.image(WIDTH / 2, HORIZON, "ground-shadow");
      shadow.setVisible(false);
      shadow.setOrigin(0.5, 0.5);
      const sprite = this.add.image(WIDTH / 2, HORIZON, "apple");
      sprite.setVisible(false);
      this.world.add([shadow, sprite]);
      this.foods.push({
        sprite,
        shadow,
        lane: 1,
        depth: 0,
        spawnDepth: SPAWN_DEPTH,
        kind: "healthy",
        phase: i * 1.3,
        active: false,
      });
    }

    this.riderShadow = this.add.image(this.riderLaneX(1), this.riderY(), "ground-shadow");
    this.riderShadow.setOrigin(0.5, 0.5);
    this.riderShadow.setDepth(28);
    this.riderShadow.setAlpha(0.45);
    this.riderShadow.setDisplaySize(134, 28);
    this.world.add(this.riderShadow);

    this.rider = this.add.image(this.riderLaneX(1), this.riderY(), "rider");
    this.rider.setDisplaySize(RIDER_W, RIDER_H);
    this.rider.setOrigin(0.5, 0.92);
    this.rider.setDepth(30);
    this.riderBaseScaleX = this.rider.scaleX;
    this.riderBaseScaleY = this.rider.scaleY;
    this.world.add(this.rider);

    this.glow = this.add.circle(0, 0, 28, 0xc6f54a, 0.7).setVisible(false).setDepth(74);
    this.hitFlash = this.add
      .rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x9a1c08, 0)
      .setDepth(70);
    for (let i = 0; i < 24; i += 1) {
      this.sparks.push(this.add.circle(0, 0, 5, 0xffffff, 1).setVisible(false).setDepth(76));
    }

    this.add.image(78, 58, "hud-score").setDisplaySize(132, 110).setDepth(80);
    this.add.image(WIDTH - 96, 58, "hud-time").setDisplaySize(168, 104).setDepth(80);

    const numberStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: "Arial, sans-serif",
      fontSize: "28px",
      fontStyle: "bold",
      color: "#490B0E",
    };
    this.scoreText = this.add.text(78, 78, "0", numberStyle).setOrigin(0.5).setDepth(81);
    this.timeText = this.add.text(WIDTH - 78, 74, "60", numberStyle).setOrigin(0.5).setDepth(81);

    this.sound.pauseOnBlur = false;
    this.fillRoad();
    this.bindKeys();
    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      const dx = pointer.upX - pointer.downX;
      if (Math.abs(dx) >= 36) {
        this.shift(dx > 0 ? 1 : -1);
        return;
      }
      this.shift(pointer.upX < WIDTH / 2 ? -1 : 1);
    });
  }

  update(_time: number, delta: number) {
    if (this.ended) return;
    const dt = Math.min(delta, 40) / 1000;
    this.elapsed += dt;
    this.timeLeft = Math.max(0, GAME_RULES.durationSeconds - this.elapsed);
    this.timeText.setText(String(Math.ceil(this.timeLeft)));
    this.readStick();

    const bob = Math.sin(this.elapsed * 13) * 5;
    this.rider.y = this.riderY() + bob;
    this.riderShadow.setPosition(this.rider.x, this.riderY() + 10);
    this.riderShadow.setDisplaySize(140 + bob * 1.2, 28);
    if (!this.punching) {
      this.rider.setScale(this.riderBaseScaleX, this.riderBaseScaleY);
    }

    this.spawnIn -= dt;
    if (this.spawnIn <= 0) {
      this.spawnFood();
      this.spawnIn = SPAWN_EVERY;
    }

    for (const food of this.foods) {
      if (!food.active) continue;
      food.depth += dt * APPROACH_SPEED;
      this.placeFood(food);
      if (food.depth >= PICKUP_DEPTH && food.lane === this.lane) this.collect(food);
      else if (food.depth >= 0.8) this.hideFood(food);
    }

    this.world.sort("depth");

    if (this.timeLeft <= 0) this.finish();
  }

  private pace() {
    return Phaser.Math.Clamp(this.elapsed / GAME_RULES.durationSeconds, 0, 1);
  }

  private project(depth: number) {
    const t = Phaser.Math.Clamp(depth, 0, 1);
    // Y drops toward the rider a bit ahead of linear so mid-path sits on asphalt.
    const curveY = Math.pow(t, 0.88);
    // X opens early so left/right follow diverging lane lines instead of sliding inward.
    const curveX = Math.pow(t, 0.55);
    return {
      curve: curveY,
      y: HORIZON + (CONTACT - HORIZON) * curveY,
      half: Phaser.Math.Linear(FAR_LANE_HALF, LANE, curveX),
      x: WIDTH / 2,
    };
  }

  private laneX(lane: number, depth: number) {
    const { x, half } = this.project(depth);
    return x + (lane - 1) * half;
  }

  private riderLaneX(lane: number) {
    return WIDTH / 2 + (lane - 1) * LANE;
  }

  private riderY() {
    return RIDER_Y;
  }

  private shift(direction: number) {
    if (this.ended || this.laneTween) return;
    const next = Phaser.Math.Clamp(this.lane + direction, 0, 2);
    if (next === this.lane) return;
    this.lane = next;
    this.laneTween = true;
    this.laneMove?.stop();
    this.laneMove = this.tweens.add({
      targets: this.rider,
      x: this.riderLaneX(next),
      angle: direction * 10,
      duration: 150,
      ease: "Sine.easeOut",
      onComplete: () => {
        this.laneTween = false;
        this.laneMove = this.tweens.add({
          targets: this.rider,
          angle: 0,
          duration: 130,
          ease: "Sine.easeInOut",
        });
      },
    });
  }

  private bindKeys() {
    const onKey = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") this.shift(-1);
      if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") this.shift(1);
    };
    window.addEventListener("keydown", onKey);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener("keydown", onKey);
    });
  }

  private readStick() {
    const pads = navigator.getGamepads?.() ?? [];
    let axis = 0;
    for (const pad of pads) {
      if (pad) axis = pad.axes[0] ?? 0;
    }
    if (axis < -0.55 && !this.stickHeld) {
      this.stickHeld = true;
      this.shift(-1);
    } else if (axis > 0.55 && !this.stickHeld) {
      this.stickHeld = true;
      this.shift(1);
    } else if (Math.abs(axis) < 0.3) {
      this.stickHeld = false;
    }
  }

  private pickFood(kind: "healthy" | "junk"): FoodName {
    const list = kind === "healthy" ? HEALTHY : JUNK;
    return list[Phaser.Math.Between(0, list.length - 1)];
  }

  private fillRoad() {
    const placed = [0.18, 0.40, 0.64, 0.86].map((depth, index) => ({
      lane: [1, 0, 2, 1][index],
      depth,
    }));
    for (const spot of placed) this.spawnFood(spot.depth, spot.lane);
  }

  private spawnFood(depth = SPAWN_DEPTH, lane?: number) {
    const active = this.foods.filter((food) => food.active);
    if (active.length >= 5) return;
    const slot = this.foods.find((food) => !food.active);
    if (!slot) return;
    const kind = Math.random() < Phaser.Math.Linear(0.72, 0.5, this.pace()) ? "healthy" : "junk";
    const open = () => !active.some((food) => Math.abs(food.depth - depth) < 0.24);
    if (!open()) return;
    const lanes = [0, 1, 2];
    const nextLane = lane ?? lanes[Phaser.Math.Between(0, lanes.length - 1)];
    if (nextLane === undefined) return;
    slot.kind = kind;
    slot.lane = nextLane;
    slot.depth = depth;
    // Pre-placed road items are already past the fade window; new spawns fade in.
    slot.spawnDepth = depth > SPAWN_DEPTH ? depth - FADE_IN_DEPTH : depth;
    slot.phase = Math.random() * Math.PI * 2;
    slot.active = true;
    slot.sprite.setTexture(this.pickFood(kind));
    slot.sprite.setAngle(0);
    slot.sprite.setAlpha(0);
    slot.sprite.setVisible(true);
    this.placeFood(slot);
  }

  private placeFood(food: FoodItem) {
    const { curve, y } = this.project(food.depth);
    const size = Phaser.Math.Linear(FOOD_SIZE_FAR, FOOD_SIZE_NEAR, curve);
    const bob = Math.sin(this.elapsed * 3.4 + food.phase) * Phaser.Math.Linear(1.5, 5, curve);
    const x = this.laneX(food.lane, Math.min(food.depth, 1));
    let fade = Phaser.Math.Clamp((food.depth - food.spawnDepth) / FADE_IN_DEPTH, 0, 1);
    if (food.lane !== this.lane) {
      fade *= 1 - Phaser.Math.Clamp((food.depth - 0.64) / 0.14, 0, 1);
    }
    food.sprite.setPosition(x, y - bob);
    this.fitFood(food.sprite, size);
    food.sprite.setDepth(8 + curve * 18);
    food.sprite.setAngle(0);
    food.sprite.setOrigin(0.5, 1);
    food.sprite.setAlpha(fade);
    food.shadow.setPosition(x, y + 2);
    food.shadow.setDisplaySize(Math.max(10, size * 0.7), Math.max(5, size * 0.18));
    food.shadow.setDepth(7 + curve * 18);
    food.shadow.setAlpha(fade * (0.28 + curve * 0.34));
    food.shadow.setVisible(fade > 0.04);
  }

  private fitFood(sprite: Phaser.GameObjects.Image, size: number) {
    const aspect = sprite.width / Math.max(1, sprite.height);
    let width = aspect >= 1 ? size : size * aspect;
    let height = aspect >= 1 ? size / aspect : size;
    const shortSide = Math.min(width, height);
    const floor = size * 0.42;
    if (shortSide > 0 && shortSide < floor) {
      const lift = Math.min(floor / shortSide, 1.2);
      width *= lift;
      height *= lift;
    }
    sprite.setDisplaySize(width, height);
  }

  private hideFood(food: FoodItem) {
    food.active = false;
    food.sprite.setVisible(false);
    food.sprite.setAlpha(1);
    food.shadow.setVisible(false);
  }

  private collect(food: FoodItem) {
    const x = food.sprite.x;
    const y = food.sprite.y;
    const healthy = food.kind === "healthy";
    if (healthy) this.healthyCount += 1;
    else this.junkCount += 1;
    this.hideFood(food);
    const delta = healthy ? GAME_RULES.healthyFoodPoints : -GAME_RULES.junkFoodPenalty;
    this.score = Math.max(GAME_RULES.minScore, this.score + delta);
    this.scoreText.setText(String(this.score));
    this.tweens.killTweensOf(this.scoreText);
    this.scoreText.setScale(1.28);
    this.tweens.add({ targets: this.scoreText, scale: 1, duration: 180, ease: "Sine.easeOut" });
    this.popup(healthy ? "pop-plus" : "pop-minus", x, y - 28);
    this.burst(x, y, healthy);
    this.nudgeRider(healthy);
    if (!healthy) {
      this.cameras.main.shake(120, 0.004);
      this.tweens.killTweensOf(this.hitFlash);
      this.hitFlash.setAlpha(0.2);
      this.tweens.add({ targets: this.hitFlash, alpha: 0, duration: 170, ease: "Sine.easeOut" });
    }
    const soundKey = healthy ? "sfx-good" : "sfx-bad";
    if (this.cache.audio.exists(soundKey)) {
      this.sound.play(soundKey, { volume: healthy ? 0.55 : 0.5 });
    }
  }

  private popup(key: string, x: number, y: number) {
    const pop = this.add.image(x, y, key).setDisplaySize(78, 56).setDepth(90);
    pop.setScale(0.7);
    this.tweens.add({
      targets: pop,
      y: y - 42,
      scale: 1,
      alpha: 0,
      delay: 80,
      duration: 340,
      ease: "Sine.easeOut",
      onComplete: () => pop.destroy(),
    });
  }

  private burst(x: number, y: number, healthy: boolean) {
    const colors = healthy ? [0xc6f54a, 0xffd56a, 0xffffff] : [0xff5900, 0x7a1408, 0xffe0c2];
    this.tweens.killTweensOf(this.glow);
    this.glow.setPosition(x, y - 18);
    this.glow.setFillStyle(healthy ? 0xc6f54a : 0xff5900, 0.75);
    this.glow.setScale(0.35);
    this.glow.setAlpha(0.7);
    this.glow.setVisible(true);
    this.tweens.add({
      targets: this.glow,
      scale: 2.2,
      alpha: 0,
      duration: 220,
      ease: "Quad.easeOut",
      onComplete: () => this.glow.setVisible(false),
    });

    for (let i = 0; i < 8; i += 1) {
      const spark = this.sparks[this.sparkCursor % this.sparks.length];
      this.sparkCursor += 1;
      this.tweens.killTweensOf(spark);
      const angle = -Math.PI / 2 + (i - 3.5) * 0.42;
      const dist = 24 + (i % 3) * 12;
      spark.setPosition(x, y - 16);
      spark.setFillStyle(colors[i % colors.length], 1);
      spark.setVisible(true);
      spark.setAlpha(1);
      spark.setScale(1);
      this.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * dist,
        y: y - 30 + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.25,
        duration: 300,
        ease: "Quad.easeOut",
        onComplete: () => spark.setVisible(false),
      });
    }
  }

  private nudgeRider(healthy: boolean) {
    this.punchTween?.stop();
    this.punching = true;
    this.rider.setScale(this.riderBaseScaleX, this.riderBaseScaleY);
    this.punchTween = this.tweens.add({
      targets: this.rider,
      scaleY: this.riderBaseScaleY * (healthy ? 1.07 : 0.9),
      duration: 70,
      yoyo: true,
      ease: "Sine.easeOut",
      onComplete: () => {
        this.punching = false;
        this.rider.setScale(this.riderBaseScaleX, this.riderBaseScaleY);
      },
    });
  }

  private addShadowTexture() {
    if (this.textures.exists("ground-shadow")) return;
    const graphics = this.add.graphics();
    graphics.fillStyle(0x140804, 0.28);
    graphics.fillEllipse(64, 18, 124, 34);
    graphics.fillStyle(0x140804, 0.7);
    graphics.fillEllipse(64, 18, 72, 18);
    graphics.generateTexture("ground-shadow", 128, 36);
    graphics.destroy();
  }

  private finish() {
    this.ended = true;
    this.timeText.setText("0");
    this.time.delayedCall(700, () =>
      this.onComplete({ score: this.score, healthy: this.healthyCount, junk: this.junkCount }),
    );
  }
}
