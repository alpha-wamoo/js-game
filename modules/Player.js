import {JsonData, Enum, SoundManager, Stage, Drawer, BulletPool} from "../modules.js";
/**
 * @import {Vector2} from "../types/Vector2"
 * @import {Bounds} from "../types/Bounds"
 */

const {DirectionMask, PlayerHealOptionMask, SoundId, DamageOptionMask: PlayerDamageOptionMask} = Enum;

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
     * - Playerの中心座標を取得します
     * @returns {Vector2}
     */
    getCenterPos(){
        const {pos, size} = this;
        return {
            x: pos.x + size/2,
            y: pos.y + size/2
        };
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
     * - 無敵時間カウントを進めます
     * @param {number} amt 
     * @returns {number} - 残りの無敵時間カウント
     */
    decrementUnbeatableCnt(amt){
        this.unbeatableCnt -= amt;
        const {unbeatableCnt} = this;
        if(unbeatableCnt < 0) this.unbeatableCnt = 0;
        return unbeatableCnt;
    }

    /**
     * - 弾丸発射クールタイムを進めます
     * @param {number} amt 
     * @returns {number} - 残りのクールタイム
     */
    decrementBulletShootableCnt(amt){
        this.bulletShootableCnt -= amt;
        const {bulletShootableCnt} = this;
        if(bulletShootableCnt < 0) this.bulletShootableCnt = 0;
        return bulletShootableCnt;
    }

    /**
     * - ダメージを与えます.
     * @note 死亡処理は行っていません. *runDeath*に実装してください.
     * @note 無敵時間の影響を受けます.
     * @param {number} dmg ダメージ量
     * @param {number} [optionFlag=0] オプションフラグ
     * @param {(pl: Player) => void} [runDeath] 死亡時に実行する処理
     * @returns {number} 事後hp
     */
    applyDamage(dmg, optionFlag = 0, runDeath = null){
        if(this.unbeatableCnt > 0) return this.hp;

        const {ALLOW_SOUND} = PlayerDamageOptionMask;
        this.unbeatableCnt = this.unbeatableTime;
        this.hp -= dmg;
        if(optionFlag & ALLOW_SOUND !== 0) SoundManager.play(SoundId.HIT);
        if(this.hp <= 0){
            runDeath?.(this);
            this.death();
        }
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
        if(optionBits & ALLOW_SOUND !== 0) SoundManager.play(SoundId.HEAL, 1.75);
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

    /**
     * 弾を発射します
     * @param {BulletPool} bulletPool 
     * @returns {void}
     */
    shootBullets(bulletPool){
        if(this.bulletShootableCnt > 0) return;

        const {ENPOWERED_BULLET, BULLET} = JsonData.config;
        const {SHOOTABLE_INTERVAL_SEC, SPEED, SIZE, COLOR} = (this.isEnpowered) ? ENPOWERED_BULLET : BULLET;
        shoot.call(this, { x: 0, y: -SPEED });
        shoot.call(this, { x: SPEED, y: 0 });
        shoot.call(this, { x: -SPEED, y: 0 });
        if(this.isEnpowered){
            shoot.call(this, { x: SPEED, y: -SPEED });
            shoot.call(this, { x: -SPEED, y: -SPEED });
            shoot.call(this, { x: 0, y: SPEED });
        }
        SoundManager.play(SoundId.SHOOT, 1.5);

        function shoot(velo){
            bulletPool.spawn(true, 0, this.pos, velo, this.bulletDmg, SIZE, COLOR);
        }
    }

    /**
     * - プレイヤーの矩形範囲を算出します
     * @returns {Bounds}
     */
    calcRange(){
        const {pos, size} = this;
        return {
            min: {
                x: pos.x,
                y: pos.y
            },
            max: {
                x: pos.x + size,
                y: pos.y + size
            }
        };
    }

    /**
     * - プレイヤーの死亡処理
     */
    death(){
        this.isValid = false;
        this.hp = 0.0;
        // TODO: 志望画面を実装
    }

    /**
     * - 一定時間の間、移動速度が上昇します.
     */
    runFaster(){
        const {SPEED_RATE, DURATION, INTERVAL, CNT_UPDATE_INTERVAL} = JsonData.skillDefinition.RUN_FASTER;
        if(this.runnableCnt < INTERVAL) return;

        this.runnableCnt = 0;
        this.speed *= SPEED_RATE;
        Drawer.drawAnimation("green_wind", this.pos, { scale: 1.25, speed: 0.5 });
        SoundManager.play("run_fast");

        const {runnableCnt} = this;
        const intervalId = setInterval(() => {
            if(runnableCnt === DURATION) this.speed /= SPEED_RATE;
            else if(runnableCnt === INTERVAL) return clearInterval(intervalId);
            this.runnableCnt += CNT_UPDATE_INTERVAL;
        }, CNT_UPDATE_INTERVAL);
    }

    /**
     * 魔法攻撃によって範囲内の敵を攻撃し、回復と一定時間のバフを付与します.
     * @param {Stage} stage 発動するステージ
     * @param {Game} game
     */
    useMagic(stage, game){
        const {INTERVAL, ATK_REACH, DAMAGE, BUFF_DELAY_SEC, BUFF_DURATION_SEC, SPEED_RATE, CNT_UPDATE_INTERVAL} = JsonData.skillDefinition.MAGIC;
        if(this.magicUsableCnt < INTERVAL) return;

        this.magicUsableCnt = 0;
        // const targets = stage.getValidChrs(chr => chr.typeId !== "player").filter(enemy => enemy.getDistanceTo(this.pos) <= ATK_REACH);

        Drawer.drawAnimation("magic_circle", this.pos, { scale: 3, speed: 0.2 });
        if(targets.length) SoundManager.play("gravity", 0.75);
        targets.forEach(target => {
            Drawer.enqueueAnimation("dark_wind", target.pos, { scale: 1.75, speed: 0.15 });
            target.applyDamage(DAMAGE, {
                runDeath: dead => {
                    game.updateScore(s => s + dead.rewardScore);
                    stage.killChr(dead);
                }
            });
        });

        // add buff
        setTimeout(() => {
            const {Pos} = Util;
            Drawer.enqueueAnimation("buff", Pos.add(this.pos, {x:this.size * 1.2, y:0}), { speed: 0.75, scale: 1.5 });
            this.applyHeal(3 * targets.length, { allowAnimation: true, allowSound: true });
            this.speed *= SPEED_RATE;
            this.isEnpowered = true;
            this.bulletDmg *= 1.5;
        }, BUFF_DELAY_SEC * 1000);

        // rem buff
        setTimeout(() => {
            this.speed /= SPEED_RATE;
            this.isEnpowered = false;
            this.bulletDmg /= 1.5;
        }, BUFF_DELAY_SEC * 1000 + BUFF_DURATION_SEC * 1000);

        // cnt
        const intervalId = setInterval(() => {
            if(this.magicUsableCnt >= INTERVAL){
                this.magicUsableCnt = INTERVAL;
                clearInterval(intervalId);
                return;
            }
            this.magicUsableCnt += CNT_UPDATE_INTERVAL;
        }, CNT_UPDATE_INTERVAL);
    }
}