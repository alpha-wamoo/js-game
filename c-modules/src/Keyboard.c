#include "../header/Keyboard.h"

Keyboard *keyboard_newInstance(){
    Keyboard *keyboard = malloc(sizeof(Keyboard));
    return keyboard;
}

EMSCRIPTEN_KEEPALIVE
void keyboard_update(GameContext *game, uint16_t *keyFrameCnts, int length){
    game->keyboard->keyFrameCnts = keyFrameCnts;
    game->keyboard->keyNumbers = length;
}