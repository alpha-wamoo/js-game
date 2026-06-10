/**
 * @typedef {{x: number, y: number}} Position
 * @typedef {"right" | "left" | "up" | "down"} Direction
 * @typedef {{min: Position, max: Position}} Bounds
 * @typedef {"player" | "basic"} CharacterTypeId
 */

export {default as Character} from "./modules/Character.js";
export {FPS, CANV_SIZE, MILISEC_PER_FRAME} from "./modules/constants.js";
export {default as Keyboard} from "./modules/Keyboard.js";
export {default as Stage} from "./modules/Stage.js";
export {default as Game} from "./modules/Game.js";