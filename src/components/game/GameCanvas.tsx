"use client";

/**
 * Browser-only mount point for the future Phaser game.
 *
 * Loaded from the game route with `ssr: false`, so this module never runs
 * during server rendering. Phaser will be created here after mount and
 * destroyed on unmount. Do not construct a Phaser.Game in this foundation.
 */
export default function GameCanvas() {
  return <div id="game-container" className="h-full w-full" />;
}
