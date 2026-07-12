import type {CModule} from "./CModule";
import type {Vector2} from "./Vector2";


interface t {
    a: number,
    b: number
}

const tt = {
    a: 1,
    b: 2
};

/**
 * - 単一の構造体に対してviewとして機能します
 */
export interface SingleStructViewBaseType<OffsetsEnum extends Record<string, number>>{
    private _cmodule: CModule?;
    private _view: DataView?;
    private _ptr: number?;
    private _offsetsPtr: number?;
    /** - Cモジュールの構造体メンバのオフセットを初期化後に保持します*/
    private _OFFSETS: OffsetsEnum;

    /**
     * - Viewとオフセットを初期化します
     * @param cmodule - cモジュール
     * @param view - DataView
     * @param ptr - ポインタ
     * @param offsetsPtr - メンバのオフセット配列ポインタ
     */
    public init(cmodule: CModule, view: DataView, ptr: number, offsetsPtr: number): void;

    public getFloat32(propName: keyof OffsetsEnum): number;

    public getInt32(propName: keyof OffsetsEnum): number;

    public getUint8(propName: keyof OffsetsEnum): number;

    public getUint16(propName: keyof OffsetsEnum): number;

    public getVec2(propName: keyof OffsetsEnum): Vector2;
}