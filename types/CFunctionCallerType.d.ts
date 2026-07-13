import type {CModule} from "./CModule";

export namespace CFunctionCallerType{
    export const C_FUNCTIONS: {
        [fnName: string]: {
            fnName: string,
            retType: string,
            argTypes: string[]
        };
    };
}

/**
 * - cモジュールから取得した関数を保持します.
 */
export interface CFunctionCallerType{
    /**
     * - Cモジュールの関数をcwrapでラップして呼び出せるように初期化します
     * @param {CModule} cmodule - cモジュール
     */
    public init(cmodule: CModule): void;

    /**
     * - ゲーム状態を初期化します
     * @param enemiesDefinition - 敵の定義JSON文字列
     * @param playerDefinition - プレイヤーの定義JSON文字列
     * @param config - 設定の定義JSON文字列
     * @param skillDefinition - スキルの定義JSON文字列
     * @returns 初期化に成功したかどうか
     */
    public initGameContext(enemiesDefinition: string, playerDefinition: string, config: string, skillDefinition: string): boolean;

    /**
     * - ゲーム状態のポインタを取得します
     * @returns ゲーム状態のポインタ
     */
    public getGameContextPtr(): number;

    /**
     * - キーボードの状態を更新します
     * @param gameContextPtr - ゲーム状態のポインタ
     * @param keyCntsPtr - キーの状態を格納する配列のポインタ
     * @param definedKeyNumbers - 定義されたキーの数
     */
    public keyboard_update(gameContextPtr: number, keyCntsPtr: number, definedKeyNumbers: number): void;

    /**
     * - プレイヤー構造体のポインタを取得します
     * @param gameContextPtr - ゲーム状態のポインタ
     * @returns プレイヤーのポインタ
     */
    public player_getPtr(gameContextPtr: number): number;

    /**
     * - プレイヤー構造体のメンバーオフセット配列のポインタを取得します
     * @returns プレイヤーのメンバーオフセット配列のポインタ
     */
    public player_getMemberOffsetsPtr(): number;

    /**
     * - 敵構造体配列のポインタを取得します
     * @param gameContextPtr - ゲーム状態のポインタ
     * @returns 敵構造体配列のポインタ
     */
    public enemy_getPtr(gameContextPtr: number): number;

    /**
     * - 敵構造体のサイズを取得します
     * @returns 敵構造体のサイズ
     */
    public enemy_getStructSize(): number;

    /**
     * - 敵構造体のメンバーオフセット配列のポインタを取得します
     * @returns 敵のメンバーオフセット配列のポインタ
     */
    public enemy_getMemberOffsetsPtr(): number;
    /**
     * - 弾構造体配列のポインタを取得します
     * @param gameContextPtr - ゲーム状態のポインタ
     * @returns 弾構造体のポインタ
     */
    public bullet_getPtr(gameContextPtr: number): number;
    /**
     * - 弾構造体のメンバーオフセット配列のポインタを取得します
     * @returns 弾のメンバーオフセット配列のポインタ
     */
    public bullet_getMemberOffsetsPtr(): number;

    /**
     * - 弾構造体のサイズを取得します
     * @returns 弾構造体のサイズ
     */
    public bullet_getStructSize(): number;
}