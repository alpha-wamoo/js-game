#include "../header/Bullet.h"

BulletMemberOffset bullet_memberOffsetsAry[] = {
    BULLET_OFFSET_ID,
    BULLET_OFFSET_OWNER_ID,
    BULLET_OFFSET_DMG,
    BULLET_OFFSET_SIZE,
    BULLET_OFFSET_IS_VALID,
    BULLET_OFFSET_POS,
    BULLET_OFFSET_VEL,
    BULLET_OFFSET_COLOR
};

EMSCRIPTEN_KEEPALIVE
int bullet_getMemberOffsetsPtr(){
    return (int)bullet_memberOffsetsAry;
}

EMSCRIPTEN_KEEPALIVE
int bullet_getPtr(GameContext *game){
    return (int)game->bullets;
}

EMSCRIPTEN_KEEPALIVE
int bullet_getStructSize(){
    return sizeof(Bullet);
}