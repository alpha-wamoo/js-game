/**@module Stage */
import {JsonData, FieldGrid, EnemyPool, BulletPool, Enum, Util} from "../modules.js";

/**
 * @import {Vector2} from "../types/Vector2"
 * @import {Bounds} from "../types/Bounds"
 */


/**
 * - ステージを扱います.
 * - ステージ内のCharacter、Bulletを管理します.
 * @class
 */
export default class Stage{
    /**@type {Bounds} */
    bounds;
    /**@public @type {EnemyPool} */
    enemyPool = new EnemyPool(JsonData.config.STAGE.ENEMIES_CAPACITY);
    /**@public @type {BulletPool} */
    bulletPool = new BulletPool(JsonData.config.STAGE.BULLETS_CAPACITY);
    /**@public @type {FieldGrid} */
    fieldEnGrid = new FieldGrid(JsonData.config.STAGE.CELL_SIZE);
    /**@public @type {FieldGrid} */
    fieldBltGrid = new FieldGrid(JsonData.config.STAGE.CELL_SIZE);
    /**@private @type {number} */
    _level = 1;

    /**
     * @param {Bounds} bounds 
     */
    constructor(bounds){
        this.bounds = bounds;
    }

    /**
     * 座標がステージの範囲内かを判定します
     * @param {Vector2} pos
     * @returns {boolean}
     */
    isInsidePos(pos){
        const {min, max} = this.bounds;
        const {x, y} = pos;
        if(x !== undefined){
            const xIsInside = min.x <= x && x <= max.x;
            if(!xIsInside) return false;
        }
        if(y !== undefined){
            const yIsInside = min.y <= y && y <= max.y;
            if(!yIsInside) return false;
        }
        return true;
    }

    /**
     * - ステージ内で条件を満たしたキャラクターを取得します
     * - 条件がない場合、すべて取得します
     * @param {(chr: Character) => boolean} [includer]
     * @returns {Character[]}
     */
    getValidChrs(includer){
        if(includer) return this._validChrs.filter(chr => includer(chr));
        return this._validChrs;
    }

    /**
     * - ステージ内で条件を満たした弾丸を取得します
     * - 条件がない場合、すべて取得します
     * @param {(blt: Bullet) => boolean} [includer] 
     * @returns {Bullet[]}
     */
    getValidBlts(includer){
        if(includer) return this._validBlts.filter(blt => includer(blt));
        return this._validBlts;
    }

    /**
     * @returns {number} - ステージのレベル
     */
    getLevel(){
        return this._level;
    }

    /**
     * ステージのレベルを設定します
     * @param {number} value 
     */
    setLevel(value){
        this._level = value;
    }

    /**
     * レベルを増減させます
     * @param {number} increment - レベルの増減量
     * @returns {number} - 増減後のレベル
     */
    incrementLevel(increment){
        this._level += increment;
        return this._level;
    }
}