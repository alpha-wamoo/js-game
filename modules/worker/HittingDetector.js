import {Character, Bullet, Util} from "../../modules.js";

/**
 * @import {Position} from "../../modules.js"
 * 
 * @typedef {[srcId: number, targetId: number, isBulletTarget: boolean]} HittingPair
 * 
 * @typedef Dto
 * @prop {ElementDto} player
 * @prop {ElementDto[]} enemies
 * @prop {ElementDto[]} bullets
 * 
 * @typedef ElementDto
 * @prop {number} id
 * @prop {{x: number, y: number}} pos
 * @prop {number} size
 * 
 * @typedef DtoToMain mainに返すための、当たり判定を満たした[キャラ, 弾丸]、[プレイヤー, キャラ]の組
 * @property {number[]} pl_enemy
 * @property {{ enemy: number, blt: number }[]} enemy_blt
 */

/**
 * @type {(ev: MessageEvent<Dto>) => void}
 */
onmessage = ev => {
    const { requestId, ...payload } = ev.data;
    postMessage({ requestId, payload: HittingDetector.detectObjects(payload) });
}

export default constructDTO;

/**
 * dataをWorkへ送信可能なDTOに変換します.
 * @param {Object} data
 * @param {Character} data.player 
 * @param {Character[]} data.enemies 
 * @param {Bullet[]} data.bullets
 * @returns {Dto}
 */
function constructDTO(data){
    const {player, enemies, bullets} = data;
    /**@type {Dto} */
    const dto = {};
    dto.player = {
        id: player.id,
        pos: {...player.pos},
        size: player.size
    };
    dto.enemies = enemies.map(enemy => ({
        id: enemy.id,
        pos: {...enemy.pos},
        size: enemy.size
    }));
    dto.bullets = bullets.map(blt => ({
        id: blt.getId(),
        pos: {...blt.getPos()},
        size: blt.getSize()
    }));
    return dto;
}

class HittingDetector{
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

class CharacterDTO{
    /**@type {number} */
    id;
    /**@type {Position} */
    pos;
    /**@type {number} */
    size;

    /**
     * CharacterをDTO化します.
     * @constructor
     * @param {Character} chr 
     */
    constructor(chr){
        this.id = chr.id;
        this.pos = {...chr.pos};
        this.size = chr.size;
    }
}

class BulletDTO{
    /**@type {number} */
    id;
    /**@type {Position} */
    pos;
    /**@type {number} */
    size;

    /**
     * BulletをDTO化します.
     * @constructor
     * @param {Bullet} bullet 
     */
    constructor(bullet){
        this.id = bullet.getId();
        this.pos = {...bullet.getPos()};
        this.size = bullet.getSize();
    }
}