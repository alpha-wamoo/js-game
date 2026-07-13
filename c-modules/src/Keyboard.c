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

bool keyboard_isPressed(GameContext *game, Key key){
    if(game->keyboard->keyCnts[key] <= 0) return false;
    return true;
}