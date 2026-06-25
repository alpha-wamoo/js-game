#pragma once
#include <stdint.h>
#include <stdlib.h>

typedef struct RGB{
    uint8_t r, g, b;
} RGB;

RGB* newRGB(uint8_t r, uint8_t g, uint8_t b);