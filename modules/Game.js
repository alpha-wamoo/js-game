/**@module Game */
import {Keyboard, Stage, Player, EnemyPool, FPS, Drawer, SoundManager, Util, JsonData, Enum} from "../modules.js";
import {default as constructDTO} from "./worker/HittingDetector.js";

/**
 * @typedef Contexts
 * @prop {CanvasRenderingContext2D?} bg
 * @prop {CanvasRenderingContext2D?} object
 * @prop {CanvasRenderingContext2D?} ui
 * 
 * @typedef Canvases
 * @prop {HTMLCanvasElement} bg
 * @prop {HTMLCanvasElement} object
 * @prop {HTMLCanvasElement} ui
 */

const {DirectionMask, KeyMasks, KeyIdxs, SoundId, PlayerHealOptionMask, DamageOptionMask} = Enum;

/**
 * - ゲームの初期化、開始、ゲームループを行います.
 * - Stageインスタンスを持ちます.
 * @class
 */
export default class Game{
    /**@private @type {Contexts} */
    _contexts = {};
    /**@private @type {Canvases} */
    _canvs = {};
    /**@private @type {Stage} */
    _stage;
    /**@private @type {Player} */
    _pl;
    /**@private @type {number} */
    _score = 0;
    /**@private @type {number} */
    _frame = 0;
    /**@private @type {HTMLAudioElement} */
    _bgm;
    /**@private @type {HTMLCanvasElement} */
    _canv;

    /**
     * @constructor
     * @param {Canvases} canvs
     * @param {Contexts} ctxs - 全レイヤーのコンテキスト
     * @param {Stage} stage - ステージ
     */
    constructor(canvs, ctxs, stage){
        this._canvs = canvs;
        this._contexts = ctxs;
        this._stage = stage;
        this._boundMainLoop = this.mainLoop.bind(this);
    }

    /**
     * - Gameを開始可能な状態に初期化します.
     * @public
     * @static @async @method
     * @param {Canvases} canvs
     * @param {Contexts} ctxs - 全レイヤーのコンテキスト
     * @param {Stage} stage - ステージ
     * @returns {Game} this
     */
    static async init(canvs, ctxs, stage){
        const game = new Game(canvs, ctxs, stage).setPlayer(new Player());
        await Drawer.setContexts(game._contexts);
        Drawer.replaceBG(JsonData.bgDefinition.DEFAULT);

        return game;
    }

    /**
     * - ゲームを開始します.
     * @public @async
     * @method
     * @returns {void}
     */
    async start(){
        const operationCanv = document.getElementById("ui");
        // const operationCanv = this._canvs.ui;
        operationCanv.focus();

        // subscribe keyboard
        operationCanv.onkeydown = ev => Keyboard.keydown(ev);
        operationCanv.onkeyup = ev => Keyboard.keyup(ev);
        operationCanv.onblur = ev => Keyboard.clear();

        // sound
        SoundManager.play(SoundId.START);
        this._bgm = await SoundManager.play(SoundId.BATTLE_BGM_DEFAULT);

        // call interval
        try {
            this._boundMainLoop();
        } catch (error) {
            console.error("Error occurred in main loop:", error);
        }
    }

    finish(){
        console.log("finish..");
    }

    /**
     * - 毎フレーム実行されます.
     * @public @method
     */
    mainLoop(){
        const {_pl, _stage} = this;
        const {ALLOW_SOUND, ALLOW_ANIMATION} = PlayerHealOptionMask;
        Drawer.clear("object");
        Drawer.clear("ui");

        const {NATURAL_HEAL, BULLET} = JsonData.config;
        if(this.isInterval(0.5 * 1000)) _stage.enemyPool.spawnRandomType();
        if(this.isInterval(1000)) this.updateScore(s => s + 1, false);
        if(this.isInterval(NATURAL_HEAL.INTERVAL)) _pl?.applyHeal(NATURAL_HEAL.HP, ALLOW_SOUND | ALLOW_ANIMATION);

        this.updateFrame();
        this.drawFrame();

        this._frame++;
        if(_pl) requestAnimationFrame(this._boundMainLoop);
        else this.finish();
    }

    /**
     * - フレームごとの状態を更新します.
     * @public
     * @method
     */
    updateFrame(){
        const {_pl, _stage} = this;
        const {enemyPool, bulletPool, fieldEnGrid, fieldBltGrid} = _stage;
        const enemieIds = enemyPool.getValidIds();
        const bulletIds = bulletPool.getValidIds();

        // score
        // TODO: score

        // keyboard monitor
        // Keyboard.updateC();

        let directionBits = 0b0;
        if(Keyboard.isPressedAny(KeyMasks[KeyIdxs["d"]])) directionBits |= DirectionMask.RIGHT;
        if(Keyboard.isPressedAny(KeyMasks[KeyIdxs["a"]])) directionBits |= DirectionMask.LEFT;
        if(Keyboard.isPressedAny(KeyMasks[KeyIdxs["w"]])) directionBits |= DirectionMask.UP;
        if(Keyboard.isPressedAny(KeyMasks[KeyIdxs["s"]])) directionBits |= DirectionMask.DOWN;
        _pl.move(_stage, directionBits);
        if(Keyboard.isPressedAny(KeyMasks[KeyIdxs[" "]])) _pl.shootBullets(bulletPool);
        if(Keyboard.isPressedAll(KeyMasks[KeyIdxs["shift"]] | KeyMasks[KeyIdxs["enter"]])) _pl.useMagic(_stage, this);
        else if(Keyboard.isPressedAny(KeyMasks[KeyIdxs["enter"]])) _pl.runFaster();

        // enemies update
        for(const enemyId of enemieIds){
            const {posList, frameList} = enemyPool;
            enemyPool.move(enemyId);
            const enemyPos = posList[enemyId];
            fieldEnGrid.register(enemyId, enemyPos);
            if(!_stage.isInsidePos(enemyPos)) enemyPool.despawn(enemyId);
            frameList[enemyId]++;
        }

        // bullets update
        for(const bulletId of bulletIds){
            const {posList} = bulletPool;
            const bulletPos = bulletPool.move(bulletId);
            fieldBltGrid.register(bulletId, bulletPos);
            if(!_stage.isInsidePos(bulletPos)) bulletPool.despawn(bulletId);
        }

        // TODO: 当たり判定のアルゴリズムを最適化する. 複数の領域に分割して管理.
        // -> HittingDetector thread 
        // const dto = constructDTO({player: this._pl, enemies, bullets});
        /**@import {DtoToMain} from "./worker/HittingDetector.js" */
        // WorkManager.activate("HittingDetector", dto, (ev) => {
        //     /**@type {DtoToMain?} */
        //     const detectedPairs = ev.data;
        //     if(!detectedPairs) return;

        //     // player hit with enemy
        //     detectedPairs.pl_enemy.forEach(enemyId => {
        //         const enemy = stage.getChrPool().getByIdx(enemyId);
        //         if(!enemy) return;
        //         Drawer.enqueueAnimation("effect_small_explode", Util.averagePos(enemy.pos, pl.pos));
        //         enemy.applyDamage(enemy.hitDmg * 2.5 / FPS, {
        //             runDeath: dead => {
        //                 this.updateScore(s => s + dead.rewardScore);
        //                 stage.killChr(dead);
        //             }
        //         });
        //         this._pl.applyDamage(enemy.hitDmg, {
        //             allowSound: true,
        //             runDeath: dead => stage.killChr(dead)
        //         });
        //     });

        //     // enemy hits with bullet
        //     detectedPairs.enemy_blt.forEach(ids => {
        //         const enemy = stage.getChrPool().getByIdx(ids.enemy);
        //         const blt = stage.getBltPool().getByIdx(ids.blt);
        //         if(!enemy || !blt) return;

        //         enemy.applyDamage(blt.getDmg(), {
        //             allowSound: true,
        //             runDeath: deadChr => {
        //                 if(blt.getOwner() === this._pl) this.updateScore(s => s + deadChr.rewardScore);
        //                 stage.killChr(deadChr);
        //             }
        //         });
        //         Drawer.enqueueAnimation("effect_small_explode", blt.getPos());
        //         stage.killBlt(blt);
        //     });
        // });

        // -> player hits with enemy (grid)
        const {Pos, GameObj} = Util;
        const {isHittingTo, calcRange} = GameObj;
        const plRange = _pl.calcRange();
        const {posList, hitDmgList, rewardScoreList} = enemyPool;
        for(const enemyId of fieldEnGrid.getObjectIdsOfNearbyGrids(_pl.pos)){
            const enemyRange = calcRange(enemyPool, enemyId);
            if(!isHittingTo(plRange, enemyRange)) continue;

            console.log("hit pl <-> enemy");
            Drawer.enqueueAnimation("effect_small_explode", Pos.ave(posList[enemyId], _pl.pos));
            enemyPool.applyDamage(enemyId, hitDmgList[enemyId] * 2.5 / FPS, DamageOptionMask.ALLOW_SOUND,
                pool => this.updateScore(s => s + rewardScoreList[enemyId])
            );
            _pl.applyDamage(hitDmgList[enemyId], DamageOptionMask.ALLOW_SOUND);

        }
        // for(const nearbyChr of _stage.fieldChrGrid.getObjectIdsOfNearbyGrids(_pl.pos)){
        //     if(nearbyChr === _pl) continue;
        //     if(!GameObj.isHittingTo(_pl, nearbyChr)) continue;
        //     const hittingEnemy = nearbyChr;
        //     console.log("hit pl <-> enemy");

        //     Drawer.enqueueAnimation("effect_small_explode", Pos.ave(hittingEnemy.pos, _pl.pos));
        //     hittingEnemy.applyDamage(hittingEnemy.hitDmg * 2.5 / FPS, {
        //         runDeath: deadEnemy => {
        //             this.updateScore(s => s + deadEnemy.rewardScore);
        //             _stage.killChr(deadEnemy);
        //         }
        //     });
        //     _pl.applyDamage(hittingEnemy.hitDmg, {
        //         allowSound: true,
        //         runDeath: deadPl => _stage.killChr(deadPl)
        //     });
        // }
        // -> enemy hits with bullet (grid)
        for(const enemyId of enemieIds){
            const enemyRange = calcRange(enemyPool, enemyId);
            for(const bulletId of fieldBltGrid.getObjectIdsOfNearbyGrids(posList[enemyId])){
                const bulletRange = calcRange(bulletPool, bulletId);
                if(!isHittingTo(enemyRange, bulletRange)) continue;

                console.log("hit enemy <-> bullet");
                enemyPool.applyDamage(enemyId, bulletPool.dmgList[bulletId], DamageOptionMask.ALLOW_SOUND,
                    pool => {
                        const flagsIdx = bulletId >>> 5;
                        const bitIdx = bulletId & 0b11111;
                        const mask = 1 << bitIdx;
                        if(bulletPool.isPlayerOwnerFlags[flagsIdx] & mask !== 0) this.updateScore(s => s + rewardScoreList[enemyId]);
                    }
                );
                Drawer.enqueueAnimation("effect_small_explode", bulletPool.posList[bulletId]);
                bulletPool.despawn(bulletId);
            }
        }

        // grid clear
        fieldBltGrid.clear();
        fieldEnGrid.clear();

        // unbeatable time
        const deltaMs = 1000 / FPS;
        _pl.decrementUnbeatableCnt(deltaMs);
        _pl.decrementBulletShootableCnt(deltaMs);
    }

    /**
     * - 画面構成要素を描画します
     * @public
     * @method
     */
    // TODO: 動的要素もキューからまとめて描画する実装に変更
    drawFrame(){
        const {_stage, _pl, _score} = this;
        const {enemyPool, bulletPool} = _stage;
        const enemyIds = enemyPool.getValidIds();
        const timeFromStart = this.getTimeFromStart();

        Drawer.drawStatusField("Arial", [
            { size: 45, text: `[ ${timeFromStart.min} : ${timeFromStart.sec} ]` },
            { size: 25,text: `SCORE: ${_score}` }
        ]);
        Drawer.drawValidBullets(bulletPool);
        Drawer.drawValidEnemies(enemyPool);
        Drawer.drawPlayer(_pl);

        // ゲージを描画
        Drawer.drawEnemiesHealthBar(enemyIds, "rgb(225, 200, 255)", "rgb(166, 41, 149)");
        Drawer.drawPlayerHealthBar(_pl, "rgb(168, 5, 105)", "rgb(67, 111, 255)");
        Drawer.drawRunnableBar(_pl.runnableCnt);
        Drawer.drawMagicUsableBar(_pl.magicUsableCnt);

        // エンキューされた動的要素をまとめて描画
        Drawer.drawQueuedAnimations();
        Drawer.drawQueuedDynamicTexts();
    }

    /**
     * @private
     * @method
     * @param {Character} pl 
     * @returns {Game} this
     */
    setPlayer(pl){
        this._pl = pl;
        return this;
    }

    /**
     * @private
     * @method
     * @param {number} ms 
     * @returns {boolean} this
     */
    isInterval(ms){
        return this._frame % (FPS * ms / 1000) === 1;
    }

    /**
     * - スコアを与えた関数によって変更します.
     * @private @method
     * @param {(score: number) => number} operation - 更新処理
     * @param {boolean} [allowPopup] - スコア変化量のポップアップを描画します. default: true.
     * @returns {number} 更新後のスコア
     */
    updateScore(operation, allowPopup = true){
        const prevScore = this._score;
        this._score = Math.floor(operation(this._score));
        if(this._score < 0) this._score = 0;
        if(allowPopup){
            const pl = this._pl;
            // const popupPos = Util.Pos.add(pl.pos, {x: pl.size/2, y: -pl.size/2});
            const popupPos = Util.Pos.move(pl.pos, { diffX: pl.size/2 });
            Drawer.drawScoreUpdatePopup(this._score - prevScore, popupPos);
        }

        if(prevScore < 1000 && 1000 <= this._score){
            // TODO: レベルアップ処理などを書く
        }
        return this._score;
    }

    /**
     * - ゲーム開始からの時間を返します
     * @private
     * @method
     * @returns {{sec: string, min: string}} secとminを00形式の文字列で返します
     */
    getTimeFromStart(){
        const totalSec = this._frame / FPS;
        const time ={
            sec: Math.floor(totalSec % 60),
            min: Math.floor(totalSec / 60)
        };
        const timeTexts = {
            sec: String(time.sec).padStart(2, "0"),
            min: String(time.min).padStart(2, "0")
        };
        return timeTexts;
    }

    /**
     * - ステージを取得します.
     * @public
     * @method
     * @returns {Stage} - ステージ
     */
    getStage(){
        return this._stage;
    }
}