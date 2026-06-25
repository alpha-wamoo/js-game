#include "header/framework.h"

Pool *enemiesPool;
Pool *bulletsPool;


void init(){
    initPool(enemiesPool, Enemy, 128);
    initPool(bulletsPool, Bullet, 128);
}

Enemy* createEnemy(uint8_t id, uint8_t size, Vector2 pos, Vector2 speed, uint8_t hitDmg, uint8_t bulletDmg, uint8_t rewardScore, float bulletShootableCnt){
    Enemy* enemy;
    return enemy;
}

Player* createPlayer(){
    Player* player;
    return player;
}