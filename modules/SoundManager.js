/**@module SoundManager */

/**
 * @typedef SoundDefinition
 * @property {string} src - 音声ファイルのパス
 * @property {number?} volume - 0-1 
 * @property {boolean?} loop - 楽曲をループするか
 */

/**@enum {SoundDefinition} */
const SoundDefinitions = /**@type {const}*/{
    // SE
    "start": {
        src: "./sounds/slash-sword.mp3"
    },
    "shoot": {
        src: "./sounds/magic-flame.mp3",
        volume: 0.2
    },
    "hit": {
        src: "./sounds/hit-robot.mp3",
        volume: 0.5
    },
    "run_fast": {
        src: "./sounds/run-fast.mp3",
        volume: 0.65
    },
    "heal": {
        src: "./sounds/sacred-magic.mp3",
        volume: 0.75
    },
    "ice": {
        src: "./sounds/ice-magic.mp3",
        volume: 0.45
    },
    "gravity": {
        src: "./sounds/gravity-magic.mp3",
        volume: 0.8
    },
    // BGM
    "battle_bgm_default": {
        src: "./sounds/battle-queen.wav",
        volume: 0.2,
        loop: true
    }
};

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