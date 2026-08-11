/**@module Character */
import {Keyboard, Stage, FPS, Bullet, JsonData, SoundManager, Drawer, Util, Game} from "../modules.js";
/**
 * @typedef {import("../modules").Position} Position
 * @typedef {import("../modules").Direction} Direction
 * @typedef {import("../modules").CharacterTypeId} CharacterTypeId
 */

/**
 * ステージのキャラクター（プレイヤーも含む）
 * @class
 */
export default class Character{

    /**
     * @constructor
     * @param {number} length - Enemyの数
     */
    constructor(length){
        /**@type {HTMLImageElement[]} */
        this.img = new Array(length);
        /**@type {Float32Array} */
        this.speed = new Float32Array(length);
        /**@type {string[]} */
        this.typeId = new Array(length);
        /**@type {Uint8Array} */
        this.hitDmg = new Uint8Array(length);
        /**@type {Uint8Array} */
        this.bulletDmg = new Uint8Array(length);
        /**@type {Uint8Array} */
        this.rewardScore = new Uint8Array(length);
        this.bulletShootableCnt = 0;
        /**@type {Position} */
        this.posBegin;
        /**@type {number[6]} */
        this.randoms = [];
        /**@type {number} */
        this.runnableCnt = JsonData.skillDefinition.RUN_FASTER.INTERVAL;
        /**@type {number} */
        this.magicUsableCnt = JsonData.skillDefinition.MAGIC.INTERVAL;
        this.isEnpowered = false;
        this.unbeatableTime = 0 * 1000;
        this.unbeatableCnt = 0;
        this.isAlpha = false;
        /**@type {(chr: Character) => Position} */
        this.motion = (pos, speed, frame) => {};
    }

    /**
     * 別のオブジェクトとして出現時の値をセットします.(idは継承)
     * @param {CharacterTypeId} typeId
     * @param {string} imgSrc
     * @param {Position} pos
     * @param {number} size
     * @param {number} max_hp
     * @returns {Character}
     */
    reset(typeId, imgSrc, pos, size, max_hp){
        this.isAlpha = false;
        this.frame = 0;
        this.typeId = typeId;
        this.img = new Image();
        this.img.src = imgSrc;
        this.pos = pos;
        this.posBegin = {...pos};
        this.size = size;
        this.max_hp = max_hp;
        this.hp = max_hp;
        for(let i = 0; i < 6; i++) this.randoms[i] = Math.random();

        return this;
    }

    /**
     * 同一のキャラクターであるかをidに基づいて判定します
     * @param {Character} src 
     * @returns {boolean}
     */
    isSameWith(src){
        return src.id === this.id;
    }

    /**
     * キャラクターの表示画像をセットします
     * @param {string} src - 画像のパス
     * @returns {Character}
     */
    setImage(src){
        this.img = new Image();
        this.img.src = src;
        return this;
    }

    /**
     * 報酬スコアをセットします
     * @param {number} rewardScore 
     * @returns {Character}
     */
    setRewardScore(rewardScore){
        this.rewardScore = rewardScore;
        return this;
    }

    /**
     * キャラクターの位置をセットします
     * @param {Position} pos 
     * @returns {Character}
     */
    setPos(pos){
        this.pos = pos;
        return this;
    }

    /**
     * キャラクターのサイズをセットします
     * @param {number} size
     * @returns {Character}
     */
    setSize(size){
        this.size = size;
        return this;
    }

    /**
     * キャラクターの速さをセットします
     * @param {number} speed
     * @returns {Character}
     */
    setSpeed(speed){
        this.speed = speed;
        return this;
    }

    /**
     * キャラクターの動きをセットします.
     * @note プレイヤーへの使用は非推奨.
     * @param {(chr: Character) => Position} motion 
     * @returns {Character}
     */
    setMotion(motion){
        this.motion = motion;
        return this;
    }

    /**
     * 中央の座標を返します.
     * @deprecated 座標が中央となるように描画をしているため、不必要.
     * @returns {Position}
     */
    getCenter(){
        return {
            x: this.pos.x - this.size / 2,
            y: this.pos.y - this.size / 2
        };
    }

    /**
     * hpを操作し、返します
     * @param {(hp: number) => number} operation hpへの操作
     * @returns {number} - 操作後のhp
     */
    updateHp(operation){
        this.hp = operation(this.hp);
        return this.hp;
    }

    /**
     * 指定した座標との距離を求めます
     * @param {Position} pos 座標
     * @returns {number} 距離
     */
    getDistanceTo(pos){
        const posDiff = {
            x: pos.x - this.pos.x,
            y: pos.y - this.pos.y
        };
        return Math.hypot(posDiff.x, posDiff.y);
    }

    /**
     * 当たった時の与ダメージをセットします
     * @param {number} dmg ダメージ量
     * @returns {Character}
     */
    setHitDmg(dmg){
        this.hitDmg = dmg;
        return this;
    }

    /**
     * 発射される弾丸の威力をセットします
     * @param {number} dmg 威力
     * @returns {Character}
     */
    setBulletDmg(dmg){
        this.bulletDmg = dmg;
        return this;
    }

    /**
     * ダメージを与えます.
     * @note 死亡処理は行っていません. *runDeath*に実装してください.
     * @note 無敵時間の影響を受けます.
     * @param {number} dmg ダメージ量
     * @param {Object} [options] 
     * @param {boolean} [options.allowSound] 同時に音"hit"を再生します
     * @param {(chr: Character) => void} [options.runDeath] 死亡時に実行する処理
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
     * 毎フレーム呼び出して無敵時間を減少させます
     * @param {number} deltaMs
     */
    decrementUnbeatableCnt(deltaMs){
        if(this.unbeatableCnt <= 0) return;
        this.unbeatableCnt = Math.max(0, this.unbeatableCnt - deltaMs);
    }

    /**
     * モーションキーを使用して、モーション用の関数を取得します.
     * @static
     * @param {keyof typeof Character.motionPatterns} key モーションキー
     * @returns {(chr: Character) => Position} モーション用の関数
     */
    static getMotionByKey(key){
        return this.motionPatterns[key];
    }

    /**
     * 発射可能な場合、弾丸を発射します
     * @note 現在プレイヤー用の実装. 必要に応じて拡張予定.
     * @param {Stage} stage 弾丸の出現するステージ
     * @returns {void}
     */
    shootBullet(stage){
        if(this.bulletShootableCnt > 0) return;

        const {ENPOWERED_BULLET, BULLET} = JsonData.config;
        const {SHOOTABLE_INTERVAL_SEC, SPEED, SIZE, COLOR} = (this.isEnpowered) ? ENPOWERED_BULLET : BULLET;

        this.bulletShootableCnt = SHOOTABLE_INTERVAL_SEC * 1000;
        shoot(this, { x: 0, y: -SPEED });
        shoot(this, { x: SPEED, y: 0 });
        shoot(this, { x: -SPEED, y: 0 });
        if(this.isEnpowered){
            shoot(this, { x: SPEED, y: -SPEED });
            shoot(this, { x: -SPEED, y: -SPEED });
            shoot(this, { x: 0, y: SPEED });
        }
        setTimeout(() => SoundManager.play("shoot", 1.25), 0);

        /**
         * @param {Character} chr 
         * @param {Position} speedVec
         * */
        function shoot(chr, speedVec){
            stage.spawnBlt(speedVec, chr.bulletDmg, chr, COLOR, chr.pos, SIZE);
        }
    }

    /**
     * bulletShootableCntを減算します.
     * @param {number} num 
     */
    decrementBulletShootableCnt(num){
        this.bulletShootableCnt -= num;
        this.bulletShootableCnt = Math.max(0, this.bulletShootableCnt);
    }

    /**
     * 一定時間の間、移動速度が上昇します.
     * @note プレイヤー用です.
     */
    runFaster(){
        const {SPEED_RATE, DURATION, INTERVAL, CNT_UPDATE_INTERVAL} = JsonData.skillDefinition.RUN_FASTER;
        if(this.runnableCnt < INTERVAL) return;

        this.runnableCnt = 0;
        this.speed *= SPEED_RATE;
        Drawer.drawAnimation("green_wind", this.pos, { scale: 1.25, speed: 0.5 });
        SoundManager.play("run_fast");

        const intervalId = setInterval(() => {
            if(this.runnableCnt === DURATION) this.speed /= SPEED_RATE;
            else if(this.runnableCnt === INTERVAL) return clearInterval(intervalId);
            this.runnableCnt += CNT_UPDATE_INTERVAL;
        }, CNT_UPDATE_INTERVAL);
    }

    /**
     * 魔法攻撃によって範囲内の敵を攻撃し、回復と一定時間のバフを付与します.
     * @note プレイヤー用です.
     * @param {Stage} stage 発動するステージ
     * @param {Game} game
     */
    useMagic(stage, game){
        const {INTERVAL, ATK_REACH, DAMAGE, BUFF_DELAY_SEC, BUFF_DURATION_SEC, SPEED_RATE, CNT_UPDATE_INTERVAL} = JsonData.skillDefinition.MAGIC;
        if(this.magicUsableCnt < INTERVAL) return;

        this.magicUsableCnt = 0;
        const targets = stage.getValidChrs(chr => chr.typeId !== "player").filter(enemy => enemy.getDistanceTo(this.pos) <= ATK_REACH);

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