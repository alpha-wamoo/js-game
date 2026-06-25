#pragma once
#include <stdbool.h>
#include <stdint.h>
#include "Vector2.h"

typedef struct Player{
    bool isValid;
    uint8_t id, size;
    Vector2 pos;
    uint8_t bulletDmg;
    float bulletShootableCnt, runnableCnt, magicUsableCnt;
    bool isEnpowered;
    float unbeatableTime, unbeatableCnt;
    uint8_t maxHp;
    float hp;
} Player;