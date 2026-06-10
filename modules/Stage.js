import {Character} from "../modules.js";
/**
 * @typedef {import("../modules").Position} Position
 * @typedef {import("../modules").Bounds} Bounds
 * @typedef {import("../modules").CharacterTypeId} CharacterTypeId
 */

export default class Stage{
    /**@type {Bounds} */
    bounds;
    /**@type {Character[]} */
    _chrs = [];
    /**@type {number} */
    _score = 0;

    /**
     * @param {Bounds} bounds 
     */
    constructor(bounds){
        this.bounds = bounds;
    }

    /**
     * 座標がステージの範囲内かを判定します
     * @param {Position} pos
     * @returns {boolean}
     */
    isInside(pos){
        if(pos.x){
            const xIsInside = this.bounds.min.x <= pos.x && pos.x <= this.bounds.max.x;
            if(!xIsInside) return false;
        }
        if(pos.y){
            const yIsInside = this.bounds.min.y <= pos.y && pos.y <= this.bounds.max.y;
            if(!yIsInside) return false;
        }
        return true;
    }

    /**
     * - キャラクターを出現させ、返します
     * @param {CharacterTypeId} typeId
     * @param {string} imgSrc
     * @param {Position} pos 
     * @param {number} size 
     * @param {number} speed
     * @param {number} max_hp
     * @returns {Character}
     */
    spawnChr(typeId, imgSrc, pos, size, speed, max_hp){
        const spawnedChr = new Character(typeId, imgSrc, pos, size, max_hp).setSpeed(speed);
        this._chrs.push(spawnedChr);
        return spawnedChr;
    }

    /**
     * キャラクターを削除します
     * @param {Character} target
     */
    killChr(target){
        this._chrs = this._chrs.filter(chr => chr.id != target.id);
    }

    /**
     * - ステージ内で条件を満たしたキャラクターを取得します
     * - 条件がない場合、すべて取得します
     * @param {(chr: Character) => boolean} includer
     * @returns {Character[]}
     */
    getChrs(includer = () => true){
        return this._chrs.filter(chr => includer(chr));
    }
}