#pragma once
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <emscripten/emscripten.h>
#include "Vector2.h"
#include "cJSON.h"
#include "JsonData.h"
#include "GameContext.h"
#include "Pool.h"
#include "util.h"

#define IS_SAME_STR(str1, str2) (strcasecmp((str1), (str2)) == 0)

typedef enum EnemyTypeId{
    TYPE_BASIC,
    TYPE_TOUGH,
    TYPE_SMALL,
    TYPE_TRICKY
} EnemyTypeId;

typedef struct Enemy{
    uint8_t id, size, maxHp, hitDmg, bulletDmg, rewardScore;
    bool isValid, isAlpha;
    Vector2 pos;
    float speed, bulletShootableCnt, hp, randoms[8];
    char *imgSrc, *motionKey;
    EnemyTypeId typeId;
} Enemy;

typedef enum EnemyMemberOffset{
    ENEMY_OFFSET_ID = offsetof(Enemy, id),
    ENEMY_OFFSET_SIZE = offsetof(Enemy, size),
    ENEMY_OFFSET_MAX_HP = offsetof(Enemy, maxHp),
    ENEMY_OFFSET_HIT_DMG = offsetof(Enemy, hitDmg),
    ENEMY_OFFSET_BULLET_DMG = offsetof(Enemy, bulletDmg),
    ENEMY_OFFSET_REWARD_SCORE = offsetof(Enemy, rewardScore),
    ENEMY_OFFSET_IS_VALID = offsetof(Enemy, isValid),
    ENEMY_OFFSET_IS_ALPHA = offsetof(Enemy, isAlpha),
    ENEMY_OFFSET_POS = offsetof(Enemy, pos),
    ENEMY_OFFSET_SPEED = offsetof(Enemy, speed),
    ENEMY_OFFSET_BULLET_SHOOTABLE_CNT = offsetof(Enemy, bulletShootableCnt),
    ENEMY_OFFSET_HP = offsetof(Enemy, hp),
    ENEMY_OFFSET_RANDOMS = offsetof(Enemy, randoms),
    ENEMY_OFFSET_IMG_SRC = offsetof(Enemy, imgSrc),
    ENEMY_OFFSET_MOTION_KEY = offsetof(Enemy, motionKey),
    ENEMY_OFFSET_TYPE_ID = offsetof(Enemy, typeId)
} EnemyMemberOffset;

/**
 * - Enemy構造体のメンバ変数のオフセットを格納した配列の先頭ポインタ
 */
extern EnemyMemberOffset enemy_memberOffsetsAry[];

/**
 * - Enemy構造体のメンバ変数のオフセットを取得するための先頭ポインタを返します
 * @returns ポインタ
 */
int enemy_getMemberOffsetsPtr();

/**
 * - Enemy構造体arrayのポインタを取得します
 * @param game ゲーム状態
 * @returns Enemy構造体arrayのポインタ
 */
int enemy_getPtr(GameContext *game);

/**
 * - Enemy構造体のサイズを取得します
 * @returns Enemy構造体のサイズ
 */
int enemy_getStructSize();

// TODO: あとでtypeIdをintによって受け取るように実装する.
/**
 * - 新たなEnemyを出現させます
 * @param game ゲーム状態
 * @param typeId 出現させるEnemyの種類
 * @returns 出現させたEnemy
 */
Enemy *enemy_spawn(GameContext *game, const char *typeId);

/**
 * - Enemyを消滅させます
 * @param game ゲーム状態
 * @param enemy 消滅させるEnemy
 */
void enemy_remove(GameContext *game, Enemy *enemy);