import {Keyboard, Stage, CANV_SIZE, Character} from "../modules.js";

class Game{
    /**@type {HTMLCanvasElement | null} */
    _canv;
    /**@type {CanvasRenderingContext2D | null} */
    _ctx;
    /**@type {Stage} */
    _stage;
    /**@type {Character} */
    _pl;
    /**@type {number} */
    _score = 0;

    /**
     * @constructor
     * @param {HTMLCanvasElement} canv 
     * @param {Stage} stage
     */
    constructor(canv, stage){
        this._canv = canv;
        this._ctx = canv.getContext("2d");
        this._stage = stage;

        const PL_SIZE = CANV_SIZE/8, PL_SPEED = CANV_SIZE/4, PL_IMG_SRC = "./dalmatian.png";
        this._pl = stage.spawnChr("player", PL_IMG_SRC, { x: 100, y: 400 }, PL_SIZE, PL_SPEED);
    }

    /**
     * ゲームを開始します
     */
    start(){
        document.onkeydown = Keyboard.keydown;
        document.onkeyup = Keyboard.keyup;

        new Audio("../sounds/slash-sword.mp3").play();
        this.mainLoop();
    }

    /**
     * 毎フレーム実行されます
     */
    mainLoop(){
        this._score++;
        this.update();
        this.draw();

        requestAnimationFrame(this.mainLoop.bind(this));
    }

    /**
     * 描画情報を更新します
     */
    update(){
        if(Keyboard.keysPressed.d) this._pl.move(this._stage, "right");
        if(Keyboard.keysPressed.a) this._pl.move(this._stage, "left");
        if(Keyboard.keysPressed.w) this._pl.move(this._stage, "up");
        if(Keyboard.keysPressed.s) this._pl.move(this._stage, "down");
    }

    draw(){
        // rectangle
        this._ctx.fillStyle = "rgb(0, 0, 0)";
        this._ctx.fillRect(0, 0, CANV_SIZE, CANV_SIZE);

        // score
        this._ctx.fillStyle = "rgb(255, 255, 255)";
        this._ctx.font = "16pt Arial";
        const scoreLabel = `Score : ${this._score}`;
        this._ctx.fillText(scoreLabel, CANV_SIZE - this._ctx.measureText(scoreLabel).width - 40, 40);

        // characters
        this._stage.getChrs().forEach(chr => {
            const center = chr.getCenter();
            this._ctx.drawImage(chr.img, center.x, center.y, chr.size, chr.size);
        });
    }
}

export default Game;