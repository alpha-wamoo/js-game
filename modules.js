/**
 * @typedef {{x: number, y: number}} Position xy座標
 * @typedef {"right" | "left" | "up" | "down"} Direction 4方向
 */

console.log("loading modules...");

// constants
/**@constant */
export const FPS = 60;
/**@constant */
export const MILISEC_PER_FRAME = 1000 / FPS;

// export {default as C} from "./modules/C.js";
export {default as Enum} from "./modules/Enum.js";

export {default as JsonData} from "./modules/JsonData.js";
// export {default as GOManager} from "./modules/GOManager.js";
export {default as BulletPool} from "./modules/BulletPool.js";
export {default as EnemyPool} from "./modules/EnemyPool.js";
export {default as Player} from "./modules/Player.js";
// export {default as HittingDetector} from "./modules/HittingDetector.js";
export {default as FieldGrid} from "./modules/FieldGrid.js";
// export {default as WorkManager} from "./modules/WorkManager.js";
// export {default as ObjectPool} from "./modules/ObjectPool.js";
export {default as Queue} from "./modules/Queue.js";
export {default as Util} from "./modules/Util.js";
export {default as SoundManager} from "./modules/SoundManager.js";
// export {default as Character} from "./modules/Character.js";
export {default as Keyboard} from "./modules/Keyboard.js";
export {default as Stage} from "./modules/Stage.js";
// export {default as Bullet} from "./modules/Bullet.js";
export {default as Drawer} from "./modules/Drawer.js";
export {default as Game} from "./modules/Game.js";


// prototypes
Math.rangedRandom = function(min, max){
    return this.random() * (max - min) + min;
}
Array.prototype.choose = function(){
    return this[Math.floor(Math.random() * this.length)];
}