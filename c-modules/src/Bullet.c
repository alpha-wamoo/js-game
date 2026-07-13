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

Bullet *bullet_spawnByPlayer(Player *pl, struct ConfigBullet *bulletConf, Vector2 vel){
    Bullet *bullet = (Bullet*)pool_get(game->bulletsPool);
    if(!bullet) return NULL;

    bullet->isValid = true;
    bullet->size = bulletConf->SIZE;
    bullet->pos = pl->pos;
    bullet->vel = vel;
    bullet->ownerId = pl->id;
    bullet->dmg = pl->bulletDmg;
    bullet->color = bulletConf->RGB;
    return bullet;
}

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