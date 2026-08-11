/**
 * @import {SoundDefinition} from "../types/SoundDefinition"
 */

/**
 * 定義済みのSEや音楽を再生します.
 * @class
 */
export default class SoundManager{
    /**
     * 指定したキーの楽曲を再生します
     * @public @static @method
     * @param {keyof typeof SoundDefinitions} key - 定義されたキー
     * @returns {HTMLAudioElement}
     */
    static play(key, pitch = 1.0){
        const {src, volume, loop} = SoundDefinitions[key];
        const audio = new Audio(src);
        audio.loop = loop ?? false;
        audio.volume = volume ?? 1.0;
        audio.playbackRate = pitch;
        audio.play();
        return audio;
    }
};