/**@module Keyboard */


/**
 * - キーボード入力を管理します
 */
export default class Keyboard{
    /**@private @type {Map<string, number>} */
    static _keysCntMap = new Map();

    /**
     * イベントデータから、押されたキーを表す文字列を取得します
     * @private @method
     * @param {KeyboardEvent} ev 
     * @returns {string}
     */
    static _getKey(ev){
        return ev.key.toLowerCase();
    }

    /**
     * あるキーが押された時間の長さを保持します(ms)
     * @public @method
     * @param {string} key 時間を取得したいキー
     * @returns {number}
     */
    static getPressedCnt(key){
        return Keyboard._keysCntMap.get(key) ?? 0;
    }

    /**
     * キーが押されているかを判定します
     * @public @method
     * @param {string} key 判定したいキー
     * @returns {boolean} 推されていればtrue.
     */
    static isPressed(key){
        return Keyboard.getPressedCnt(key) >= 1;
    }

    /**
     * 与えられたキーが全て押されているかを判定します
     * @public @method
     * @param  {string[]} keys 判定対象のキー
     * @returns {boolean} 全て押されていればtrue.
     */
    static isAllPressed(...keys){
        return keys.every(key => Keyboard.isPressed(key));
    }

    /**
     * キーが押されたときに実行します
     * @public @method
     * @param {KeyboardEvent} ev 
     */
    static keydown(ev){
        ev.preventDefault();
        // ev.stopPropagation();
        const key = Keyboard._getKey(ev);
        const prevValue = Keyboard._keysCntMap.get(key) ?? 0;
        this._keysCntMap.set(key, prevValue + 1);
        // console.log(`down: ${key}`);
    }

    /**
     * キーから離されたときに実行します
     * @public @method
     * @param {KeyboardEvent} ev
     */
    static keyup(ev){
        ev.preventDefault();
        // ev.stopPropagation();
        const key = Keyboard._getKey(ev);
        Keyboard._keysCntMap.delete(key);
        // console.log(`up: ${key}`);
    }

    static clear(){
        Keyboard._keysCntMap.clear();
    }
}