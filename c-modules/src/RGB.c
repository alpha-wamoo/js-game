#include "../header/RGB.h"

RGB* newRGB(uint8_t r, uint8_t g, uint8_t b){
    RGB *rgb = malloc(sizeof(RGB));
    rgb->r = r;
    rgb->g = g;
    rgb->b = b;
    return rgb;
}