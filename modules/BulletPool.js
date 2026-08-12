import {FPS} from "../modules";

/**
 * @import {Vector2} from "../types/Vector2"
 */

const {ceil, floor} = Math;
const FLAG_LENGTH = 32;
const FLAG_SHAMT = 5; // 2^5 = 32

export default class BulletPool{
    /**@private @type {number[]} */
    _freeIdStack = [];
    /**@private @type {number} */
    _poolSize = 0;

    /**
     * @constructor
     * @param {number} length - Bulletの最大数(0-255)
     */
    constructor(length){
        const flagsArrayLength = ceil(length / FLAG_LENGTH);
        this._poolSize = length;

        /**@type {Uint32Array} */
        this.validFlags = new Uint32Array(flagsArrayLength);
        /**@type {Uint8Array} */
        this.idList = new Uint8Array(length);
        /**@type {Vector2[]} */
        this.posList = new Array(length);
        /**@type {Vector2[]} */
        this.veloList = new Array(length);
        /**@type {Uint8Array} */
        this.dmgList = new Uint8Array(length);
        /**@type {Uint32Array} */
        this.isPlayerOwnerFlags = new Uint32Array(flagsArrayLength);
        /**@type {Uint8Array} */
        this.ownerIdList = new Uint8Array(length);
        /**@type {Uint8Array} */
        this.sizeList = new Uint8Array(length);
        /**@type {Uint32Array} */
        this.colorList = new Uint32Array(length);

        for(let i = 0; i < length; i++){
            this.idList[i] = i;
            this.posList[i] = {x:0, y:0};
            this.veloList[i] = {x:0, y:0};
            this._freeIdStack.push(i);
        }
    }

    /**
     * - プールからBulletを生成します
     * @param {boolean} isPlayerOwner 
     * @param {number} ownerId - Bulletの所有者のID。プレイヤーの場合は0、敵の場合はEnemyPoolのidを指定してください
     * @param {Vector2} pos 
     * @param {Vector2} velo 
     * @param {number} dmg 
     * @param {number} size 
     * @param {number} color 
     * @returns {number?} - 生成されたBulletのID。プールが満杯の場合はnullを返す
     */
    spawn(isPlayerOwner, ownerId,pos, velo, dmg, size, color){
        if(this._freeIdStack.length === 0) return null;

        const id = this._freeIdStack.pop();
        const flagsIdx = floor(id >>> FLAG_SHAMT);
        const bitIdx = id & (FLAG_LENGTH - 1);
        const mask = 1 << bitIdx;

        this.validFlags[flagsIdx] |= mask;
        this.posList[id] = pos;
        this.veloList[id] = velo;
        this.dmgList[id] = dmg;
        this.isPlayerOwnerFlags[flagsIdx] &= ~mask; // falseに初期化
        this.isPlayerOwnerFlags[flagsIdx] |= isPlayerOwner << bitIdx;
        this.ownerIdList[id] = ownerId;
        this.sizeList[id] = size;
        this.colorList[id] = color;
        return id;
    }

    /**
     * - 指定されたidのBulletをデスポーンします
     * @param {number} id - 消滅させるBulletのid
     * @returns {boolean} - 消滅に成功したかどうか
     */
    despawn(id){
        if(!this.isValid(id)) return false;

        const flagsIdx = floor(id >>> FLAG_SHAMT);
        const bitIdx = id & (FLAG_LENGTH - 1);
        const mask = 1 << bitIdx;

        this.validFlags[flagsIdx] &= ~mask;
        this._freeIdStack.push(id);
        return true;
    }

    /**
     * - 指定されたidのBulletが有効かどうかを判定します
     * @param {number} id - 判定するBulletのid
     * @returns {boolean} - Bulletが有効な場合true、それ以外はfalse
     */
    isValid(id){
        const flagsIdx = floor(id >>> FLAG_SHAMT);
        const bitIdx = id & (FLAG_LENGTH - 1);
        const mask = 1 << bitIdx;
        return this.validFlags[flagsIdx] & mask !== 0;
    }

    /**
     * - 有効なBulletのidを全て取得します
     * @returns {number[]}
     */
    getValidIds(){
        const {_poolSize} = this;
        const validIds = [];
        for(let id = 0; id < _poolSize; id++){
            if(this.isValid(id)) validIds.push(id);
        }
        return validIds;
    }

    /**
     * - Bulletの中心座標を取得します
     * @param {number} id 
     * @returns {Vector2}
     */
    getCenterPos(id){
        const {posList, sizeList} = this;
        const size = sizeList[id];
        return {
            x: posList[id].x + size/2,
            y: posList[id].y + size/2
        };
    }

    /**
     * - 全てのBulletを移動させます
     * @note この関数はBulletの位置を更新するだけで、画面外判定や衝突判定は行いません
     * @returns {void}
     */
    moveAll(){
        const poolSize = this._poolSize;
        const {posList, veloList} = this;
        for(let i = 0; i < poolSize; i++){
            if(!this.isValid(i)) continue;
            posList[i].x += veloList[i].x / FPS;
            posList[i].y += veloList[i].y / FPS;
        }
    }

    /**
     * - 指定したBulletを移動させます
     * @param {number} id
     * @returns {Vector2} 移動後の座標
     */
    move(id){
        const {posList, veloList} = this;
        posList[id].x += veloList[id].x / FPS;
        posList[id].y += veloList[id].y / FPS;
        return posList[id];
    }
}