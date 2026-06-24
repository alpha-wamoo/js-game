#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>

struct Vector2{
    float x, y;
};

struct RGB{
    uint8_t r, g, b;
};

struct Enemy{
    bool isValid;
    uint8_t id, size;
    struct Vector2 pos;
    uint8_t hitDmg, bulletDmg, rewardScore;
    float bulletShootableCnt;
    struct Vector2 speed;
    uint8_t maxHp;
    float hp;
    bool isAlpha;
    float randoms[6];
};

struct Player{
    bool isValid;
    uint8_t id, size;
    struct Vector2 pos;
    uint8_t bulletDmg;
    float bulletShootableCnt, runnableCnt, magicUsableCnt;
    bool isEnpowered;
    float unbeatableTime, unbeatableCnt;
    uint8_t maxHp;
    float hp;
};

struct Bullet{
    bool isValid;
    uint8_t id, size;
    struct Vector2 pos, speed;
    uint8_t ownerId, dmg;
    struct RGB color;
};

union Character{
    struct Enemy enemy;
    struct Bullet bullet;
};

struct Pool{
    void *buff;
    uint8_t capacity;
    uint8_t *freeIdStack;
};


struct Pool *enemiesPool;
struct Pool *bulletsPool;


void init(){
    enemiesPool->capacity = 128;
    enemiesPool->buff = malloc(enemiesPool->capacity * sizeof(struct Enemy));
    enemiesPool->freeIdStack = malloc(enemiesPool->capacity * sizeof(struct Enemy));
    for(int i = 0; i < enemiesPool->capacity; i++){
        *(enemiesPool->freeIdStack + i * sizeof(struct Enemy)) = i;
        *(struct Enemy*)(enemiesPool->buff + i * sizeof(struct Enemy)) = ;
    }

}

struct Vector2* createVector2(float x, float y){
    struct Vector2 vec2 = {x, y};
    return &vec2;
}

struct RGB* createRGB(uint8_t r, uint8_t g, uint8_t b){
    struct RGB rgb = {r, g, b};
    return &rgb;
}

struct Enemy* createEnemy(uint8_t id, uint8_t size, struct Vector2 pos, struct Vector2 speed, uint8_t hitDmg, uint8_t bulletDmg, uint8_t rewardScore, float bulletShootableCnt){
    struct Enemy* enemy;
    return enemy;
}

struct Player* createPlayer(){
    struct Player* player;
    return player;
}

uint8_t calc(){
    return 10;
}
