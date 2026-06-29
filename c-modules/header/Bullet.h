#pragma once
#include <stdbool.h>
#include <stdint.h>
#include "Vector2.h"
#include "RGB.h"

typedef struct Bullet{
    uint8_t id, ownerId, dmg;
    uint16_t size;
    bool isValid;
    Vector2 pos, vel;
    RGB color;
} Bullet;