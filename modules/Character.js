import {Keyboard, Stage, FPS} from "../modules.js";
/**
 * @typedef {import("../modules").Position} Position
 * @typedef {import("../modules").Direction} Direction
 * @typedef {import("../modules").CharacterTypeId} CharacterTypeId
 */

let idCnt = 0;

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
    /**@type {number} */
    id;
    /**@type {CharacterTypeId} */
    typeId;
    /**@type {number} */
    max_hp;
    /**@type {number} */
    hp;
    /**
     * @constructor
     * @param {CharacterTypeId} typeId
     * @param {string} imgSrc
     * @param {Position} pos
     * @param {number} size
     * @param {number} speed
     * @param {number} max_hp
     */
    constructor(typeId, imgSrc, pos, size, max_hp){
        this.typeId = typeId;
        this.img = new Image();
        this.img.src = imgSrc;
        this.pos = pos;
        this.size = size;
        this.max_hp = max_hp;
        this.hp = max_hp;
        this.id = idCnt;
        idCnt++;
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
     * @param {Position} pos 
     * @returns {Character}
     */
    setPos(pos){
        this.pos = pos;
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

    /**
     * @param {Stage} stage
     * @param {Direction} direction
     */
    move(stage, dire){
        const deltaPos = this.speed / FPS;
        if(dire === "right" && stage.isInside({ x: this.pos.x + deltaPos + this.size/2 })) this.pos.x += deltaPos;
        if(dire === "left" && stage.isInside({ x: this.pos.x - deltaPos - this.size/2 })) this.pos.x -= deltaPos;
        if(dire === "down" && stage.isInside({ y: this.pos.y + deltaPos + this.size/2 })) this.pos.y += deltaPos;
        if(dire === "up" && stage.isInside({ y: this.pos.y - deltaPos - this.size/2 })) this.pos.y -= deltaPos;
    }

    updatePosition(){
        // TODO: player以外の位置更新
    }

    /**
     * hpを操作し、返します
     * @param {(hp: number) => number}
     * @returns {number}
     */
    updateHp(operation){
        this.hp = operation(this.hp);
        return this.hp;
    }
}