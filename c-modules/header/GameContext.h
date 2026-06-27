#pragma once
#include "Pool.h"
#include "JsonData.h"

typedef struct GameContext{
    Pool *enemiesPool, *bulletsPool;
    JsonData *jsonData;
} GameContext;