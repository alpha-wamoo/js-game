#pragma once
#include <stdbool.h>
#include <stdint.h>
#include "Vector2.h"

typedef struct Player{
    uint8_t id, size, bulletDmg, maxHp;
    bool isValid, isEnpowered;
    float bulletShootableCnt, runnableCnt, magicUsableCnt, unbeatableTime, unbeatableCnt, hp;
    Vector2 pos;
} Player;

void player_remove();

void player_move();