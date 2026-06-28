import {C} from "../modules.js";
/**@module Keyboard */


/**
 * - キーボード入力を管理します
 */
export default class Keyboard{
    /**@private @static @type {{[key: string]: number}} */
    static _KEY_IDX = {
        "w": null,
        "a": null,
        "s": null,
        "d": null,
        "shift": null,
        " ": null,
        "enter": null
    };
    /**@public @static @type {number} */
    static KEY_NUMBERS = Object.keys(Keyboard._KEY_IDX).length;
    /**@private @static @type {Uint16Array<ArrayBuffer>} */
    static _keyPressedCnts = new Uint16Array(Keyboard.KEY_NUMBERS);
    /**@private @static @type {number} */
    static _keyPressedCntsPtr = null;

    /**
     * - 初期化します
     * @public @static @method
     */
    static init(){
        for(let i = 0; i < Keyboard.KEY_NUMBERS; i++) Keyboard._KEY_IDX[i] = i;
        Keyboard._keyPressedCntsPtr = C.module._malloc(Keyboard.KEY_NUMBERS * 2);
    }

    /**
     * - CモジュールのKeyboardを更新します
     * @public @static @method
     */
    static updateC(){
        // const gameContextPtr = cmodule._getGameContextPtr();
        C.module.HEAPU16.set(Keyboard._keyPressedCnts, Keyboard._keyPressedCntsPtr >> 1);
        C.keyboard_update(C.gameContextPtr, Keyboard._keyPressedCntsPtr, Keyboard.KEY_NUMBERS);
    }

    /**
     * - あるキーが押された時間の長さを保持します(ms)
     * @public @static @method
     * @param {string} key 時間を取得したいキー
     * @returns {number}
     */
    static getPressedCnt(key){
        return Keyboard._keyPressedCnts[Keyboard._KEY_IDX[key]] ?? 0;
    }

    /**
     * - キーが押されているかを判定します
     * @public @static @method
     * @param {string} key 判定したいキー
     * @returns {boolean} 推されていればtrue.
     */
    static isPressed(key){
        const cnt = Keyboard._keyPressedCnts[Keyboard._KEY_IDX[key]] ?? 0;
        return cnt >= 1;
    }

    /**
     * - 与えられたキーが全て押されているかを判定します
     * @public @method
     * @param  {string[]} keys 判定対象のキー
     * @returns {boolean} 全て押されていればtrue.
     */
    static isAllPressed(...keys){
        return keys.every(key => Keyboard.isPressed(key));
    }

    /**
     * - キーが押されたときに実行します
     * @public @method
     * @param {KeyboardEvent} ev 
     */
    static keydown(ev){
        ev.preventDefault();
        Keyboard._keyPressedCnts[Keyboard._KEY_IDX[ev.key.toLowerCase()]] += 1;
        // console.log(`down: ${key}`);
    }

    /**
     * - キーから離されたときに実行します
     * @public @method
     * @param {KeyboardEvent} ev
     */
    static keyup(ev){
        ev.preventDefault();
        Keyboard._keyPressedCnts[Keyboard._KEY_IDX[ev.key.toLowerCase()]] = 0;
        // console.log(`up: ${key}`);
    }

    /**
     * - キー情報をクリアします
     * @public @static @method
     */
    static clear(){
        for(let i = 0; i < Keyboard.KEY_NUMBERS; i++) Keyboard._keyPressedCnts[i] = 0;
    }
}