import Phaser from "phaser";
import { RENDER_SCALE } from "@/game/config/animation";
import { RunScene } from "@/game/scenes/RunScene";

export function createGame(
  parent: HTMLElement,
  onComplete: (result: { score: number; healthy: number; junk: number }) => void,
) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 540 * RENDER_SCALE,
    height: 960 * RENDER_SCALE,
    backgroundColor: "#000000",
    transparent: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      antialias: true,
      antialiasGL: true,
      pixelArt: false,
      roundPixels: false,
      mipmapFilter: "LINEAR_MIPMAP_LINEAR",
    },
    scene: [new RunScene(onComplete)],
    banner: false,
  });
}
