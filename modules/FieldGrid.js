/**@module FieldGrid */
import {Character, Bullet, Util} from "../modules.js";
/**
 * @import {Vector2} from "../types/Vector2"
 */

/**
 * @typedef {{ pos: Vector2 }} HasPos
 * 
 * @typedef {"player" | "enemy" | "bullet"} FieldObjectTypes
 * 
 * @typedef FieldObjects
 * @prop {number[]} characterIds
 * @prop {number[]} bulletIds
 */

const {floor} = Math;

/**
 * - フィールド内で座標を持つオブジェクトを空間ごとに管理します
 * @class
 */
export default class FieldGrid{
    /**@private @type {Map<string, number[]>}*/
    _gridObjectIdsMap = new Map();
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
        const DIFFS_LENGTH = 9;
        this._cellSize = cellSize;
        this._diffs = [-cellSize, 0, cellSize];
        this._diffsOfAllNearbyGrids = new Array(DIFFS_LENGTH);
        for(let idx = 0; idx < DIFFS_LENGTH; idx++){
            // 要素数9より、{diffX,diffY}は全組み合わせが表現される
            const diffX = this._diffs[floor(idx / 3)];
            const diffY = this._diffs[idx % 3];
            this._diffsOfAllNearbyGrids[idx] = {diffX, diffY};
        }
    }

    /**
     * @public @method
     * @param {Vector2} pos
     * @returns {Vector2} 属するグリッドの起点座標
     */
    getGridBasePosition(pos){
        const cellSize = this._cellSize;
        return {
            x: floor(pos.x / cellSize),
            y: floor(pos.y / cellSize)
        };
    }

    /**
     * @public @method
     * @param {Vector2} pos
     * @returns {string} グリッドを表す文字列
     */
    getGridKey(pos){
        const {x, y} = this.getGridBasePosition(pos);
        return `${x}-${y}`;
    }

    /**
     * 周囲一帯9グリッド範囲に存在するオブジェクトidを取得
     * @public @method
     * @param {Vector2} pos - 探索の基準となる座標
     * @returns {number[]}
     */
    getObjectIdsOfNearbyGrids(pos){
        /**@type {number[]} */
        const retObjectIds = [];

        for(const diff of this._diffsOfAllNearbyGrids){
            const gridObjectIds = this.getSameGridObjectIds(Util.Pos.move(pos, diff));
            retObjectIds.push(...gridObjectIds);
        }
        return retObjectIds;
    }

    /**
     * 同一グリッド内のオブジェクトを取得
     * @public @method
     * @param {Vector2} pos 
     * @returns {number[]}
     */
    getSameGridObjectIds(pos){
        const key = this.getGridKey(pos);
        const gridObjects = this._gridObjectIdsMap.get(key) ?? [];
        return [...gridObjects];
    }

    /**
     * 座標に基づいてグリッドに割り当てます
     * @public @method
     * @param {number} id - ゲームオブジェクトのid
     * @param {Vector2} pos - ゲームオブジェクトの座標
     */
    register(id, pos){
        const key = this.getGridKey(pos);
        const gridObjectIds = this._gridObjectIdsMap.get(key);
        if(!gridObjectIds) this._gridObjectIdsMap.set(key, [id]);
        else gridObjects.push(id);
    }

    /**
     * - 全グリッド情報をクリアします.
     * @public @method
     */
    clear(){
        this._gridObjectIdsMap.clear();
    }
}