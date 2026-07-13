#include "../header/Player.h"

const uint8_t PLAYER_ID = 0xff;

PlayerMemberOffset player_memberOffsetsAry[] = {
    PLAYER_OFFSET_ID,
    PLAYER_OFFSET_SIZE,
    PLAYER_OFFSET_BULLET_DMG,
    PLAYER_OFFSET_MAX_HP,
    PLAYER_OFFSET_SPEED,
    PLAYER_OFFSET_IS_VALID,
    PLAYER_OFFSET_IS_ENPOWERED,
    PLAYER_OFFSET_BULLET_SHOOTABLE_CNT,
    PLAYER_OFFSET_RUNNABLE_CNT,
    PLAYER_OFFSET_MAGIC_USABLE_CNT,
    PLAYER_OFFSET_UNBEATABLE_TIME,
    PLAYER_OFFSET_UNBEATABLE_CNT,
    PLAYER_OFFSET_HP,
    PLAYER_OFFSET_POS
};

Player *player_newInstance(GameContext *game){
    cdb_call(__func__);
    PlayerDefinition *def = game->jsonData->playerDefinition;
    Player *pl = malloc(sizeof(Player));
    pl->isValid = true;
    pl->id = PLAYER_ID;
    pl->size = def->size;
    pl->bulletDmg = def->bltDmg;
    pl->maxHp = def->maxHp;
    pl->hp = def->maxHp;
    pl->speed = def->speed;
    pl->isEnpowered = false;
    pl->bulletShootableCnt = 0;
    pl->runnableCnt = 0;
    pl->magicUsableCnt = 0;
    pl->unbeatableTime = def->unbeatableTime;
    pl->unbeatableCnt = 0;
    pl->pos = (Vector2){(float)def->beginPosX, (float)def->beginPosY};
    cdb_exit(__func__);
    return pl;
}

void player_delete(GameContext *game){
    free(game->player);
}

void player_kill(GameContext *game){
    game->player->isValid = false;
}

void player_inputKeyboard(GameContext *game){
    Player *pl = game->player;
    if(keyboard_isPressed(game, KEY_W))
}

void player_move(GameContext *game){
    Player *pl = game->player;
    Config *conf = game->jsonData->config;
    float delta = pl->speed / FPS;
    if(keyboard_pressedCnt(game, KEY_W) && pl->pos.y - delta - pl->size/2 > 0) pl->pos.y -= delta;
    if(keyboard_pressedCnt(game, KEY_A) && pl->pos.x - delta - pl->size/2 > 0) pl->pos.x -= delta;
    if(keyboard_pressedCnt(game, KEY_S) && pl->pos.y + delta + pl->size/2 < conf->CANV_H) pl->pos.y += delta;
    if(keyboard_pressedCnt(game, KEY_D) && pl->pos.x + delta + pl->size/2 < conf->CANV_W) pl->pos.x += delta;
}

Bullet *player_shootBullet(GameContext *game, float velX, float velY){
    Config *conf = game->jsonData->config;
    struct ConfigBullet *bulletConf = (game->player->isEnpowered)? conf->BULLET : conf->ENPOWERED_BULLET;
    Bullet *bullet = (Bullet*)pool_get(game->bulletsPool);
    if(!conf || !bulletConf || !bullet) return NULL;
    bullet->isValid = true;
    bullet->size = bulletConf->SIZE;
    bullet->pos = game->player->pos;
    bullet->vel = (Vector2){velX, velY};
    bullet->ownerId = game->player->id;
    bullet->dmg = game->player->bulletDmg;
    bullet->color = bulletConf->RGB;
    return bullet;
}

Bullet **player_shootBullets(GameContext *game, Vector2 vel[], uint8_t length){
    cdb_call(__func__);
    Bullet **bullets = malloc(sizeof(Bullet*));
    Config *conf = game->jsonData->config;
    struct ConfigBullet *bulletConf = (game->player->isEnpowered)? conf->BULLET : conf->ENPOWERED_BULLET;
    Player *pl = game->player;
    if(!conf || !bulletConf || !bullets || !pl) return NULL;

    for(uint8_t i = 0; i < length; i++) bullets[i] = bullet_spawnByPlayer(pl, bulletConf, vel[i]);
    cdb_exit(__func__);
    return bullets;
}

void player_applyDamage(GameContext *game, uint8_t decrements){
    game->player->hp -= decrements;
    if(game->player->hp <= 0) player_kill(game);
}

void player_applyHeal(GameContext *game, uint8_t increments){
    Player *pl = game->player;
    pl->hp += increments;
    if(pl->hp > pl->maxHp) pl->hp = pl->maxHp;
}


EMSCRIPTEN_KEEPALIVE
int player_getMemberOffsetsPtr(){
    return (int)player_memberOffsetsAry;
}

EMSCRIPTEN_KEEPALIVE
int player_getPtr(GameContext *game){
    return (int)game->player;
}