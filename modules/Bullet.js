/**@module Bullet */
import {Character, FPS, JsonData} from "../modules.js";

/**
 * @typedef {import("../modules").Position} Position
 */

/**
 * - ステージの弾丸
 * @class
 */
export default class Bullet{
    /**@private @type {number} */
    _id;
    /**@private @type {Position} */
    _pos;
    /**@private @type {Position} */
    _speed;
    /**@private@type {number} */
    _dmg;
    /**@private @type {Character} */
    _owner;
    /**@private @type {number} */
    _size;
    /**@private @type {string} */
    _color;

    /**
     * - idのみを設定します.
     * @constructor
     * @param {number} id
     */
    constructor(id){
        this._id = id;
    }

    /**
     * - プールから取得した参照を別のオブジェクトとして使用するために値をセットします.(ただしidは継承します)
     * @param {Position} speed 
     * @param {number} dmg 
     * @param {Character} owner 
     * @param {Position} pos 
     * @param {number} size
     * @returns {Bullet} this
     */
    reset(speed, dmg, owner, pos, size){
        this._speed = speed;
        this._dmg = dmg;
        this._owner = owner;
        this._pos = {...pos};
        this._size = size;
        return this;
    }

    /**
     * - 同一の弾丸であるかをidに基づいて判定します
     * @param {Bullet} src 
     * @returns {boolean}
     */
    isSameWith(src){
        return this.getId() === src.getId();
    }

    /**
     * @param {Position} speed
     * @returns {Bullet}
     */
    setSpeed(speed){
        this._speed = speed;
        return this;
    }

    /**
     * @returns {string}
     */
    getColor(){
        return this._color;
    }

    /**
     * @param {string} color 
     * @returns {Bullet}
     */
    setColor(color){
        this._color = color;
        return this;
    }

    /**
     * - 中央の座標を取得します
     * @returns {Position}
     */
    getCenter(){
        return {
            x: this._pos.x - this._size/2,
            y: this._pos.y - this._size/2
        }
    }

    /**
     * @returns {number}
     */
    getSize(){
        return this._size;
    }

    /**
     * @returns {Position}
     */
    getPos(){
        return this._pos;
    }

    get pos(){
        return this._pos;
    }

    get size(){
        return this._size;
    }

    /**
     * - 弾丸を移動させます
     */
    updatePos(){
        this._pos.x += this._speed.x / FPS;
        this._pos.y += this._speed.y / FPS;
    }

    /**
     * - idを取得します
     * @returns {number}
     */
    getId(){
        return this._id;
    }

    /**
     * - 弾丸の付与ダメージ数を取得します
     * @returns {number}
     */
    getDmg(){
        return this._dmg;
    }

    /**
     * - 弾丸の発射源を取得します
     * @returns {Character}
     */
    getOwner(){
        return this._owner;
    }
}