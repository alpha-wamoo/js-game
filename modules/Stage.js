/**@module Stage */
import {Character, Bullet, JsonData, ObjectPool, FieldGrid, GOManager} from "../modules.js";

/**
 * @import {ElementStructs} from "./GOManager.js"
 * @typedef {import("../modules").Position} Position
 * @typedef {import("../modules").Bounds} Bounds
 * @typedef {import("../modules").CharacterTypeId} CharacterTypeId
 * 
 * @typedef BulletStruct
 * @prop {0|1} isValid
 * @prop {number} id
 * @prop {number} size
 * @prop {number} posX
 * @prop {number} posY
 * @prop {number} ownerId
 * @prop {number} dmg
 */

/**
 * - ステージを扱います.
 * - ステージ内のCharacter、Bulletを管理します.
 * @class
 */
export default class Stage{
    /**@type {Bounds} */
    bounds;
    /**@private @type {Character[]} */
    _validChrs = [];
    /**@private @type {FieldGrid<Character>} */
    _fieldChrGrid = new FieldGrid(JsonData.config.STAGE.CELL_SIZE);
    /**@private */
    _chrPool = new ObjectPool(JsonData.config.STAGE.CHARACTERS_CAPACITY, id => new Character(id));
    /**@private @type {Bullet[]} */
    _validBlts = [];
    /**@private @type {FieldGrid<Bullet>} */
    _fieldBltGrid = new FieldGrid(JsonData.config.STAGE.CELL_SIZE);
    /**@private */
    _bltPool = new ObjectPool(JsonData.config.STAGE.BULLETS_CAPACITY, id => new Bullet(id));
    /**@private @type {number} */
    _level = 1;
    /**@type {GOManager<BulletStruct>} */
    _bulletManager = new GOManager(JsonData.config.STAGE.BULLETS_CAPACITY, {
        isValid: {type: "Uint8", offset: 0, bytes: 1},
        id: {type:"Uint8", offset: 1, bytes: 1},
        size: {type: "Uint8", offset: 2, bytes: 1},
        posX: {type: "Float32", offset: 3, bytes: 4},
        posY: {type: "Float32", offset: 7, bytes: 4},
        ownerId: {type: "Uint8", offset: 11, bytes: 1},
        dmg: {type: "Uint8", offset: 12, bytes: 1},
        speedX: {type: "Float32", offset: 13, bytes: 4},
        speedY: {type: "Float32", offset: 17, bytes: 4},
        colorR: {type: "Uint8", offset: 21, bytes: 1},
        colorG: {type: "Uint8", offset: 22, bytes: 1},
        colorB: {type: "Uint8", offset: 23, bytes: 1}
    });

    /**
     * @param {Bounds} bounds 
     */
    constructor(bounds){
        this.bounds = bounds;
    }

    get fieldChrGrid(){
        return this._fieldChrGrid;
    }

    get fieldBltGrid(){
        return this._fieldBltGrid;
    }

    /**
     * 座標がステージの範囲内かを判定します
     * @param {Position} pos
     * @returns {boolean}
     */
    isInsidePos(pos){
        if(pos.x !== undefined){
            const xIsInside = this.bounds.min.x <= pos.x && pos.x <= this.bounds.max.x;
            if(!xIsInside) return false;
        }
        if(pos.y !== undefined){
            const yIsInside = this.bounds.min.y <= pos.y && pos.y <= this.bounds.max.y;
            if(!yIsInside) return false;
        }
        return true;
    }

    /**
     * @returns {Character}
     */
    spawnRandEnemy(){
        const enemies = JsonData.enemiesDefinition;
        const enemyTypeId = Object.keys(enemies).choose();
        return this.spawnChr(enemyTypeId);
    }

    /**
     * - キャラクターを出現させ、返します
     * - player以外の場合、スポーン地点はランダムに決定します
     * @param {string} typeId
     * @param {Position} [pos]
     * @returns {Character}
     */
    spawnChr(typeId, pos){
        let spawnedChr = this._chrPool.get();
        if(typeId === "player") {
            const {size, speed, max_hp, imgSrc, beginPos, bltDmg, unbeatableTime} = JsonData.playerDefinition;
            spawnedChr.reset(typeId, imgSrc, beginPos, size, max_hp)
            .setSpeed(speed)
            .setBulletDmg(bltDmg)
            .setUnbeatableTime(unbeatableTime);
        } else {
            const {ALPHA_RATE} = JsonData.config.ENEMY;
            const {imgSrc, size, speed, max_hp, hit_dmg, rewardScore, motionKey, existAlpha} = JsonData.enemiesDefinition[typeId];
            spawnedChr.reset(typeId, imgSrc, pos ?? Character.spawnPosGetters[motionKey](size), size, max_hp)
            .setSpeed(speed)
            .setMotion(Character.getMotionByKey(motionKey))
            .setHitDmg(hit_dmg)
            .setRewardScore(rewardScore);
            if(existAlpha && Math.random() < ALPHA_RATE) spawnedChr.toAlpha();
            // console.log(`spawned: ${spawnedChr.typeId}\nlength: ${this._chrs.length}`);
        }
        this._validChrs.push(spawnedChr);
        return spawnedChr;
    }

    /**
     * 弾丸を出現させ、返します
     * @param {Position} speed 
     * @param {number} dmg 
     * @param {Character} owner 
     * @param {string} color
     * @param {Position} pos 
     * @param {number} size
     * @returns {Bullet}
     */
    spawnBlt(speed, dmg, owner, color, pos = owner.pos, size = JsonData.config.BULLET.SIZE){
        const spawnedBlt = this._bltPool.get()
        .reset(speed, dmg, owner, pos, size)
        .setColor(color);
        this._validBlts.push(spawnedBlt);
        return spawnedBlt;
    }

    /**
     * キャラクターを削除します
     * @param {Character} target 
     * @returns {void}
     */
    // TODO: もう一度見直す
    killChr(target){
        const idx = this._validChrs.indexOf(target);
        if(idx !== -1) this._validChrs.splice(idx, 1);
        this._chrPool.release(target);
    }

    /**
     * 弾丸を削除します
     * @param {Bullet} target 削除対象の弾丸
     */
    killBlt(target){
        const delIdx = this._validBlts.findIndex(blt => blt === target);
        if(delIdx === -1) return;
        this._validBlts.splice(delIdx, 1);
        this._bltPool.release(target);
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
     * @returns {ObjectPool<Character>}
     */
    getChrPool(){
        return this._chrPool;
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
     * @returns {ObjectPool<Bullet>}
     */
    getBltPool(){
        return this._bltPool;
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