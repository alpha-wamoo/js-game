import {C, Enum} from "../modules.js";
/**@module Keyboard */

const {KeyMasks, KeyIdxs} = Enum;

/**
 * - キーボード入力を管理します
 */
export default class Keyboard{
    /**@public @static @type {number} */
    static N_KEYS = Object.keys(KeyMasks).length;
    /**@private @static @type {Uint16Array<ArrayBuffer>} */
    static _keyPressedCnts = new Uint16Array(Keyboard.N_KEYS);
    /**@private @static @type {number} */
    static _keyPressedCntsPtr = null;
    /**@public @static @type {number} */
    static keyStateFlag = 0b0;

    /**
     * - 初期化します
     * @public @static @method
     * @deprecated
     */
    static init(){
        const keys = Object.keys(KeyIdxs);
        for(let i = 0; i < Keyboard.N_KEYS; i++) KeyIdxs[keys[i]] = i;
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
     * @param {number} keyIdx 時間を取得したいキーのインデックス
     * @returns {number}
     */
    static getPressedCnt(keyIdx){
        return Keyboard._keyPressedCnts[keyIdx] ?? 0;
    }

    /**
     * - キーが押されているかを判定します
     * @public @static @method
     * @param {number} keyMask 判定したいキーのマスク(bit orによる複数同時判定も可能)
     * @returns {boolean} 押されていればtrue.
     */
    static isPressedAny(keyMask){
        return Keyboard.keyStateFlag & keyMask !== 0;
    }

    /**
     * - 複数のキーが全て押されているかを判定します
     * @public @static @method
     * @param  {number} keyMask 判定したいキーのマスク(bit orによる複数同時判定も可能)
     * @returns {boolean} 全て押されていればtrue
     */
    static isPressedAll(keyMask){
        return Keyboard.keyStateFlag & keyMask === keyMask;
    }

    /**
     * - キーが押されたときに実行します
     * @public @method
     * @param {KeyboardEvent} ev 
     */
    static keydown(ev){
        const keyStr = ev.key.toLowerCase();
        ev.preventDefault();
        const keyIdx = KeyIdxs[keyStr];
        Keyboard._keyPressedCnts[keyIdx] += 1;
        Keyboard.keyStateFlag |= KeyMasks[keyIdx]; // trueにする
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
        const keyIdx = KeyIdxs[keyStr];
        Keyboard._keyPressedCnts[keyIdx] = 0;
        Keyboard.keyStateFlag &= ~KeyMasks[keyIdx]; // falseにする
        // console.log(`up: ${key}`);
    }

    /**
     * - キー情報をクリアします
     * @public @static @method
     */
    static clear(){
        const {N_KEYS} = Keyboard;
        for(let i = 0; i < N_KEYS; i++) Keyboard._keyPressedCnts[i] = 0;
        Keyboard.keyStateFlag = 0b0;
    }
}