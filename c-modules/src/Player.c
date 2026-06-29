#include "../header/Player.h"

const uint8_t PLAYER_ID = 0xff;

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

void player_move(GameContext *game){
    Player *pl = game->player;
    Config *conf = game->jsonData->config;
    float delta = pl->speed / FPS;
    if(keyboard_pressedCnt(game, KEY_W) && pl->pos.y - delta - pl->size/2 > 0) pl->pos.y -= delta;
    if(keyboard_pressedCnt(game, KEY_A) && pl->pos.x - delta - pl->size/2 > 0) pl->pos.x -= delta;
    if(keyboard_pressedCnt(game, KEY_S) && pl->pos.y + delta + pl->size/2 < conf->CANV_H) pl->pos.y += delta;
    if(keyboard_pressedCnt(game, KEY_D) && pl->pos.x + delta + pl->size/2 < conf->CANV_W) pl->pos.x += delta;
}

// TODO: add effects
/**
 * - プレイヤーから弾丸を発射します
 * @param game ゲーム状態
 * @param velX x速度
 * @param velY y速度
 * @returns 発射されたBulletインスタンス
 */
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

/**
 * - プレイヤーから複数の弾丸を発射します
 * @param game ゲーム状態
 * @param vel 弾丸の速度配列
 * @param length 弾丸の数
 * @returns 発射されたBulletインスタンス配列. 失敗時にはNULL.
 */
Bullet **player_shootBullets(GameContext *game, Vector2 vel[], uint8_t length){
    cdb_call(__func__);
    Bullet **bullets = malloc(sizeof(Bullet*));
    Config *conf = game->jsonData->config;
    struct ConfigBullet *bulletConf = (game->player->isEnpowered)? conf->BULLET : conf->ENPOWERED_BULLET;
    Player *pl = game->player;
    if(!conf || !bulletConf || !bullets || !pl) return NULL;

    for(uint8_t i = 0; i < length; i++){
        Bullet *bullet = (Bullet*)pool_get(game->bulletsPool);
        if(!bullet) return NULL;
        bullet->isValid = true;
        bullet->size = bulletConf->SIZE;
        bullet->pos = pl->pos;
        bullet->vel = vel[i];
        bullet->ownerId = pl->id;
        bullet->dmg = pl->bulletDmg;
        bullet->color = bulletConf->RGB;
        bullets[i] = bullet;
    }
    cdb_exit(__func__);
    return bullets;
}

// TODO: add effects
void player_applyDamage(GameContext *game, uint8_t hp){
    game->player->hp -= hp;
    if(game->player->hp <= 0) player_kill(game);
}

// TODO: add effects
void player_applyHeal(GameContext *game, uint8_t hp){
    Player *pl = game->player;
    pl->hp += hp;
    if(pl->hp > pl->maxHp) pl->hp = pl->maxHp;
}