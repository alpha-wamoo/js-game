/**
 * @import {SoundDefinition} from "../types/SoundDefinition"
 */

/**
 * - Enumを提供します
 */
export default Object.freeze({
    EnemyTypeId: Object.freeze({
        BASIC: 0,
        TOUGH: 1,
        SMALL: 2,
        TRICKY: 3
    }),
    EnemyMotionId: Object.freeze({
        SIMPLY_DOWN: 0,
        SIN: 1,
        H_PARABOLA: 2,
        CYCLIC: 3
    }),
    DirectionMask: Object.freeze({
        RIGHT: 1 << 0,
        LEFT: 1 << 1,
        DOWN: 1 << 2,
        UP: 1 << 3
    }),
    PlayerHealOptionMask: Object.freeze({
        IGNORE_MAX: 1 << 0,
        ALLOW_SOUND: 1 << 1,
        ALLOW_ANIMATION: 1 << 2
    }),
    DamageOptionMask: Object.freeze({
        ALLOW_SOUND: 1 << 0
    }),
    SoundId: Object.freeze({
        // SE
        START: 0,
        SHOOT: 1,
        HIT: 2,
        RUN_FAST: 3,
        HEAL: 4,
        ICE: 5,
        GRAVITY: 6,
        // BGM
        BATTLE_BGM_DEFAULT: 7
    }),
    /**@type {Readonly<SoundDefinition[]>} */
    SoundDefinitions: Object.freeze([
        // SE
        {
            src: "./sounds/slash-sword.mp3"
        },
        {
            src: "./sounds/magic-flame.mp3",
            volume: 0.2
        },
        {
            src: "./sounds/hit-robot.mp3",
            volume: 0.5
        },
        {
            src: "./sounds/run-fast.mp3",
            volume: 0.65
        },
        {
            src: "./sounds/sacred-magic.mp3",
            volume: 0.75
        },
        {
            src: "./sounds/ice-magic.mp3",
            volume: 0.45
        },
        {
            src: "./sounds/gravity-magic.mp3",
            volume: 0.8
        },
        // BGM
        {
            src: "./sounds/battle-queen.wav",
            volume: 0.2,
            loop: true
        }
    ]),
    KeyMasks = Object.freeze([
        1 << 0,
        1 << 1,
        1 << 2,
        1 << 3,
        1 << 4,
        1 << 5,
        1 << 6
    ]),
    KeyIdxs = Object.freeze({
        "w": 0,
        "a": 1,
        "s": 2,
        "d": 3,
        "shift": 4,
        " ": 5,
        "enter": 6
    })
});