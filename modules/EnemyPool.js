/**
 * @import {Vector2} from "../types/Vector2"
 */
import {JsonData, Enum, Util, FPS} from "../modules.js";

const {CANV_W, CANV_H} = JsonData.config;
const N_RANDOMS = 6;
const {randInRange, chance} = Util;
const {sin, cos, min, floor, ceil, random, PI} = Math;

/**@type {((size: number) => Vector2)[]} */
const spawnPosGetters = [
    // simply-down
    size => {
        const marginX = 50;
        return {
            x: floor(random() * (CANV_W - 2 * marginX) + marginX),
            y: 10
        };
    },
    // sin
    size => {
        return {
            x: randInRange(size / 2, CANV_W / 8),
            y: size/2
        };
    },
    // h-parabola
    size => {
        return {
            x: size / 2,
            y: randInRange(size / 2, CANV_H / 2)
        };
    },
    // cyclic
    size => {
        const MARGIN = 30;
        return {
            x: randInRange(size/2 + MARGIN, CANV_W - size/2 - MARGIN),
            y: randInRange(size/2 + MARGIN, CANV_H - size/2 - MARGIN)
        };
    }
];

/**@type {((pool: EnemyPool, id: number) => Vector2)[]} */
const motionPatterns = [
    // simply-down
    ({posList: pos, speedList: speed}, id) => {
        const {x, y} = pos[id];
        return { x, y: y + speed[id] };
    },
    // sin
    ({frameList, speedList, randomsList, sizeList}, id) => {
        const sec = frameList[id] / FPS;
        const x = prevX + sec * speedList[id] * randomsList[0]**2;
        const yAmplifier = CANV_H * randomsList[1];
        return { x, y: yAmplifier * (1 + sin(sec * speedList[id] * randomsList[2] - 3/4 * PI)) / 2 + sizeList[id]/2 };
    },
    // h-parabola
    ({posList, speedList, frameList, randomsList}, id) => {
        const sec = frameList[id] / FPS;
        const originX = randomsList[0] * CANV_W;
        const originY = randomsList[1] * CANV_H;
        const y = posList[id].y + sec * speedList[id] * randomsList[2];
        return {
            x: - (randomsList[3]**2) * (y - originY)**2 + originX,
            y
        };
    },
    // cyclic
    ({frameList, speedList, posBeginList, randomsList}, id) => {
        const sec = frameList[id] / FPS;
        const beginX = posBeginList[id].x;
        const beginY = posBeginList[id].y;
        const diffX = (min(CANV_W - beginX, beginX) * randomsList[0] / 2) * cos(sec * speedList[id] * randomsList[2] * PI);
        const diffY = (min(CANV_H - beginY, beginY) * randomsList[1] / 2) * sin(sec * speedList[id] * randomsList[3] * PI);
        return {
            x: beginX + diffX,
            y: beginY + diffY
        };
    }
];

export default class EnemyPool{
    /**@private @type {number[]} */
    _freeIdStack = [];
    /**@private @type {number} */
    _poolSize = 0;

    /**
     * - Enemyプールを生成し、初期化します
     * @constructor
     * @param {number} length - Enemyの最大数(0-255)
     */
    constructor(length){
        const bitFlagsArrayLength = ceil(length / 32);
        this._poolSize = length;

        /**@type {Uint32Array} */
        this.validStateFlags = new Uint32Array(bitFlagsArrayLength);
        /**@type {Uint16Array} */
        this.sizeList = new Uint16Array(length);
        /**@type {Uint8Array} */
        this.idList = new Uint8Array(length);
        /**@type {Uint32Array} */
        this.frameList = new Uint32Array(length);
        /**@type {HTMLImageElement[]} */
        this.imgList = new Array(length);
        /**@type {Float32Array} */
        this.speedList = new Float32Array(length);
        /**@type {Uint8Array} */
        this.typeIdList = new Uint8Array(length);
        /**@type {Uint8Array} */
        this.hitDmgList = new Uint8Array(length);
        /**@type {Uint16Array} */
        this.maxHpList = new Uint16Array(length);
        /**@type {Uint16Array} */
        this.hpList = new Uint16Array(length);
        /**@type {Uint8Array} */
        this.rewardScoreList = new Uint8Array(length);
        /**@type {Vector2[]} */
        this.posBeginList = new Array(length);
        /**@type {Vector2[]} */
        this.posList = new Array(length);
        /**@type {Float32Array[]} */
        this.randomsList = new Array(length);
        /**@type {Uint32Array} */
        this.alphaStateFlags = new Uint32Array(bitFlagsArrayLength);
        /**@type {Uint8Array} */
        this.motionIdList = new Uint8Array(length);

        // プールの各要素初期化
        for(let i = 0; i < length; i++){
            this.idList[i] = i;
            this.randomsList[i] = new Float32Array(N_RANDOMS);
            this.imgList[i] = new Image();
            this._freeIdStack.push(i);
        }
    }

    /**
     * - randomsプロパティの乱数リストを更新します
     * @param {number} id 
     */
    reloadRandoms(id){
        for(let i = 0; i < N_RANDOMS; i++) this.randomsList[id][i] = random();
    }

    /**
     * - 新たに敵を出現させます
     * @param {number} typeId 
     */
    spawn(typeId){
        const freeId = this._freeIdStack.pop();
        if(!freeId) throw new Error("新たに敵を出現させるためのプールの空きがありません");

        const bitFlagsIdx = freeId >>> 5;
        const bitIdx = freeId & 0b11111;
        const mask = 1 << bitIdx;
        if(this.validStateFlags[bitFlagsIdx] & mask) return;

        const {IMG_SRC, SIZE, SPEED, MAX_HP, HIT_DMG, REWARD_SCORE, MOTION_KEY, EXIST_ALPHA} = JsonData.enemiesDefinition[typeId];
        const {ALPHA_RATE} = JsonData.config.ENEMY;
        const motionId = Enum.EnemyMotionId[MOTION_KEY];
        const spawnPos = EnemyPool.spawnPosGetters[motionId](SIZE);
        const isAlpha = EXIST_ALPHA && chance(ALPHA_RATE);

        this.validStateFlags[bitFlagsIdx] |= mask;
        this.sizeList[freeId] = SIZE;
        this.frameList[freeId] = 0;
        this.imgList[freeId].src = IMG_SRC;
        this.speedList[freeId] = SPEED;
        this.typeIdList[freeId] = typeId;
        this.hitDmgList[freeId] = HIT_DMG;
        this.maxHpList[freeId] = MAX_HP;
        this.hpList[freeId] = MAX_HP;
        this.rewardScoreList[freeId] = REWARD_SCORE;
        this.posBeginList[freeId] = spawnPos;
        this.posList[freeId] = {...spawnPos};
        this.alphaStateFlags[bitFlagsIdx] &= ~mask;
        this.alphaStateFlags[bitFlagsIdx] |= isAlpha << bitIdx;
        this.motionIdList[freeId] = motionId;

        // randoms 初期化
        for(let i = 0; i < N_RANDOMS; i++) this.randomsList[freeId][i] = random();

        if(isAlpha) this.toAlpha(freeId);
    }

    /**
     * - 敵を消滅させます
     * @param {number} id 
     */
    despawn(id){
        const {validStateFlags, _freeIdStack} = this;
        const bitFlagsIdx = id >>> 5;
        const bitIdx = id & 0b11111;
        const mask = 1 << bitIdx;
        if(validStateFlags[bitFlagsIdx] & mask !== 0) return;

        _freeIdStack.push(id);
        validStateFlags[bitFlagsIdx] &= ~mask;
    }

    /**
     * - ダメージを与えます.
     * @note 死亡処理は行っていません. *runDeath*に実装してください.
     * @param {number} id 
     * @param {number} dmg ダメージ量
     * @param {Object} [options] 
     * @param {(pool: EnemyPool) => void} [options.runDeath] 死亡時に実行する処理
     * @returns {number} 事後hp
     */
    applyDamage(id, dmg, options = {}){
        const runDeath = options?.runDeath ?? null;
        this.hpList[id] -= dmg;
        if(this.hpList[id] <= 0 && runDeath) runDeath(this);
        return this.hpList[id];
    }

    /**
     * - α化します
     * @param {number} id
     */
    toAlpha(id){
        const {SPEED_RATE, DMG_RATE, HP_RATE, SIZE_RATE, REWARD_RATE} = JsonData.config.ENEMY.ALPHA;
        if(this.alphaStateFlags[id >>> 5] ) return;
        const bitFlagsIdx = id >>> 5;
        const bitIdx = id & 0b11111;
        const mask = 0b1 << bitIdx;

        this.alphaStateFlags[bitFlagsIdx] |= mask;
        this.speedList[id] *= SPEED_RATE;
        this.hitDmgList[id] *= DMG_RATE;
        this.rewardScoreList[id] *= REWARD_RATE;
        this.sizeList[id] *= SIZE_RATE;
        this.maxHpList[id] *= HP_RATE;
        this.hpList[id] *= HP_RATE;
    }

    /**
     * @param {number} id
     * @return {boolean}
     */
    isValid(id){
        const bitFlagsIdx = id >>> 5;
        const bitIdx = id & 0b11111;
        const mask = 1 << bitIdx;

        return (this.validStateFlags[bitFlagsIdx] & mask) !== 0;
    }

    /**
     * - 設定された規則に基づいて敵の座標を更新します
     */
    moveEnemies(){
        const {isValid, _poolSize, motionIdList, posList} = this;
        const {motionPatterns} = EnemyPool;
        for(let id = 0; id < _poolSize; id++){
            if(!isValid(id)) continue;

            const motionId = motionIdList[id];
            posList[id] = motionPatterns[motionId](this, id);
        }
    }
}