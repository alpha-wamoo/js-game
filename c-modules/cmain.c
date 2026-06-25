#include "header/framework.h"

Pool *enemiesPool;
Pool *bulletsPool;


void init(){
    initPool(enemiesPool, Enemy, 128);
    initPool(bulletsPool, Bullet, 128);
}

Player* createPlayer(){
    Player* player;
    return player;
}