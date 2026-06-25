#pragma once
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
#include "Vector2.h"
#include "cJSON.h"

typedef struct Enemy{
    bool isValid;
    uint8_t id, size;
    Vector2 pos;
    uint8_t hitDmg, bulletDmg, rewardScore;
    float bulletShootableCnt;
    Vector2 speed;
    uint8_t maxHp;
    float hp;
    bool isAlpha;
    float randoms[6];
} Enemy;

Enemy* newEnemy(
    uint8_t size,
    Vector2* pos,
    Vector2* speed,
    uint8_t maxHp,
    bool isAlpha,
    uint8_t hitDmg,
    uint16_t rewardScore,
    float bulletShootableCnt
);