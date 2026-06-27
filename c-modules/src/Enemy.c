#include "../header/Enemy.h"

EnemyDefinition *_getEnemyDefinition(EnemyTypeId typeId, EnemiesDefinition *enemiesDefinition){
    EnemyDefinition *enemyDef;
    if(typeId == TYPE_BASIC) enemyDef = enemiesDefinition->basic;
    else if(typeId == TYPE_TOUGH) enemyDef = enemiesDefinition->tough;
    else if(typeId == TYPE_SMALL) enemyDef = enemiesDefinition->small;
    else if(typeId == TYPE_TRICKY) enemyDef = enemiesDefinition->tricky;
    return enemyDef;
}

/**
 * - α化テンプレートに基づいてエネミーをα化します
 * @param enemy エネミー
 * @param alphaTemplate α化テンプレート
 */
void _toAlpha(Enemy *enemy, struct ConfigEnemyAlpha *alphaTemplate){
    enemy->isAlpha = true;
    enemy->speed *= alphaTemplate->SPEED_RATE;
    enemy->hitDmg *= alphaTemplate->DMG_RATE;
    enemy->maxHp *= alphaTemplate->HP_RATE;
    enemy->hp *= alphaTemplate->HP_RATE;
    enemy->size *= alphaTemplate->SIZE_RATE;
    enemy->rewardScore *= alphaTemplate->REWARD_RATE;
}

void _setTypeId(Enemy *enemy, const char *typeId){
    if(IS_SAME_STR(typeId, "basic")) enemy->typeId = TYPE_BASIC;
    else if(IS_SAME_STR(typeId, "tough")) enemy->typeId = TYPE_TOUGH;
    else if(IS_SAME_STR(typeId, "small")) enemy->typeId = TYPE_SMALL;
    else if(IS_SAME_STR(typeId, "tricky")) enemy->typeId = TYPE_TRICKY;
}

Enemy* enemy_spawn(GameContext *game, const char* typeId){
    Enemy *enemy = (Enemy*)pool_get(game->enemiesPool);
    _setTypeId(enemy, typeId);
    EnemyDefinition *enemyDef = _getEnemyDefinition(enemy->typeId, game->jsonData->enemiesDefinition);
    enemy->isValid = true;
    enemy->imgSrc = enemyDef->imgSrc;
    enemy->size = enemyDef->size;
    enemy->speed = enemyDef->speed;
    enemy->maxHp = enemyDef->maxHp;
    enemy->hp = enemyDef->maxHp;
    enemy->hitDmg = enemyDef->hitDmg;
    enemy->rewardScore = enemyDef->rewardScore;
    enemy->motionKey = enemyDef->motionKey;
    enemy->isAlpha = false;
    if(enemyDef->existAlpha && util_chance(game->jsonData->config->ENEMY->ALPHA_RATE)) _toAlpha(enemy, game->jsonData->config->ENEMY->ALPHA);
    for(uint8_t i = 0; i < 8; i++) enemy->randoms[i] = util_randomRate();
    return enemy;
}

void enemy_remove(GameContext *game, Enemy *enemy){
    enemy->isValid = false;
    pool_release(game->enemiesPool, enemy->id);
}