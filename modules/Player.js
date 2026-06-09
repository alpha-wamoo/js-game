/**
 * @typedef {{x, y}} Position
 */

/**
 * @class
 */
export default class Player{
    /**
     * @constructor
     * @param {Position} pos 
     */
    constructor(pos){
        /**@type {Position}*/
        this.pos = pos;
    }

    /**
     * @param {string} src 
     * @param {number?} width 
     * @param {number?} height 
     */
    setImage(src, width, height){
        this.img = new Image(width, height);
        this.img.src = src;
        return this;
    }
}