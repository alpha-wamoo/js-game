#include "../header/framework.h"

Vector2* newVector2(float x, float y){
    Vector2* vec2 = malloc(sizeof(Vector2));
    vec2->x = x;
    vec2->y = y;
    return vec2;
}