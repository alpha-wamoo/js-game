export namespace StructMemberOffsetEnums{

    export type Player = {
        ID: number,
        SIZE: number,
        MAX_HP: number,
        HIT_DMG: number,
        BULLET_DMG: number,
        REWARD_SCORE: number,
        IS_VALID: number,
        IS_ALPHA: number,
        POS: number,
        SPEED: number,
        BULLET_SHOOTABLE_CNT: number,
        HP: number,
        RANDOMS: number,
        IMG_SRC: number,
        MOTION_KEY: number,
        TYPE_ID: number
    };

    export type Enemy = {
        ID: number,
        SIZE: number,
        MAX_HP: number,
        HIT_DMG: number,
        BULLET_DMG: number,
        REWARD_SCORE: number,
        IS_VALID: number,
        IS_ALPHA: number,
        POS: number,
        SPEED: number,
        BULLET_SHOOTABLE_CNT: number,
        HP: number,
        RANDOMS: number,
        IMG_SRC: number,
        MOTION_KEY: number,
        TYPE_ID: number
    };

    export type Bullet = {
        ID: number,
        OWNER_ID: number,
        DMG: number,
        SIZE: number,
        IS_VALID: number,
        POS: number,
        VEL: number,
        COLOR: number
    };
}