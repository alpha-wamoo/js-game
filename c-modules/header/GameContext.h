#pragma once
#include "Pool.h"
#include "JsonData.h"
#include "Keyboard.h"

typedef struct Keyboard Keyboard;

typedef struct GameContext{
    Pool *enemiesPool, *bulletsPool;
    JsonData *jsonData;
    Keyboard *keyboard;
} GameContext;