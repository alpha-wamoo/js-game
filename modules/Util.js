/**@module Util */
/**
 * @import {Character, Bullet, Position} from "../modules.js";
 */

/**
 * - ユーティリティメソッドを呼び出します.
 */
export default {
    /**
     * - 待機します
     *
     * @param {number} ms 
     * @returns {Promise<void>}
     */
    sleep(ms){
        return new Promise((resolve) => setTimeout(resolve, ms));
    },

    /**
     * - 指定範囲内で乱数を生成します
     * @param {number} min
     * @param {number} max
     */
    randInRange(min, max){
        return Math.random() * (max - min) + min;
    },

    /**
     * - ある確率でtrueを返します
     * @param {number} p 確率
     * @returns {boolean}
     */
    chance(p){
        return Math.random() < p;
    }

    GameObj: {
        /**
         * @param {"x" | "y"} axis 
         * @param {Character | Bullet}
         * @returns {{min: number, max:number}}
         */
        getRange(axis, {pos, size}){
            return { min: pos[axis] - size/2, max: pos[axis] + size/2 };
        },

        /**
         * - 当たっていることを判定します
         * @param {Character | Bullet} a 
         * @param {Character | Bullet} b
         * @returns {boolean}
         */
        isHittingTo(a, b){
            //x
            const ax = this.getRange("x", a), bx = this.getRange("x", b);
            const isHittingX = ax.min < bx.max && ax.max > bx.min;
            //y
            const ay = this.getRange("y", a), by = this.getRange("y", b);
            const isHittingY = ay.min < by.max && ay.max > by.min;

            return isHittingX && isHittingY;
        }
    },

    /**
     * - 二点の平均を求めます
     * @deprecated
     * @param {Position} a 
     * @param {Position} b 
     * @returns {Position}
     */
    averagePos(a, b){
        return {
            x: (a.x + b.x)/2,
            y: (a.y + b.y)/2
        };
    },

    /**
     * - 二点の合計を求めます
     * @deprecated
     * @param {Position} a 
     * @param {Position} b 
     * @returns {Position}
     */
    addPos(a, b){
        return {
            x: a.x + b.x,
            y: a.y + b.y
        };
    },

    /**
     * - 座標の絶対値を求めます
     * @deprecated
     * @param {Position} pos 
     * @returns {number}
     */
    posSize(pos){
        return Math.sqrt(pos.x * pos.x + pos.y * pos.y);
    },

    /**
     * @deprecated
     * @param {number} num 
     * @param {Position} pos 
     * @returns 
     */
    mulPos(num, pos){
        return {
            x: pos.x * num,
            y: pos.y * num
        }
    },

    /**
     * @deprecated
     * @param {Position} pos 
     * @param {(value: number) => } mapFn 
     * @returns 
     */
    mapPos(pos, mapFn){
        return {
            x: mapFn(pos.x),
            y: mapFn(pos.y)
        };
    },

    /**
     * - 座標操作に関するオブジェクト
     */
    Pos: {
        /**
         * @param {Position} pos - 写像される座標です
         * @param {(val: number, axis: "x" | "y") => number} mapFn - x, yの更新を行います
         * @returns {Position}
         */
        map(pos, mapFn){
            return {
                x: mapFn(pos?.x ?? 0, "x"),
                y: mapFn(pos?.y ?? 0, "y")
            };
        },

        /**
         * - 座標同士を加算します
         * @param {Position} pos1 
         * @param {Position} pos2 
         * @returns {Position}
         */
        add(pos1, pos2){
            return {
                x: (pos1.x ?? 0) + (pos2.x ?? 0),
                y: (pos1.y ?? 0) + (pos2.y ?? 0)
            };
        },

        /**
         * - スカラー倍します
         * @param {number} scalar 
         * @param {Position} pos 
         * @returns {Position}
         */
        scale(scalar, pos){
            return {
                x: (pos.x ?? 0) * factor,
                y: (pos.y ?? 0) * factor
            };
        },

        /**
         * - 領域の中点と大きさから、最小座標（左上）を求めます
         * @param {Position} centerPos 
         * @param {Position} size 
         * @returns {Position}
         */
        centerToMin(centerPos, size){
            return {
                x: centerPos.x - size.x/2,
                y: centerPos.y - size.y/2
            };
        },

        /**
         * - 領域の最小座標（左上）と大きさから、中点を求めます
         * @param {Position} minPos 
         * @param {Position} size 
         * @returns {Position}
         */
        minToCenter(minPos, size){
            return {
                x: minPos.x + size.x/2,
                y: minPos.y + size.y/2
            };
        },

        /**
         * - 指定した軸方向の成分以外は0で初期化された座標を返します.
         * @param {"x" | "y"} axis 軸
         * @param {number} value 
         */
        elem(axis, value){
            if(axis !== "x" && axis !== "y") throw new Error("axis should be x or y.");
            const retPos = {x: 0, y: 0};
            retPos[axis] = value;
            return retPos;
        },

        /**
         * - (非破壊) 差分に従って移動した座標を返します
         * @param {Position} pos 移動させる座標
         * @param {{diffX: number, diffY: number}} param1 
         * @returns {Position}
         */
        move(pos, {diffX = 0, diffY = 0}){
            const copiedPos = {...pos};
            copiedPos.x += diffX;
            copiedPos.y += diffY;
            return copiedPos;
        },

        /**
         * - 二点の平均を求めます
         * @param {Position} a 
         * @param {Position} b 
         * @returns {Position}
         */
        ave(a, b){
            return {
                x: (a.x + b.x)/2,
                y: (a.y + b.y)/2
            };
        }
    },

    /**
     * - pt（ポイント）をpx（ピクセル）に変換
     * @param {number} pt - ポイント値
     * @param {number} [dpi=96] - ディスプレイのDPI（省略時は96）
     * @returns {number} ピクセル値
     */
    ptToPx(pt, dpi = 96) {
        return pt * (dpi / 72);
    }
}