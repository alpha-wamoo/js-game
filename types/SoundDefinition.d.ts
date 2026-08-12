export interface SoundDefinition{
    src: string; // 音声ファイルのパス
    volume?: number; // 0-1
    loop?: boolean; // 楽曲をループするか
};