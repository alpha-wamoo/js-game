import {JsonData, Enum, SoundManager, Stage, Drawer} from "../modules.js";
/**
 * @import {Vector2} from "../types/Vector2"
 */

const {DirectionMask, PlayerHealOptionMask} = Enum;

export default class Player{

    /**
     * - プレイヤーインスタンスを生成して初期化します
     * @constructor
     */
    constructor(){
        const {SIZE, SPEED, MAX_HP, IMG_SRC, POS_PRESET, BULLET_DMG, UNBEATABLE_TIME} = JsonData.playerDefinition;
        const INTERVAL_RUN_FASTER = JsonData.skillDefinition.RUN_FASTER.INTERVAL;
        const INTERVAL_MAGIC = JsonData.skillDefinition.MAGIC.INTERVAL;

        /**@type {boolean} */
        this.isValid = true;
        /**@type {HTMLImageElement} */
        this.img = new Image();
        this.img.src = IMG_SRC;
        /**@type {number} */
        this.size = SIZE;
        /**@type {number} */
        this.speed = SPEED;
        /**@type {number} */
        this.bulletDmg = BULLET_DMG;
        /**@type {number} */
        this.bulletShootableCnt = 0;
        /**@type {Vector2} */
        this.posBegin = POS_PRESET;
        /**@type {Vector2} */
        this.pos = POS_PRESET;
        /**@type {number} */
        this.runnableCnt = INTERVAL_RUN_FASTER;
        /**@type {number} */
        this.magicUsableCnt = INTERVAL_MAGIC;
        /**@type {boolean} */
        this.isEnpowered = false;
        /**@type {number} */
        this.unbeatableTime = UNBEATABLE_TIME;
        /**@type {number} */
        this.unbeatableCnt = 0;
        /**@type {number} */
        this.size = SIZE;
        /**@type {number} */
        this.max_hp = MAX_HP;
        /**@type {number} */
        this.hp = MAX_HP;
    }

    /**
     * 被ダメージ時の無敵時間をセットします.
     * @note 無敵時間を開始する関数ではない.
     * @param {number} time - ms
     * @returns {Character}
     */
    setUnbeatableTime(time){
        this.unbeatableTime = time;
        return this;
    }

    /**
     * - ダメージを与えます.
     * @note 死亡処理は行っていません. *runDeath*に実装してください.
     * @note 無敵時間の影響を受けます.
     * @param {number} dmg ダメージ量
     * @param {Object} [options] 
     * @param {boolean} [options.allowSound] 同時に音"hit"を再生します
     * @param {(pl: Player) => void} [options.runDeath] 死亡時に実行する処理
     * @returns {number} 事後hp
     */
    applyDamage(dmg, options = {}){
        if(this.unbeatableCnt > 0) return this.hp;

        const allowSound = options?.allowSound ?? false;
        const runDeath = options?.runDeath ?? null;

        this.unbeatableCnt = this.unbeatableTime;
        this.hp -= dmg;
        if(allowSound) SoundManager.play("hit");
        if(this.hp <= 0 && runDeath) runDeath(this);
        return this.hp;
    }

    /**
     * 回復を与えます
     * @param {number} increment 回復量
     * @param {number} optionBits 
     */
    applyHeal(increment, optionBits = 0){
        const {IGNORE_MAX, ALLOW_SOUND, ALLOW_ANIMATION} = PlayerHealOptionMask;
        const {max_hp, pos} = this;
        this.hp += increment;
        if(optionBits & IGNORE_MAX === 0 && this.hp > max_hp) this.hp = max_hp;
        if(optionBits & ALLOW_SOUND !== 0) SoundManager.play("heal", 1.75);
        if(optionBits & ALLOW_ANIMATION !== 0) Drawer.enqueueAnimation("heart", pos, { scale: 1.25, speed: 0.5 });
    }

    /**
     * @param {Stage} stage ステージ
     * @param {number} directionBits 方向
     * @returns {Vector2} 移動したベクトル
     */
    move(stage, directionBits){
        const {speed, pos, size} = this;
        const delta = speed / FPS;
        const {x, y} = pos;

        if(directionBits & DirectionMask.RIGHT !== 0 && stage.isInsidePos({ x: x + delta + size/2 })){
            pos.x = x + delta;
        } else if(directionBits & DirectionMask.LEFT !== 0 && stage.isInsidePos({ x: x - delta - size/2 })){
            pos.x = x - delta;
        } else if(directionBits & DirectionMask.DOWN !== 0 && stage.isInsidePos({ y: y + delta + size/2 })){
            pos.y = y + delta;
        } else if(directionBits & DirectionMask.UP !== 0 && stage.isInsidePos({ y: y - delta - size/2 })){
            pos.y = y - delta;
        }
    }
}