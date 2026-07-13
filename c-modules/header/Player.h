#pragma once
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
#include <emscripten/emscripten.h>
#include "Vector2.h"
#include "GameContext.h"
#include "Keyboard.h"
#include "Bullet.h"
#include "Pool.h"
#include "util.h"

typedef struct GameContext GameContext;

typedef struct Player{
    uint8_t id, size, bulletDmg, maxHp; // offset 0-3
    uint16_t speed; // offset 4-5
    bool isValid, isEnpowered; // offset 6-7
    float bulletShootableCnt, runnableCnt, magicUsableCnt, unbeatableTime, unbeatableCnt, hp; // offset 8-31
    Vector2 pos; // offset 32-39
} Player;

typedef enum PlayerMemberOffset{
    PLAYER_OFFSET_ID = offsetof(Player, id),
    PLAYER_OFFSET_SIZE = offsetof(Player, size),
    PLAYER_OFFSET_BULLET_DMG = offsetof(Player, bulletDmg),
    PLAYER_OFFSET_MAX_HP = offsetof(Player, maxHp),
    PLAYER_OFFSET_SPEED = offsetof(Player, speed),
    PLAYER_OFFSET_IS_VALID = offsetof(Player, isValid),
    PLAYER_OFFSET_IS_ENPOWERED = offsetof(Player, isEnpowered),
    PLAYER_OFFSET_BULLET_SHOOTABLE_CNT = offsetof(Player, bulletShootableCnt),
    PLAYER_OFFSET_RUNNABLE_CNT = offsetof(Player, runnableCnt),
    PLAYER_OFFSET_MAGIC_USABLE_CNT = offsetof(Player, magicUsableCnt),
    PLAYER_OFFSET_UNBEATABLE_TIME = offsetof(Player, unbeatableTime),
    PLAYER_OFFSET_UNBEATABLE_CNT = offsetof(Player, unbeatableCnt),
    PLAYER_OFFSET_HP = offsetof(Player, hp),
    PLAYER_OFFSET_POS = offsetof(Player, pos)
} PlayerMemberOffset;

/**
 * - Player構造体のメンバ変数のオフセットを格納した配列の先頭ポインタ
 */
extern PlayerMemberOffset player_memberOffsetsAry[];

/**
 * - Player構造体のidの値(0xff = プレイヤー)
 */
extern const uint8_t PLAYER_ID;

/**
 * - Player構造体のメンバ変数のオフセットを取得するための先頭ポインタを返します
 * @returns ポインタ
 */
int player_getMemberOffsetsPtr();

int player_getPtr(GameContext *game);

/**
 * - Playerインスタンスを作ります
 * @param game ゲーム状態
 * @returns Playerインスタンス
 */
Player *player_newInstance(GameContext *game);

/**
 * - Playerインスタンスを解放します
 * @param game ゲーム状態
 */
void player_delete(GameContext *game);

/**
 * - Playerを倒します
 * @param game ゲーム状態
 */
void player_kill(GameContext *game);

/**
 * - キー入力に基づいてPlayerを操作します
 * @param game ゲーム状態
 */
void player_inputKeyboard(GameContext *game);

/**
 * - キー入力に基づいてPlayerを移動させます
 * @param game ゲーム状態
 */
void player_move(GameContext *game);

/**
 * - Playerから弾丸を発射します
 * @param game ゲーム状態
 * @param velX 弾丸のX方向の速度
 * @param velY 弾丸のy方向の速度
 * @returns 発射されたBulletインスタンス. 失敗時にはNULL.
 */
Bullet *player_shootBullet(GameContext *game, float velX, float velY);

/**
 * - Playerから複数の弾丸を発射します
 * @param game ゲーム状態
 * @param vel 弾丸の速度配列
 * @param length 弾丸の数
 * @returns 発射されたBulletインスタンスの配列. 失敗時にはNULL.
 */
Bullet **player_shootBullets(GameContext *game, Vector2 vel[], uint8_t length);

/**
 * - Playerにダメージを与えます
 * @param game ゲーム状態
 * @param decrements 減少量
 */
void player_applyDamage(GameContext *game, uint8_t decrements);

/**
 * - Playerを回復します
 * @param game ゲーム状態
 * @param increments 増加量
 */
void player_applyHeal(GameContext *game, uint8_t increments);