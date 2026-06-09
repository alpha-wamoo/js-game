import Keyboard from "./Keyboard.js";
/**
 * @typedef {{x, y}} Position
 */

/**
 * @class
 */
export default class Character{
    /**@type {HTMLImageElement} */
    img;
    /**@type {Position} */
    pos;
    /**@type {number} */
    speed;
    /**@type {number} */
    size;
    /**
     * @constructor
     * @param {Position} pos 
     */
    constructor(src, pos, size){
        this.img = new Image();
        this.img.src = src;
        this.pos = pos;
        this.size = size;
    }

    /**
     * @param {string} src
     * @returns {Character}
     */
    setImage(src){
        this.img = new Image();
        this.img.src = src;
        return this;
    }

    /**
     * @param {number} speed
     * @returns {Character}
     */
    setSpeed(speed){
        this.speed = speed;
        return this;
    }

    /**
     * @param {number} size
     * @returns {Character}
     */
    setSize(size){
        this.size = size;
        return this;
    }

    /**
     * 中央の座標を返します.
     * @returns {Position}
     */
    getCenter(){
        return {
            x: this.pos.x - this.size/2,
            y: this.pos.y - this.size/2
        };
    }

    updatePosition(){
        // TODO: player以外の位置更新
    }
}