/**
 * @import {CModule} from "../types/CModule"
 * @import {CFunctionCallerType} from "../types/CFunctionCallerType"
 * @import {StructMemberOffsetEnums} from "../types/StructMemberOffsetEnums"
 * @import {Vector2} from "../types/Vector2"
 */

/**
 * @class
 */
export default class C{
    /**@private @static @type {ArrayBuffer?} */
    static _mem = null;
    /**@private @static @type {DataView?} */
    static _memView = null;
    /**@private @static @type {CFunctionCallerType} */
    static _caller = new CFunctionCaller();
    /**@private @static @type {CModule?} */
    static _cmodule = null;
    /**@private @static @type {number?} */
    static _gameContextPtr = null;
    /**
     * cモジュールのポインタやviewを初期化します
     * @public @static @method
     * @param {CModule} cmodule - cモジュール
    */
    static init(cmodule){
        C._cmodule = cmodule;
        C._mem = cmodule.HEAP8.buffer;
        C._memView = new DataView(C._mem);
        C._caller.init(cmodule);
        C._gameContextPtr = C._caller.getGameContextPtr();

        // 構造体ビューの初期化
        C.plView.init(cmodule, C._memView, C._caller.player_getPtr(C.gameContextPtr), C._caller.player_getMemberOffsetsPtr());
        C.enView.init(cmodule, C._memView, C._caller.enemy_getPtr(C.gameContextPtr), C._caller.enemy_getMemberOffsetsPtr(), C._caller.enemy_getStructSize());
        C.bltView.init(cmodule, C._memView, C._caller.bullet_getPtr(C.gameContextPtr), C._caller.bullet_getMemberOffsetsPtr(), C._caller.bullet_getStructSize());
    }

    /**@public @static @readonly*/
    static get mem(){
        return C._mem;
    }

    /**@public @static @readonly*/
    static get gameContextPtr(){
        return C._gameContextPtr;
    }

    /**@public @static @readonly*/
    static get caller(){
        return C._caller;
    }

    /**@public @static @readonly*/
    static get cmodule(){
        return C._cmodule;
    }

    /**
     * - Cモジュールのプレイヤー情報を読み取ります.
     * @public @static @readonly @type {PlayerView}
     */
    static plView = new PlayerView();

    /**
     * - Cモジュールの敵情報を読み取ります.
     * @public @static @readonly @type {EnemiesView}
     */
    static enView = new EnemiesView();

    /**
     * - Cモジュールの弾情報を読み取ります.
     * @public @static @readonly @type {BulletsView}
     */
    static bltView = new BulletsView();
};

/**
 * - cモジュールから取得された関数を保持します.
 * @class
 * @implements {CFunctionCallerType}
 */
class CFunctionCaller extends CFunctionCallerType{
    /**@private @static @readonly */
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

    /**
     * - cモジュール内の関数をラッピングして呼び出し可能な状態にします.
     * @param {CModule} cmodule - cモジュール
     */
    init(cmodule){
        for(const [fnName, args] of Object.entries(CFunctionCaller.C_FUNCTIONS)){
            this[fnName] = cmodule.cwrap(...args);
        }
    }

    constructor(){
        super();
    }
}

/**
 * - CモジュールのPlayerデータにアクセスします
 * @class
 * @implements {SingleStructViewBase}
 */
class PlayerView extends SingleStructViewBase{
    /**@private @type {StructMemberOffsetEnums.Player} */
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
    /**@private @type {StructMemberOffsetEnums.Enemy} */
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

    constructor(){
        super();
    }
}

/**
 * - Bulletsデータにアクセスします
 * @class
 * @implements {ArrayStructViewBase}
 */
class BulletsView extends ArrayStructViewBase{
    /**@private @type {StructMemberOffsetEnums.Bullet} */
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

    constructor(){
        super();
    }
}

class SingleStructViewBase{
    /**
     * - Cモジュールの構造体メンバのオフセットを初期化後に保持します
     * @private @type {OffsetsEnum<T>}
     */
    _OFFSETS;
    /**@private @type {CModule?} */
    _cmodule;
    /**@private @type {DataView?} */
    _view;
    /**@private @type {number?} */
    _ptr;
    /**@privat @type {number?} */
    _offsetsPtr;

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

    /**
     * @public @method
     * @param {keyof this["_OFFSETS"]} propName
     * @returns {number} float32
     */
    getFloat32(propName){
        return this._view.getFloat32(this._ptr + this._OFFSETS[propName], true);
    }

    /**
     * @public @method
     * @param {keyof this["_OFFSETS"]} propName 
     * @returns {number} int32
     */
    getInt32(propName){
        return this._view.getInt32(this._ptr + this._OFFSETS[propName], true);
    }

    /**
     * @public @method
     * @param {keyof this["_OFFSETS"]} propName 
     * @returns {number} uint8
     */
    getUint8(propName){
        return this._view.getUint8(this._ptr + this._OFFSETS[propName], true);
    }

    /**
     * @public @method
     * @param {keyof this["_OFFSETS"]} propName 
     * @returns {number} uint16
     */
    getUint16(propName){
        return this._view.getUint16(this._ptr + this._OFFSETS[propName], true);
    }

    /**
     * @public @method
     * @param {keyof this["_OFFSETS"]} propName 
     * @returns {Vector2} Vector2
     */
    getVec2(propName){
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
    _OFFSETS;

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
     * @param {keyof this["_OFFSETS"]} propName 
     * @returns {number} float32
     */
    getFloat32(propName){
        return this._view.getFloat32(this._ptr + this._OFFSETS[propName], true);
    }

    /**
     * @public @method
     * @param {keyof this["_OFFSETS"]} propName 
     * @returns int32
     */
    getInt32(propName){
        return this._view.getInt32(this._ptr + this._OFFSETS[propName], true);
    }

    /**
     * @public @method
     * @param {keyof this["_OFFSETS"]} propName 
     * @returns uint8
     */
    getUint8(propName){
        return this._view.getUint8(this._ptr + this._OFFSETS[propName], true);
    }

    /**
     * @public @method
     * @param {keyof this["_OFFSETS"]} propName 
     * @returns uint16
     */
    getUint16(propName){
        return this._view.getUint16(this._ptr + this._OFFSETS[propName], true);
    }

    /**
     * @public @method
     * @param {keyof this["_OFFSETS"]} propName 
     * @returns Vector2
     */
    getVec2(propName){
        return {
            x: this._view.getFloat32(this._ptr + this._OFFSETS[propName], true),
            y: this._view.getFloat32(this._ptr + this._OFFSETS[propName] + 4, true)
        };
    }
}