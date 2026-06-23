/**@module Game */
import {Keyboard, Stage, Character, FPS, Drawer, SoundManager, Util, JsonData, WorkManager} from "../modules.js";
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
    /**@private @type {Character} */
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
        const game = new Game(canvs, ctxs, stage)
        .setPlayer(await stage.spawnChr("player"));
        await Drawer.setContexts(game._contexts);
        Drawer.replaceBG(JsonData.bgDefinition.DEFAULT);

        return game;
    }

    /**
     * - ゲームを開始します.
     * @public
     * @method
     * @returns {void}
     */
    start(){
        const operationCanv = document.getElementById("ui");
        // const operationCanv = this._canvs.ui;
        operationCanv.focus();

        // subscribe keyboard
        operationCanv.onkeydown = ev => Keyboard.keydown(ev);
        operationCanv.onkeyup = ev => Keyboard.keyup(ev);
        operationCanv.onblur = ev => Keyboard.clear();

        // sound
        SoundManager.play("start");
        this._bgm = SoundManager.play("battle_bgm_default");

        // call interval
        this._boundMainLoop();
    }

    finish(){
        console.log("finish..");
    }

    /**
     * - 毎フレーム実行されます.
     * @public
     * @method
     */
    mainLoop(){
        Drawer.clear("object");
        Drawer.clear("ui");

        this._pl = this._stage._validChrs.find(chr => chr.typeId === "player");
        const {NATURAL_HEAL, BULLET} = JsonData.config;
        if(this.isInterval(0.5 * 1000)) this._stage.spawnRandEnemy();
        if(this.isInterval(1000)) this.updateScore(s => s + 1, false);
        if(this.isInterval(NATURAL_HEAL.INTERVAL)) this._pl?.applyHeal(NATURAL_HEAL.HP, { allowSound: true, allowAnimation: true });

        this.updateFrame();
        this.drawFrame();

        this._frame++;
        if(this._pl) requestAnimationFrame(this._boundMainLoop);
        else this.finish();
    }

    /**
     * - フレームごとの状態を更新します.
     * @public
     * @method
     */
    updateFrame(){
        const stage = this._stage;
        const pl = this._pl;
        const enemies = stage.getValidChrs(chr => chr !== pl);
        const bullets = stage.getValidBlts();
        const {RUN} = JsonData.config;

        // score
        // TODO: score

        // keyboard monitor
        if(Keyboard.isPressed("d")) pl.move(stage, "right");
        if(Keyboard.isPressed("a")) pl.move(stage, "left");
        if(Keyboard.isPressed("w")) pl.move(stage, "up");
        if(Keyboard.isPressed("s")) pl.move(stage, "down");
        if(Keyboard.isPressed(" ")) pl.shootBullet(stage);
        if(Keyboard.isAllPressed("shift", "enter")) pl.useMagic(stage, this);    
        else if(Keyboard.isPressed("enter")) pl.runFaster();

        // enemies update
        for(const enemy of enemies){
            enemy.enemyMove();
            // TODO: fieldGridを座標から更新
            stage.fieldChrGrid.register(enemy);
            if(!stage.isInsidePos(enemy.pos)) stage.killChr(enemy);
            enemy.frame++;
        }

        // bullets update
        for(const blt of bullets){
            blt.updatePos();
            stage.fieldBltGrid.register(blt);
            if(!stage.isInsidePos(blt.getPos())) stage.killBlt(blt);
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
        for(const nearbyChr of stage.fieldChrGrid.getObjectsOfNearbyGrids(pl.pos)){
            if(nearbyChr === pl) continue;
            if(!GameObj.isHittingTo(pl, nearbyChr)) continue;
            const hittingEnemy = nearbyChr;
            console.log("hit pl <-> enemy");

            Drawer.enqueueAnimation("effect_small_explode", Pos.ave(hittingEnemy.pos, pl.pos));
            hittingEnemy.applyDamage(hittingEnemy.hitDmg * 2.5 / FPS, {
                runDeath: deadEnemy => {
                    this.updateScore(s => s + deadEnemy.rewardScore);
                    stage.killChr(deadEnemy);
                }
            });
            pl.applyDamage(hittingEnemy.hitDmg, {
                allowSound: true,
                runDeath: deadPl => stage.killChr(deadPl)
            });
        }
        // -> enemy hits with bullet (grid)
        for(const enemy of enemies){
            for(const nearbyBlt of stage.fieldBltGrid.getObjectsOfNearbyGrids(enemy.pos)){
                if(!GameObj.isHittingTo(enemy, nearbyBlt)) continue;
                const hittingBlt = nearbyBlt;
                console.log("hit enemy <-> bullet");

                enemy.applyDamage(hittingBlt.getDmg(), {
                    allowSound: true,
                    runDeath: deadEnemy => {
                        if(hittingBlt.getOwner() === pl) this.updateScore(s => s + deadEnemy.rewardScore);
                        stage.killChr(deadEnemy);
                    }
                });
                Drawer.enqueueAnimation("effect_small_explode", hittingBlt.getPos());
                stage.killBlt(hittingBlt);
            }
        }

        // grid clear
        stage.fieldBltGrid.clear();
        stage.fieldChrGrid.clear();

        // unbeatable time
        const deltaMs = 1000 / FPS;
        for(const validChr of stage.getValidChrs()) validChr.decrementUnbeatableCnt(deltaMs);
        pl.decrementBulletShootableCnt(deltaMs);
    }

    /**
     * - 画面構成要素を描画します
     * @public
     * @method
     */
    // TODO: 動的要素もキューからまとめて描画する実装に変更
    drawFrame(){
        const stage = this._stage;
        const enemies = stage.getValidChrs(chr => chr.typeId !== "player");
        const timeFromStart = this.getTimeFromStart();
    
        Drawer.drawStatusField("Arial", [
            { size: 45, text: `[ ${timeFromStart.min} : ${timeFromStart.sec} ]` },
            { size: 25,text: `SCORE: ${this._score}` }
        ]);
        Drawer.drawValidBullets(stage.getValidBlts());
        Drawer.drawValidCharacters(stage.getValidChrs());

        // ゲージを描画
        Drawer.drawEnemiesHealthBar(enemies, "rgb(225, 200, 255)", "rgb(166, 41, 149)");
        Drawer.drawPlayerHealthBar(this._pl, "rgb(168, 5, 105)", "rgb(67, 111, 255)");
        Drawer.drawRunnableBar(this._pl.runnableCnt);
        Drawer.drawMagicUsableBar(this._pl.magicUsableCnt);

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
     * @private
     * @method
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