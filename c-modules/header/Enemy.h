#pragma once
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>
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