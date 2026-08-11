import {C} from "../modules.js";
/**@module Keyboard */


/**
 * - キーボード入力を管理します
 */
export default class Keyboard{
    static KeyFlagMasks = Object.freeze({
        "w": 1 << 0,
        "a": 1 << 1,
        "s": 1 << 2,
        "d": 1 << 3,
        "shift": 1 << 4,
        " ": 1 << 5,
        "enter": 1 << 6
    });
    /**
     * - 値はinitで自動設定
     * @private @static @type {{[key: string]: number}}
     */
    static _KEY_IDX = {
        "w": 0,
        "a": 1,
        "s": 2,
        "d": 3,
        "shift": 4,
        " ": 5,
        "enter": 6
    };
    /**@public @static @type {number} */
    static N_KEYS = Object.keys(Keyboard.KeyFlagMasks).length;
    /**@private @static @type {Uint16Array<ArrayBuffer>} */
    static _keyPressedCnts = new Uint16Array(Keyboard.N_KEYS);
    /**@private @static @type {number} */
    static _keyPressedCntsPtr = null;
    /**@public @static @type {number} */
    static keyFlagBit = 0b0;

    /**
     * - 初期化します
     * @public @static @method
     */
    static init(){
        const keys = Object.keys(Keyboard._KEY_IDX);
        for(let i = 0; i < Keyboard.N_KEYS; i++) Keyboard._KEY_IDX[keys[i]] = i;
        Keyboard._keyPressedCntsPtr = C.module._malloc(Keyboard.N_KEYS * 2);
    }

    /**
     * - CモジュールのKeyboardを更新します
     * @public @static @method
     */
    static updateC(){
        // const gameContextPtr = cmodule._getGameContextPtr();
        C.module.HEAPU16.set(Keyboard._keyPressedCnts, Keyboard._keyPressedCntsPtr >> 1);
        C.keyboard_update(C.gameContextPtr, Keyboard._keyPressedCntsPtr, Keyboard.N_KEYS);
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
     * @param {keyof typeof Keyboard.KeyFlagMasks} key 判定したいキー(小文字)
     * @returns {boolean} 推されていればtrue.
     */
    static isPressed(key){
        return Keyboard.keyFlagBit & Keyboard.KeyFlagMasks[key] !== 0;
    }

    /**
     * - 与えられたキーが全て押されているかを判定します
     * @public @method
     * @param  {string[]} keys 判定対象のキー
     * @returns {boolean} 全て押されていればtrue.
     */
    static isAllPressed(...keys){
        let keysMask = 0b0;
        for(const key of keys) keysMask |= Keyboard.KeyFlagMasks[key];
        return (Keyboard.keyFlagBit & keysMask) === keysMask;
    }

    /**
     * - キーが押されたときに実行します
     * @public @method
     * @param {KeyboardEvent} ev 
     */
    static keydown(ev){
        const keyStr = ev.key.toLowerCase();
        ev.preventDefault();
        Keyboard._keyPressedCnts[Keyboard._KEY_IDX[keyStr]] += 1;
        Keyboard.keyFlagBit |= Keyboard.KeyFlagMasks[keyStr];
        // console.log(`down: ${key}`);
    }

    /**
     * - キーから離されたときに実行します
     * @public @method
     * @param {KeyboardEvent} ev
     */
    static keyup(ev){
        const keyStr = ev.key.toLowerCase();
        ev.preventDefault();
        Keyboard._keyPressedCnts[Keyboard._KEY_IDX[keyStr]] = 0;
        Keyboard.keyFlagBit &= ~Keyboard.KeyFlagMasks[keyStr];
        // console.log(`up: ${key}`);
    }

    /**
     * - キー情報をクリアします
     * @public @static @method
     */
    static clear(){
        for(let i = 0; i < Keyboard.N_KEYS; i++) Keyboard._keyPressedCnts[i] = 0;
        Keyboard.keyFlagBit = 0b0;
    }
}