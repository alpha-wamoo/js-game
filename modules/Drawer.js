/**@module Drawer */
import {JsonData, Util, FPS, Queue, BulletPool, EnemyPool, Player} from "../modules.js";

/**
 * @import {AnimationDefinition} from "../types/AnimationDefinition"
 * @import {Vector2} from "../types/Vector2"
 * @import {AnimationQueueItem} from "../types/AnimationQueueItem"
 * @import {DynamicTextQueueItem} from "../types/DynamicTextQueueItem"
 */



/**@enum {AnimationDefinition} */
const AnimationDefinitionsEnum = {
    "effect_small_explode": {
        src: "./images/animation/pipo-btleffect003.png",
        w: 120,
        h: 120,
        cnt: 5
    },
    "green_wind": {
        src: "./images/animation/pipo-btleffect039.png",
        w: 240,
        h: 240,
        cnt: 8
    },
    "fire": {
        src: "./images/animation/pipo-btleffect037.png",
        w: 240,
        h: 240,
        cnt: 8
    },
    "magic_circle": {
        src: "./images/animation/pipo-btleffect007.png",
        w: 240,
        h: 240,
        cnt: 14
    },
    "buff": {
        src: "./images/animation/pipo-btleffect019.png",
        w: 240,
        h: 240,
        cnt: 10
    },
    "heart": {
        src: "./images/animation/pipo-btleffect016.png",
        w: 240,
        h: 240,
        cnt: 8
    },
    "dark_wind": {
        src: "./images/animation/pipo-btleffect017.png",
        w: 240,
        h: 240,
        cnt: 8
    }
};

const {max, random} = Math;

/**
 * ゲームの背景、オブジェクト、UIを描画します.
 * @class
 */
export default class Drawer{
    /**@private @static @enum {CanvasRenderingContext2D | null} */
    static _contexts = {
        bg: null,
        object: null,
        ui: null
    };

    /**@private @static @type {Queue<DynamicTextQueueItem>} */
    static _dynamicTexts = new Queue();
    /**@private @static @type {Queue<AnimationQueueItem>} */
    static _animations = new Queue();

    /**
     * コンテキストを取得します
     * @public @static
     * @param {keyof typeof this._contexts} id 
     * @returns {CanvasRenderingContext2D | null} コンテキスト
     */
    static getContext(id){
        return this._contexts[id];
    }

    /**
     * 指定されたコンテキストをクリアします
     * @public @static
     * @param {keyof typeof this._contexts} ctxId 
     */
    static clear(ctxId){
        const ctx = this.getContext(ctxId);
        const {CANV_W, CANV_H} = JsonData.config;
        if(ctx) ctx.clearRect(0, 0, CANV_W * 1.2, CANV_H * 1.2);
    }

    /**
     * 背景を入れ替えます
     * @public @static
     * @param {string} bgSrc - 背景画像のパス 
     * @returns {HTMLImageElement} 背景画像のHTMLImageElement
     */
    static replaceBG(bgSrc){
        this.clear("bg");
        const {CANV_W, CANV_H} = JsonData.config;
        const img = new Image();
        img.src = bgSrc;
        img.onload = () => {
            this.getContext("bg").drawImage(img, 0, 0, CANV_W, CANV_H);
        }
        return img;
    }

    /**
     * コンテキストを設定します
     * @public @static
     * @param {typeof this._contexts} ctxs 
     */
    static setContexts(ctxs){
        this._contexts = ctxs;
    }

    /**
     * 画面左上のステータスフィールドを描画します
     * @public @static
     * @param {string} fontFamily - 字体
     * @param {Object[]} statusTexts
     * @param {string} statusTexts.text - 表示するテキスト
     * @param {string} [statusTexts.color] - rgbaもしくはrgb
     * @param {number} [statusTexts.size] - 大きさ
     */
    static drawStatusField(fontFamily, statusTexts){
        const DEFAULT_SIZE = 20, DEFAULT_COLOR = "rgb(255, 255, 255)";
        const MARGIN = 40;
        const totalBoxSize = {
            width: max(...statusTexts.map(({text, size}) => this.getContext("ui").measureText(text).width * (size ?? DEFAULT_SIZE) / DEFAULT_SIZE)) + 2 * MARGIN,
            height: statusTexts.reduce((acc, {size}) => acc + Util.ptToPx(size ?? DEFAULT_SIZE), 0) + MARGIN
        };
        this.getContext("ui").fillStyle = "rgba(0, 0, 0, 0.25)";
        this.getContext("ui").fillRect(0, 0, totalBoxSize.width, totalBoxSize.height);

        let offsetY = MARGIN;
        for(const {text, color, size} of statusTexts){
            this.getContext("ui").fillStyle = color ?? DEFAULT_COLOR;
            this.getContext("ui").font = `${size ?? DEFAULT_SIZE}pt ${fontFamily}`;
            this.getContext("ui").fillText(text, MARGIN, offsetY);
            offsetY += Util.ptToPx(size ?? DEFAULT_SIZE);
        }
    }

    /**
     * そのフレームだけテキストを描画します
     * @public @static
     * @param {string} text - 表示する文字列
     * @param {Position} pos - 描画する座標です. 通常は最小座標として描画します.
     * @param {Object} options 
     * @param {string} options.rgb - テキストの色
     * @param {number} options.size - pixelサイズ
     * @param {string} [options.family] - フォントの種類. default "Arial"
     * @param {boolean} [options.isCenterPos] - posを中心座標として描画します. default false.
     */
    // TODO: 他の関数で呼び出すようにする
    static drawText(text, pos, options){
        const ctx = this.getContext("ui");
        const {Pos} = Util;
        const {rgb, size, family = "Arial", isCenterPos = false} = options;
        ctx.fillStyle = rgb;
        ctx.font = `${size}px ${family}`;
        const minPos = isCenterPos? Pos.centerToMin(pos, {x: ctx.measureText(text).width, y: size}) : pos;
        ctx.fillText(text, minPos.x, minPos.y);
    }

    /**
     * 中央にタイトルを描画します
     * @public @static
     * @param {string} title - 表示する文字列
     * @param {string} [subtitle] - タイトルの下に表示されます
     * @param {Object} [options]
     * @param {number} [options.duration] - 継続する時間(ms)
     * @param {number} [options.frameCnt] - 開始するフレーム番号
     */
    static drawTitle(title, subtitle = "", options = {}){
        const {duration = 2*1000, frameCnt = 0} = options;
        if(frameCnt >= duration*FPS/1000) return;

        const ctx = this.getContext("ui"), {Pos} = Util;
        const {CANV_W, CANV_H} = JsonData.config;
        const {TITLE_SIZE, SUBTITLE_SIZE, LINE_MARGIN} = JsonData.uiConfig.TITLE;
        const titleWidth = ctx.measureText(title).width, subtitleWidth = ctx.measureText(subtitle).width;
        const maxWidth = max(titleWidth, subtitleWidth);
        const totalHeight = TITLE_SIZE + LINE_MARGIN + SUBTITLE_SIZE;
        const center = { x: CANV_W/2, y: CANV_H/2 };
        const titleDrawingPos = Pos.centerToMin(center, {x: titleWidth, y: totalHeight});
        const subtitleDrawingPos = {
            x: center.x - subtitleWidth/2,
            y: titleDrawingPos.y + TITLE_SIZE + LINE_MARGIN
        };

        // TODO: drawTextを呼ぶ設計にしてみる
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.font = `${TITLE_SIZE}px Arial`;
        ctx.fillText(title, center.x - titleWidth/2, center.y - totalHeight/2);
        ctx.font = `${SUBTITLE_SIZE}px Arial`;
        ctx.fillText(subtitle, center.x - subtitleWidth/2, center.y - totalHeight/2 + TITLE_SIZE + LINE_MARGIN + SUBTITLE_SIZE);

        // TODO: duration管理処理がきちんとできているか
        requestAnimationFrame(() => this.drawTitle(title, subtitle, {...options, frameCnt: frameCnt + 1}));
    }

    /**
     * フレーム数によって動く動的なテキストを出します.
     * @public @static
     * @param {number} duration テキストが表示される期間(ms)
     * @param {Object} setter 
     * @param {(frameCnt: number) => string} setter.text テキストをセットします.
     * @param {(frameCnt: number) => string} setter.rgb 色をセットします.
     * @param {(frameCnt: number) => number} setter.px サイズ(pixel)をセットします.
     * @param {(frameCnt: number) => Position} setter.pos 描画する範囲の最小座標（左上）を指定します.
     * @param {Object} [options] 
     * @param {number} [options.frameCnt] 開始するフレーム番号を指定します. default: 0
     * @param {boolean} [options.usingCenterPos] 中心座標を用いて描画する範囲を指定します. default: false
     */
    static enqueueDynamicText(duration, setter, options = {}){
        const {frameCnt = 0, usingCenterPos = false} = options;
        this._dynamicTexts.enqueue({ duration, setter, frameCnt, usingCenterPos });
    }

    /**
     * キューの動的テキストを描画し、終了したテキストを削除します.
     * @public @static
     */
    // TODO: 副作用がきちんと動作しているか確認
    static drawQueuedDynamicTexts(){
        const ctx = this.getContext("ui");
        const {Pos} = Util;
        this._dynamicTexts.setItems(
            this._dynamicTexts.items.filter(dText => {
                if(dText.frameCnt >= dText.duration*FPS/1000) return false;

                const text = dText.setter.text(dText.frameCnt);
                const rgb = dText.setter.rgb(dText.frameCnt);
                const px = dText.setter.px(dText.frameCnt);
                const pos = dText.usingCenterPos ? Pos.centerToMin(dText.setter.pos(dText.frameCnt), { x: ctx.measureText(text).width, y: px }) : dText.setter.pos(dText.frameCnt);

                ctx.fillStyle = rgb;
                ctx.font = `${px}px Arial`;
                ctx.fillText(text, pos.x, pos.y);

                dText.frameCnt++;
                return true;
            })
        );
    }

    /**
     * 与えられた弾丸を全て描画します
     * @public @static
     * @param {BulletPool} pool
     */
    static drawValidBullets(pool){
        const ctx = this.getContext("object");
        const {colorList, sizeList} = pool;
        for(const bulletId of pool.getValidIds()){
            const center = pool.getCenterPos(bulletId);
            const size = sizeList[bulletId];
            ctx.fillStyle = colorList[bulletId];
            ctx.fillRect(center.x, center.y, size, size);
        }
    }

    /**
     * 与えらたEnemyすべてを描画します
     * @public @static
     * @param {EnemyPool} pool
     */
    static drawValidEnemies(pool){
        const ctx = this.getContext("object");
        const {posList, sizeList, imgList} = pool;
        const ALPHA_AURA_COLOR = "rgb(255, 172, 172)";
        const ALPHA_AURA_AMT = 5;
        for(const enemyId of pool.getValidIds()){
            const pos = posList[enemyId];
            const size = sizeList[enemyId];
            const AURA_RANGE = size * 1.1;
            ctx.drawImage(imgList[enemyId], pos.x, pos.y, size, size);
            if(!pool.isAlpha(enemyId)) return;

            const DOT_SIZE = size/10;
            ctx.fillStyle = ALPHA_AURA_COLOR;
            for(let i = 0; i < ALPHA_AURA_AMT; i++){
                const x = pos.x + random() * AURA_RANGE - AURA_RANGE / 2;
                const y = pos.y + random() * AURA_RANGE - AURA_RANGE / 2;
                ctx.fillRect(x - DOT_SIZE/2, y - DOT_SIZE/2, DOT_SIZE, DOT_SIZE);
            }
        }
    }

    /**
     * - Playerを描画します
     * @param {Player} pl 
     */
    static drawPlayer(pl){
        const ctx = this.getContext("object");
        const {img, pos, size} = pl;
        ctx.drawImage(img, pos.x, pos.y, size, size);
    }

    /**
     * アニメーションを描画します.
     * @private @static
     * @param {keyof typeof AnimationDefinitionsEnum} key
     * @param {Position} dest 
     * @param {Object} [aniOptions]
     * @param {number} [aniOptions.cntFrom]
     * @param {number} [aniOptions.scale]
     * @param {number} [aniOptions.speed]
     */
    static drawAnimation(key, dest, aniOptions = {}){
        const aniDef = AnimationDefinitionsEnum[key];
        console.assert(aniDef, `Key of animation definition ("${key}") not found.`);
        const {cntFrom=0, scale=1.0, speed=1.0} = aniOptions;

        const img = new Image();
        img.src = aniDef.src;
        img.onload = () => {
            this._animate(this.getContext("object"), img, dest, aniDef, { x: 0, y: 0 }, cntFrom, scale, speed);
        }
    }

    /**
     * アニメーションをエンキューします.
     * アニメーションは描画時に全て描画されます.
     * @public @static
     * @param {keyof typeof AnimationDefinitionsEnum} key 
     * @param {Position} dest 
     * @param {Object} [aniOptions]
     * @param {number} [aniOptions.cntFrom]
     * @param {number} [aniOptions.scale]
     * @param {number} [aniOptions.speed]
     */
    static enqueueAnimation(key, dest, aniOptions){
        this._animations.enqueue({key, dest, aniOptions});
    }

    /**
     * アニメーションキューの要素を全て取り出して描画します
     * @public @static
     */
    static drawQueuedAnimations(){
        this._animations.items.forEach(({key, dest, aniOptions}) => {
            this.drawAnimation(key, dest, aniOptions);
        });

        this._animations.clear();
    }

    /**
     * @private @static
     * @param {CanvasRenderingContext2D} ctx - 描画に使用するコンテキスト
     * @param {HTMLImageElement} img  - アニメーションの元画像
     * @param {Position} dest - アニメーションのキャンバス上の位置
     * @param {AnimationDefinition} aniDef - アニメーションの定義
     * @param {Position} srcPos - アニメーションの元画像上の位置
     * @param {number} cnt - アニメーションの開始フレーム（0から）
     * @param {number} scale - アニメーションのサイズ倍率（1.0で通常サイズ）
     * @param {number} speed - アニメーションの速度（1.0で通常速度）
     */
    static _animate(ctx, img, dest, aniDef, srcPos, cnt, scale, speed){
        const aniIdx = Math.floor(cnt * speed);
        if(aniIdx >= aniDef.cnt) return;

        const size = { x: aniDef.w * scale, y: aniDef.h * scale };
        srcPos.x = aniDef.w * aniIdx;
        ctx.drawImage(img,
            srcPos.x, srcPos.y, aniDef.w, aniDef.h, // 元画像
            dest.x - size.x/2, dest.y - size.y/2, size.x, size.y // キャンバス
        );

        requestAnimationFrame(() => {
            this._animate(ctx, img, dest, aniDef, srcPos, cnt + 1, scale, speed);
        });
    }

    /**
     * 全ての敵の体力バーを描画します
     * @public @static
     * @param {Character[]} enemies 
     * @param {string} frameColor 
     * @param {string} barColor
     */
    static drawEnemiesHealthBar(enemies, frameColor, barColor){
        enemies.forEach(enemy => {
            const frameCenter = {...enemy.pos};
            frameCenter.y -= enemy.size / 2 * 1.3;
            this.drawBar(
                { center:frameCenter, width: 75, height: 5, margin: 1, color: frameColor },
                { min: 0, max: enemy.max_hp, value: enemy.hp, color: barColor }
            );
        });
    }

    /**
     * プレイヤーの体力バーを描画します
     * @public @static
     * @param {Character} pl 
     * @param {string} frameColor 
     * @param {string} barColor 
     */
    static drawPlayerHealthBar(pl, frameColor, barColor){
        const frameCenter = {...pl.pos};
        frameCenter.y += pl.size / 2 * 1.3;
        this.drawBar(
            { center: frameCenter, width: 200, height: 10, margin: 1, color: frameColor },
            { min: 0, max: pl.max_hp, value: pl.hp, color: barColor }
        );
    }

    /**
     * 与えた数値をもとにRunnableゲージを描画します.
     * @public @static
     * @param {number} runnableCnt ゲージの値
     */
    static drawRunnableBar(runnableCnt){
        const MARGIN = 20;
        const {config: {CANV_W, CANV_H}, skillDefinition: {RUN_FASTER}} = JsonData;
        const frameSize = { width: CANV_W/3, height: 15 };
        const frameCenter = { x: CANV_W - frameSize.width/2 - MARGIN, y: CANV_H - frameSize.height/2 - MARGIN };
        this.drawBar(
            { center: frameCenter, ...frameSize, margin: 3, color: "rgba(6, 0, 114, 0.5)" },
            { min: 0, max: RUN_FASTER.INTERVAL, value: runnableCnt, color: "rgba(88, 199, 194, 0.5)" }
        );
    }

    /**
     * 与えた数値をもとにMagicUsableゲージを描画します.
     * @public @static
     * @param {number} magicUsableCnt ゲージの値
     */
    static drawMagicUsableBar(magicUsableCnt){
        const MARGIN = 20;
        const {config: {CANV_W, CANV_H}, skillDefinition: {MAGIC}} = JsonData;
        const frameSize = { width: CANV_W/3, height: 15 };
        const frameCenter = { x: frameSize.width/2 + MARGIN, y: CANV_H - frameSize.height/2 - MARGIN };
        this.drawBar(
            { center: frameCenter, ...frameSize, margin: 3, color: "rgba(155, 89, 37, 0.5)" },
            { min: 0, max: MAGIC.INTERVAL, value: magicUsableCnt, color: "rgba(255, 136, 136, 0.5)" }
        );
    }

    /**
     * @private @static
     * @param {{center: Position, width: number, height: number, margin: number, color: string}} frame 
     * @param {{min: number, max: number, value: number, color: string}} bar 
     */
    static drawBar(frame, bar){
        const frameBegin = {
            x: frame.center.x - frame.width/2,
            y: frame.center.y - frame.height/2
        };
        const barRate = (bar.value - bar.min) / (bar.max - bar.min);

        this.getContext("ui").fillStyle = frame.color;
        this.getContext("ui").fillRect(frameBegin.x, frameBegin.y, frame.width, frame.height);

        this.getContext("ui").fillStyle = bar.color;
        this.getContext("ui").fillRect(frameBegin.x + frame.margin, frameBegin.y + frame.margin, (frame.width - 2*frame.margin) * barRate, frame.height - 2*frame.margin);
    }

    /**
     * スコアの増減時に表示されるポップアップを動的テキストとしてエンキューします.
     * @public @static
     * @param {number} scoreIncrement スコアの変化量
     * @param {Position} pos ポップアップを表示する最小座標
     */
    static drawScoreUpdatePopup(scoreIncrement, pos){
        if(!scoreIncrement) return;

        const {Pos} = Util;
        const {DURATION, SIZE, RGB_POSITIVE, RGB_NEGATIVE} = JsonData.uiConfig.SCORE_UPDATE_POPUP;
        const isPositive = scoreIncrement >= 0;
        const rgba = isPositive? RGB_POSITIVE : RGB_NEGATIVE;

        this.enqueueDynamicText(DURATION, {
            text: () => `${isPositive? "+" : ""}${scoreIncrement}`,
            rgb: frameCnt => rgba.replace("$a", `${Math.sqrt(- calcTime(frameCnt) + 1)}`),
            px: () => SIZE,
            pos: frameCnt => Pos.move(pos, { diffY: - 75 * Math.sqrt(calcTime(frameCnt)) })
        });

        function calcTime(frameCnt){
            return frameCnt / (DURATION*FPS/1000);
        }
    }
}