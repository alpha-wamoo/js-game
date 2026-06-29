#pragma once
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
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

typedef const enum PlayerMemberOffset{
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

extern const uint8_t PLAYER_ID;

Player *player_newInstance(GameContext *game);

void player_delete(GameContext *game);

void player_kill(GameContext *game);

void player_move(GameContext *game);

Bullet *player_shootBullet(GameContext *game, float velX, float velY);

Bullet **player_shootBullets(GameContext *game, Vector2 vel[], uint8_t length);

void player_applyDamage(GameContext *game, uint8_t hp);

void player_applyHeal(GameContext *game, uint8_t hp);