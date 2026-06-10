import {} from "../modules.js";
/**
 * @typedef {import("../modules").Position} Position
 */

export default class Bullet{
    /**@type {Position} */
    _pos;
    /**@type {Position} */
    _speed;
    /**@type {number} */
    _dmg;

    /**
     * @param {Position} pos 
     */
    constructor(pos, speed, dmg){
        this._pos = pos;
        this._speed = speed;
        this._dmg = dmg;
    }

    /**
     * @param {Position} speed
     * @returns {Bullet}
     */
    setSpeed(speed){
        this._speed = speed;
        return this;
    }
}