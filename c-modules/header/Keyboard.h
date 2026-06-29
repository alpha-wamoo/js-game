#pragma once
#include <stdint.h>
#include <stdlib.h>
#include <emscripten/emscripten.h>
#include "GameContext.h"

typedef struct GameContext GameContext;

typedef struct Keyboard{
    uint16_t *keyCnts;
    uint8_t keyNumbers;
} Keyboard;

typedef enum Key{
    KEY_W,
    KEY_A,
    KEY_S,
    KEY_D,
    KEY_SHIFT,
    KEY_SPACE,
    KEY_ENTER
} Key;

/**
 * - 新たなKeyboardインスタンスを生成します
 * @returns 生成されたKeyboardインスタンス
 */
Keyboard *keyboard_newInstance();

/**
 * - Keyboardを更新します
 * @param game ゲーム状態
 * @param keyFrameCnts キー押下時間を保持する配列
 * @param length 定義済みのキーの数
 */
EMSCRIPTEN_KEEPALIVE
void keyboard_update(GameContext *game, uint16_t *keyFrameCnts, int length);

/**
 * - キーが押されている時間を取得します
 * @param game ゲーム状態
 * @param key キー
 */
uint16_t keyboard_pressedCnt(GameContext *game, Key key);