import type {Vector2} from "Vector2"

export interface DynamicTextQueueItem{
    /** テキストが表示される期間(ms) */
    duration: number;
    setter: {
        /** テキストをセットします */
        text: (frameCnt: number) => string;
        /** 色をセットします */
        rgb: (frameCnt: number) => string;
        /** サイズ（pixel）をセットします */
        px: (frameCnt: number) => number;
        /** 描画する範囲の最小座標（左上）を指定します */
        pos: (frameCnt: number) => Vector2;
    };
    options?: {
        /** 開始するフレーム番号を指定します. default: 0 */
        frameCnt?: number;
        /** 描画する範囲の指定に中心座標が用いられます. default: false */
        usingCenterPos?: boolean;
    };
}