#include "../header/Enemy.h"

Enemy* createEnemy(uint8_t id, uint8_t size, Vector2 pos, Vector2 speed, uint8_t hitDmg, uint8_t bulletDmg, uint8_t rewardScore, float bulletShootableCnt){
    Enemy* enemy;
    return enemy;
}

Enemy* newEnemy(
    bool isAlpha,
    uint8_t maxHp,
    uint8_t size,
    uint8_t hitDmg,
    uint16_t rewardScore,
    float bulletShootableCnt,
    Vector2* pos,
    Vector2* speed
){
    Enemy* enemy = malloc(sizeof(Enemy));
    return enemy;
}