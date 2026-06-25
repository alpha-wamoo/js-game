#pragma once
#include <stdbool.h>
#include <stdint.h>
#include "Vector2.h"
#include "RGB.h"

typedef struct Bullet{
    bool isValid;
    uint8_t id, size;
    Vector2 pos, speed;
    uint8_t ownerId, dmg;
    RGB color;
} Bullet;