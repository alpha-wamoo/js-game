import {Character, Bullet, Util} from "../../modules.js";

/**
 * @import {Position} from "../../modules.js"
 * 
 * @typedef {[srcId: number, targetId: number, isBulletTarget: boolean]} HittingPair
 */

export default class HittingDetector{
    /**
     * @private @static
     * @type {DtoToMain}
     */
    static _hittingPairs = {
        pl_enemy: [],
        enemy_blt: []
    };

    /**
     * @static @method
     * @param {Dto} 
     * @returns {DtoToMain?} enemiesまたはbulletsが存在しないときnull. 
     * 当たり判定を満たした[敵, 弾丸]、[プレイヤー, 敵]の組
     */
    static detectObjects({player, enemies, bullets}){
        // TODO: 判定処理を高速化する

        // pl_enemy
        // if(player && enemies.length) HittingDetector._hittingPairs.pl_enemy = enemies
        // .filter(enemy => isHittingTo(player, enemy))
        // .map(enemy => enemy.id);

        // enemy_blt
        // if(enemies.length && bullets.length) HittingDetector._hittingPairs.enemy_blt = enemies.flatMap(enemy =>
        //     bullets.filter(blt => isHittingTo(enemy, blt)).map(blt => ({ enemy: enemy.id, blt: blt.id }))
        // );

        return this._hittingPairs;
    }
}

/**
 * 当たっていることを判定します
 * @param {CharacterDTO | BulletDTO} a 
 * @param {CharacterDTO | BulletDTO} b
 * @returns {boolean}
 */
function isHittingTo(a, b){
    //x
    const ax = getRange("x", a), bx = getRange("x", b);
    const isHittingX = ax.min < bx.max && ax.max > bx.min;
    //y
    const ay = getRange("y", a), by = getRange("y", b);
    const isHittingY = ay.min < by.max && ay.max > by.min;

    return isHittingX && isHittingY;
}

/**
 * @param {"x" | "y"} axis 
 * @param {CharacterDTO | BulletDTO}
 * @returns {{min: number, max:number}}
 */
function getRange(axis, {pos, size}){
    return { min: pos[axis] - size/2, max: pos[axis] + size/2 };
}