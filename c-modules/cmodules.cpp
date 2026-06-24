#include <stdbool.h>
#include <stdint.h>

typedef struct Vector2{
    float x, y;
} Vector2;

typedef struct RGB{
    uint8_t r, g, b;
} RGB;

typedef struct Enemy{
    bool isValid;
    uint8_t id, size;
    Vector2 pos;
    uint8_t hitDmg, bulletDmg, rewardScore;
    float bulletShootableCnt;
    Vector2 speed;
    uint8_t maxHp;
    float hp;
    bool isAlpha;
    float randoms[6];
} Enemy;

typedef struct Player{
    bool isValid;
    uint8_t id, size;
    Vector2 pos;
    uint8_t bulletDmg;
    float bulletShootableCnt, runnableCnt, magicUsableCnt;
    bool isEnpowered;
    float unbeatableTime, unbeatableCnt;
    uint8_t maxHp;
    float hp;
} Player;

typedef struct Bullet{
    bool isValid;
    uint8_t id, size;
    Vector2 pos, speed;
    uint8_t ownerId, dmg;
    RGB color;
} Bullet;

typedef struct Pool{
    Enemy enemies[128];
    Bullet bullets[128];
} Pool;

extern "C"{
    Vector2* createVector2(float x, float y){
        Vector2* vec2;
        vec2->x = x;
        vec2->y = y;
        return vec2;
    }

    Enemy* createEnemy(uint8_t id, uint8_t size, Vector2 pos, Vector2 speed, uint8_t hitDmg, uint8_t bulletDmg, uint8_t rewardScore, float bulletShootableCnt){
        Enemy* enemy;

    }

    Player* createPlayer(){

    }
}