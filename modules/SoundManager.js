/**
 * @import {SoundDefinition} from "../types/SoundDefinition"
 */

import {Enum} from "../modules";

const {SoundDefinitions} = Enum;

/**
 * 定義済みのSEや音楽を再生します.
 * @class
 */
export default class SoundManager{
    /**
     * 指定したキーの楽曲を再生します
     * @public @static @async @method
     * @param {number} id - 定義されたキー
     * @param {number} [pitch=1.0] - 再生速度
     * @returns {Promise<HTMLAudioElement>}
     */
    static async play(id, pitch = 1.0){
        const {src, volume, loop} = SoundDefinitions[id];
        const audio = new Audio(src);
        audio.loop = loop ?? false;
        audio.volume = volume ?? 1.0;
        audio.playbackRate = pitch;
        await audio.play();
        return audio;
    }
};