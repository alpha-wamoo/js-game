#pragma once
#include <stdint.h>
#include <stdbool.h>
#include <stdlib.h>
#include "RGB.h"
#include "cJSON.h"

#define getNodePtr(parentPtr, itemName) (cJSON_GetObjectItemCaseSensitive((parentPtr), (itemName)))

typedef RGB RGB_t;

// - エネミーのデフォルトデータ
typedef struct EnemyDefinition{
    bool existAlpha;
    char *imgSrc, *motionKey;
    uint8_t size, rewardScore;
    uint16_t maxHp, hitDmg;
    float speed;
} EnemyDefinition;

// - typeIdごとのデフォルトデータ
typedef struct EnemiesDefinition{
    EnemyDefinition *basic, *tough, *small, *tricky;
} EnemiesDefinition;

// - プレイヤーのデフォルトデータ
typedef struct PlayerDefinition{
    uint8_t size, bltDmg;
    uint16_t speed, maxHp, unbeatableTime, beginPosX, beginPosY;
    char* imgSrc;
} PlayerDefinition;

// - ゲームの設定データ
typedef struct Config{
    uint16_t CANV_H, CANV_W;

    struct ConfigBullet{
        uint16_t SPEED, SIZE;
        float SHOOTABLE_INTERVAL_SEC;
        RGB_t *RGB;
    } *BULLET, *ENPOWERED_BULLET;

    struct ConfigNaturalHeal{
        uint32_t INTERVAL;
        uint8_t HP;
    } *NATURAL_HEAL;

    struct ConfigEnemy{
        float ALPHA_RATE;

        struct ConfigEnemyAlpha{
            float SPEED_RATE, DMG_RATE, HP_RATE, SIZE_RATE, REWARD_RATE;
        } *ALPHA;
    } *ENEMY;

    struct ConfigStage{
        uint8_t CHARACTERS_CAPACITY, BULLETS_CAPACITY, CELL_SIZE;
    } *STAGE;
} Config;

typedef struct JsonData{
    EnemiesDefinition *enemiesDefinition;
    PlayerDefinition *playerDefinition;
    Config *config;
} JsonData;

/**
 * @param enemiesDefinitionJson EnemiesDefinition構造体を生成するjson形式の文字列
 * @param playerDefinitionJson PlayerDefinition構造体を生成するjson形式の文字列
 * @param configJson Config構造体を生成するjson形式の文字列
 * @returns 読み込んだjsonのデータ. 失敗時はNULL.
 */
JsonData *json_loadAll(const char *enemiesDefinitionJson, const char *playerDefinitionJson, const char *configJson);