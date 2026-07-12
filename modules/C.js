/**
 * @import {CModule} from "../types/CModule"
 * @import {CFunctionCallerType} from "../types/CFunctionCaller"
 * @import {SingleStructViewBaseType} from "../types/SingleStructViewBase"
 * @import {StructMemberOffsetEnums} from "../types/StructMemberOffsetEnums"
 */

/**
 * @class
 */
export default class C{
    /**@private @static @type {ArrayBuffer?} */
    static _mem = null;
    /**@private @static @type {DataView?} */
    static _memView = null;
    /**@public @static @type {CModule?} */
    static cmodule = null;
    /**@public @static @type {CFunctionCallerType} */
    static caller = new CFunctionCaller();
    /**@public @static @type {number?} */
    static gameContextPtr = null;
    /**
     * cモジュールのポインタやviewを初期化します
     * @public @static @method
     * @param {CModule} cmodule - cモジュール
    */
    static init(cmodule){
        C.cmodule = cmodule;
        C._mem = cmodule.HEAP8.buffer;
        C._memView = new DataView(C._mem);
        C.caller.init(cmodule);
        C.gameContextPtr = C.caller.getGameContextPtr();

        // 構造体ビューの初期化
        C.plView.init(cmodule, C._memView, C.caller.player_getPtr(C.gameContextPtr), C.caller.player_getMemberOffsetsPtr());
        C.enView.init(cmodule, C._memView, C.caller.enemy_getPtr(C.gameContextPtr), C.caller.enemy_getMemberOffsetsPtr(), C.caller.enemy_getStructSize());
        C.bltView.init(cmodule, C._memView, C.caller.bullet_getPtr(C.gameContextPtr), C.caller.bullet_getMemberOffsetsPtr(), C.caller.bullet_getStructSize());

        C.plView.getFloat32()
        C.plView.getFloat32()
        C.plView._OFFSETS
    }

    /**@public @static @readonly @method */
    static get mem(){
        return C._mem;
    }

    /**
     * - Cモジュールのプレイヤー情報を読み取ります.
     * @public @static @class
     */
    static plView = new PlayerView();

    /**
     * - Cモジュールの敵情報を読み取ります.
     * @public @static @class
     */
    static enView = new EnemiesView();

    /**
     * - Cモジュールの弾情報を読み取ります.
     * @public @static @class
     */
    static bltView = new BulletsView();
};

/**
 * - cモジュールから取得された関数を保持します.
 * @class
 * @implements {CFunctionCallerType}
 */
class CFunctionCaller extends CFunctionCallerType{
    static C_FUNCTIONS = {
		"initGameContext": ["initGameContext", "boolean", ["string", "string", "string", "string"]],
        "getGameContextPtr": ["getGameContextPtr", "number", []],
		"keyboard_update": ["keyboard_update", null, ["number", "number", "number"]],
        "player_getPtr": ["player_getPtr", "number", ["number"]],
        "player_getMemberOffsetsPtr": ["player_getMemberOffsetsPtr", "number", []],
        "enemy_getPtr": ["enemy_getPtr", "number", ["number"]],
        "enemy_getMemberOffsetsPtr": ["enemy_getMemberOffsetsPtr", "number", []],
        "enemy_getStructSize": ["enemy_getStructSize", "number", []],
        "bullet_getPtr": ["bullet_getPtr", "number", ["number"]],
        "bullet_getMemberOffsetsPtr": ["bullet_getMemberOffsetsPtr", "number", []],
        "bullet_getStructSize": ["bullet_getStructSize", "number", []]
	};

    init(/**@type {CModule}*/cmodule){
        for(const [fnName, args] of Object.entries(CFunctionCaller.C_FUNCTIONS)){
            this[fnName] = cmodule.cwrap(...args);
        }
    }
}

/**
 * - CモジュールのPlayerデータにアクセスします
 * @class
 * @implements {SingleStructViewBaseType<StructMemberOffsetEnums.Player>}
 */
class PlayerView extends SingleStructViewBase{
    /**@enum {number} */
    _OFFSETS = {
        ID: 0,
        SIZE: 1,
        BULLET_DMG: 2,
        MAX_HP: 3,
        SPEED: 4,
        IS_VALID: 5,
        IS_ENPOWERED: 6,
        BULLET_SHOOTABLE_CNT: 7,
        RUNNABLE_CNT: 8,
        MAGIC_USABLE_CNT: 9,
        UNBEATABLE_TIME: 10,
        UNBEATABLE_CNT: 11,
        HP: 12,
        POS: 13
    };

    constructor(){
        super();
    }
};

/**
 * - Enemiesデータにアクセスします
 * @class
 * @implements {ArrayStructViewBase}
 */
class EnemiesView extends ArrayStructViewBase{
    _OFFSETS = {
        ID: 0,
        SIZE: 1,
        MAX_HP: 2,
        HIT_DMG: 3,
        BULLET_DMG: 4,
        REWARD_SCORE: 5,
        IS_VALID: 6,
        IS_ALPHA: 7,
        POS: 8,
        SPEED: 9,
        BULLET_SHOOTABLE_CNT: 10,
        HP: 11,
        RANDOMS: 12,
        IMG_SRC: 13,
        MOTION_KEY: 14,
        TYPE_ID: 15
    };
}

/**
 * - Bulletsデータにアクセスします
 * @class
 * @implements {ArrayStructViewBase}
 */
class BulletsView extends ArrayStructViewBase{
    _OFFSETS = {
        ID: 0,
        OWNER_ID: 1,
        DMG: 2,
        SIZE: 3,
        IS_VALID: 4,
        POS: 5,
        VEL: 6,
        COLOR: 7,
    };
}

/**
 * @class
 * @template OffsetsEnum
 * @implements {SingleStructViewBaseType<OffsetsEnum>}
 */
class SingleStructViewBase extends SingleStructViewBaseType{
    /**@type {OffsetsEnum} */
    _OFFSETS = {};

    constructor(){
        super();
    }

    /**
     * - Viewとオフセットを初期化します
     * @public @method
     * @param {CModule} cmodule - cモジュール
     * @param {DataView} view - DataView
     * @param {number} ptr - ポインタ
     * @param {number} offsetsPtr - メンバのオフセット配列ポインタ
     */
    init(cmodule, view, ptr, offsetsPtr){
        this._cmodule = cmodule;
        this._view = view;
        this._ptr = ptr;
        this._offsetsPtr = offsetsPtr;

        // 各メンバのオフセットを取得して保持する
        for(let i = 0, keys = Object.keys(this._OFFSETS); i < keys.length; i++){
            this._OFFSETS[keys[i]] = this._cmodule.HEAP32[(offsetsPtr >> 2) + i];
        }
    }

    
    getFloat32(/**@type {keyof typeof this._OFFSETS}*/propName){
        return this._view.getFloat32(this._ptr + this._OFFSETS[propName], true);
    }

    getInt32(/**@type {keyof typeof this._OFFSETS}*/propName){
        return this._view.getInt32(this._ptr + this._OFFSETS[propName], true);
    }

    getUint8(/**@type {keyof typeof this._OFFSETS}*/propName){
        return this._view.getUint8(this._ptr + this._OFFSETS[propName], true);
    }

    getUint16(/**@type {keyof typeof this._OFFSETS}*/propName){
        return this._view.getUint16(this._ptr + this._OFFSETS[propName], true);
    }

    getVec2(/**@type {keyof typeof this._OFFSETS}*/propName){
        return {
            x: this._view.getFloat32(this._ptr + this._OFFSETS[propName], true),
            y: this._view.getFloat32(this._ptr + this._OFFSETS[propName] + 4, true)
        };
    }
}

class ArrayStructViewBase{
    /**@private @type {CModule} */
    _cmodule;
    /**@private @type {DataView?} */
    _view;
    /**@private @type {number?} */
    _ptr;
    /**@private @type {number?} */
    _offsetsPtr;
    /**@private @type {number?} */
    _structSize;
    /**
     * - Cモジュールの構造体メンバのオフセットを初期化後に保持します
     * @private @enum {number}
     */
    _OFFSETS = {};

    /**
     * @constructor
     */
    constructor(){
        super();
    }

    /**
     * - Viewとオフセットを初期化します
     * @public @method
     * @param {CModule} cmodule - cモジュール
     * @param {DataView} view - DataView
     * @param {number} ptr - ポインタ
     * @param {number} offsetsPtr - メンバのオフセット配列ポインタ
     * @param {number} structSize - 構造体のサイズ
     */
    init(cmodule, view, ptr, offsetsPtr, structSize){
        this._cmodule = cmodule;
        this._view = view;
        this._ptr = ptr;
        this._offsetsPtr = offsetsPtr;
        this._structSize = structSize;

        // 各メンバのオフセットを取得して保持する
        for(let i = 0, keys = Object.keys(this._OFFSETS); i < keys.length; i++){
            this._OFFSETS[keys[i]] = this._cmodule.HEAP32[(offsetsPtr >> 2) + i];
        }
    }

    /**
     * @public @method
     * @param {keyof typeof this._OFFSETS} propName 
     * @returns {number} float32
     */
    getFloat32(propName){
        return this._view.getFloat32(this._ptr + this._OFFSETS[propName], true);
    }

    /**
     * @public @method
     * @param {keyof typeof this._OFFSETS} propName 
     * @returns int32
     */
    getInt32(propName){
        return this._view.getInt32(this._ptr + this._OFFSETS[propName], true);
    }

    /**
     * @public @method
     * @param {keyof typeof this._OFFSETS} propName 
     * @returns uint8
     */
    getUint8(propName){
        return this._view.getUint8(this._ptr + this._OFFSETS[propName], true);
    }

    /**
     * @public @method
     * @param {keyof typeof this._OFFSETS} propName 
     * @returns uint16
     */
    getUint16(propName){
        return this._view.getUint16(this._ptr + this._OFFSETS[propName], true);
    }

    /**
     * @public @method
     * @param {keyof typeof this._OFFSETS} propName 
     * @returns Vector2
     */
    getVec2(propName){
        return {
            x: this._view.getFloat32(this._ptr + this._OFFSETS[propName], true),
            y: this._view.getFloat32(this._ptr + this._OFFSETS[propName] + 4, true)
        };
    }
}