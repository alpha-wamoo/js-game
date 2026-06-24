/**@module FieldGrid */
import {Character, Bullet, Util} from "../modules.js";
/**
 * @import {Position} from "../modules.js"
 */

/**
 * @typedef {{ pos: Position }} HasPos
 * 
 * @typedef {"character" | "bullet"} FieldObjectTypes
 * 
 * @typedef FieldObjects
 * @prop {Character[]} characters
 * @prop {Bullet[]} bullets
 */

/**
 * - フィールド内で座標を持つオブジェクトを空間ごとに管理します
 * @class
 * @template T
 */
export default class FieldGrid{
    /**@private @type {Map<string, T[]>}*/
    _gridObjectsMap = new Map();
    /**@private @type {number} */
    _cellSize;
    /**@private @type {number[]} */
    _diffs;
    /**@private @type {{diffX: number, diffY: number}[]} */
    _diffsOfAllNearbyGrids;

    /**
     * @public @constructor
     * @param {number} cellSize 
     */
    constructor(cellSize){
        this._cellSize = cellSize;
        this._diffs = [-cellSize, 0, cellSize];
        this._diffsOfAllNearbyGrids = Array.from({length:9}, (_, idx) => {
            // 要素数9より、{diffX,diffY}は全組み合わせが表現される
            const diffX = this._diffs[Math.floor(idx / 3)];
            const diffY = this._diffs[idx % 3];
            return {diffX, diffY};
        });
    }

    /**
     * @private @method
     * @param {Position} pos
     * @returns {Position} 属するグリッド座標
     */
    _getGridPosition(pos){
        return {
            x: Math.floor(pos.x / this._cellSize),
            y: Math.floor(pos.y / this._cellSize)
        };
    }

    /**
     * @private @method
     * @param {Position} pos
     * @returns {string} グリッドを表す文字列
     */
    _getKeyByPosition(pos){
        const {x, y} = this._getGridPosition(pos);
        return `${x}-${y}`;
    }

    /**
     * 周囲一帯9グリッド範囲でオブジェクトを取得
     * @public @method
     * @param {Position} pos - 探索の基準となる座標
     * @returns {T[]}
     */
    getObjectsOfNearbyGrids(pos){
        /**@type {T[]} */
        const retObjects = [];

        for(const diff of this._diffsOfAllNearbyGrids){
            const key = this._getKeyByPosition(Util.Pos.move(pos, diff));
            const gridObjects = this._gridObjectsMap.get(key);
            if(!gridObjects) continue;
            for(const gridObj of gridObjects) retObjects.push(gridObj);
        }
        return retObjects;
    }

    /**
     * 同一グリッド内のオブジェクトを取得
     * @public @method
     * @param {Position} pos 
     * @returns {T[]}
     */
    getSameGridObjects(pos){
        /**@type {T[]} */
        const retObjects = [];
        const key = this._getKeyByPosition(pos);
        const gridObjects = this._gridObjectsMap.get(key);
        for(const gridObj of gridObjects) retObjects.push(gridObj);
        return retObjects;
    }

    /**
     * 座標に基づいてグリッドに割り当てます
     * @public @method
     * @param {T & HasPos} obj - .posで座標を取得可能なゲームオブジェクト
     */
    register(obj){
        if(!obj.pos) console.log(`オブジェクトのプロパティposを取得できません.`);
        const key = this._getKeyByPosition(obj.pos);
        const gridObjects = this._gridObjectsMap.get(key);
        if(!gridObjects) this._gridObjectsMap.set(key, [obj]);
        else gridObjects.push(obj);
    }

    /**
     * - 全グリッド情報をクリアします.
     * @public @method
     */
    clear(){
        this._gridObjectsMap.clear();
    }
}