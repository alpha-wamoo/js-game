#include "../header/Keyboard.h"

Keyboard *keyboard_newInstance(){
    Keyboard *keyboard = malloc(sizeof(Keyboard));
    return keyboard;
}

EMSCRIPTEN_KEEPALIVE
void keyboard_update(GameContext *game, uint16_t *keyCnts, int length){
    game->keyboard->keyCnts = keyCnts;
    game->keyboard->keyNumbers = length;
}

uint16_t keyboard_pressedCnt(GameContext *game, Key key){
    return game->keyboard->keyCnts[key];
}