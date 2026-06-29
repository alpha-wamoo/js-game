#pragma once
#include "Pool.h"
#include "JsonData.h"
#include "Keyboard.h"
#include "Player.h"

typedef struct Keyboard Keyboard;
typedef struct Player Player;

typedef struct GameContext{
    Pool *enemiesPool, *bulletsPool;
    JsonData *jsonData;
    Keyboard *keyboard;
    Player *player;
} GameContext;