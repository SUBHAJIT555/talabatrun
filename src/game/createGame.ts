import Phaser from "phaser";
import { RunScene } from "@/game/scenes/RunScene";

export function createGame(parent: HTMLElement, onComplete: (score: number) => void) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 540,
    height: 960,
    backgroundColor: "#000000",
    transparent: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [new RunScene(onComplete)],
    banner: false,
  });
}
