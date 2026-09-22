/**
 * Future USB joystick / Gamepad API controller.
 *
 * This module will eventually:
 * - listen for `gamepadconnected` and `gamepaddisconnected`
 * - poll `navigator.getGamepads()` from the Phaser update loop
 * - read a configurable horizontal axis through a dead zone
 * - emit one lane-left or lane-right intent per stick action
 * - share that intent with the keyboard fallback
 *
 * Do not poll the Gamepad API from this file yet.
 */
export {};
