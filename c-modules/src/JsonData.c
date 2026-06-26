#include "../header/JsonData.h"

/**
 * - jsonを解析してEnemyDefinition構造体参照を返します
 * @param root jsonの最上位ノードを示すcJSON構造体ポインタ
 * @param enemyType 敵の種類を表す文字列
 * @returns 失敗時はNULL
 */
EnemyDefinition *_createEnemyDefinition(cJSON* root, const char *enemyType){
    EnemyDefinition *enemyDefinition = malloc(sizeof(EnemyDefinition));
    cJSON *obj = getNodePtr(root, enemyType);
    if(obj == NULL) return NULL;

    enemyDefinition->existAlpha = getNodePtr(obj, "existAlpha")->valueint;
    enemyDefinition->imgSrc = getNodePtr(obj, "imgSrc")->valuestring;
    enemyDefinition->motionKey = getNodePtr(obj, "motionKey")->valuestring;
    enemyDefinition->speed = getNodePtr(obj, "speed")->valuedouble;
    enemyDefinition->size = getNodePtr(obj, "size")->valueint;
    enemyDefinition->hitDmg = getNodePtr(obj, "hit_dmg")->valueint;
    enemyDefinition->maxHp = getNodePtr(obj, "max_hp")->valueint;
    enemyDefinition->rewardScore = getNodePtr(obj, "rewardScore")->valueint;

    cJSON_Delete(obj);
    return enemyDefinition;
}

/**
 * - jsonを解析してEnemiesDefinition構造体参照を返します
 * @param json json形式の文字列
 * @returns 失敗時はNULL
 */
EnemiesDefinition* _loadEnemiesDefinition(const char *json){
    EnemiesDefinition *enemiesDefinition = malloc(sizeof(EnemiesDefinition));
    cJSON *root = cJSON_Parse(json);
    if(root == NULL) return NULL;

    enemiesDefinition->basic = _createEnemyDefinition(root, "basic");
    enemiesDefinition->tough = _createEnemyDefinition(root, "tough");
    enemiesDefinition->small = _createEnemyDefinition(root, "small");
    enemiesDefinition->tricky = _createEnemyDefinition(root, "tricky");

    cJSON_Delete(root);
    return enemiesDefinition;
}

/**
 * - jsonを解析してPlayerDefinition構造体参照を返します
 * @param json json形式の文字列
 * @returns 失敗時はNULL
 */
PlayerDefinition* _loadPlayerDefinition(const char *json){
    PlayerDefinition *playerDefinition = malloc(sizeof(PlayerDefinition));
    cJSON *root = cJSON_Parse(json);
    if(root == NULL) return NULL;

    playerDefinition->bltDmg = getNodePtr(root, "bltDmg")->valueint;
    playerDefinition->imgSrc = getNodePtr(root, "imgSrc")->valuestring;
    playerDefinition->maxHp = getNodePtr(root, "max_hp")->valueint;
    playerDefinition->size = getNodePtr(root, "size")->valueint;
    playerDefinition->speed = getNodePtr(root, "speed")->valueint;
    playerDefinition->unbeatableTime = getNodePtr(root, "unbeatableTime")->valueint;

    cJSON *beginPos = getNodePtr(root, "beginPos");
    playerDefinition->beginPosX = getNodePtr(beginPos, "x")->valueint;
    playerDefinition->beginPosY = getNodePtr(beginPos, "y")->valueint;
    cJSON_Delete(beginPos);

    cJSON_Delete(root);
    return playerDefinition;
}

/**
 * - jsonを解析してRGB構造体参照を返します
 * @param parent RGB構造体の親ノード
 * @return 生成されたRGB構造体参照. 失敗時はNULL
 */
RGB *_createRGBFromJson(cJSON *parent){
    RGB *rgb = malloc(sizeof(RGB));
    cJSON *rgbNode = getNodePtr(parent, "RGB");
    if(rgbNode == NULL) return NULL;

    rgb->r = getNodePtr(rgbNode, "R")->valueint;
    rgb->g = getNodePtr(rgbNode, "G")->valueint;
    rgb->b = getNodePtr(rgbNode, "B")->valueint;

    cJSON_Delete(rgbNode);
    return rgb;
}

/**
 * - jsonを解析してConfig構造体参照を返します
 * @param json json形式の文字列
 * @returns 失敗時はNULL
 */
Config *_loadConfig(const char *json){
    Config *config = malloc(sizeof(Config));
    cJSON *root = cJSON_Parse(json);
    if(root == NULL) return NULL;

    config->CANV_H = getNodePtr(root, "CANV_H")->valueint;
    config->CANV_W = getNodePtr(root, "CANV_W")->valueint;

    cJSON *bullet = getNodePtr(root, "BULLET");
    config->BULLET->RGB = _createRGBFromJson(bullet);
    config->BULLET->SIZE = getNodePtr(bullet, "SIZE")->valueint;
    config->BULLET->SPEED = getNodePtr(bullet, "SPEED")->valueint;
    config->BULLET->SHOOTABLE_INTERVAL_SEC = getNodePtr(bullet, "SHOOTABLE_INTERVAL_SEC")->valuedouble;
    cJSON_Delete(bullet);

    cJSON *enpoweredBullet = getNodePtr(root, "ENPOWERED_BULLET");
    config->ENPOWERED_BULLET->RGB = _createRGBFromJson(enpoweredBullet);
    config->ENPOWERED_BULLET->SIZE = getNodePtr(enpoweredBullet, "SIZE")->valueint;
    config->ENPOWERED_BULLET->SPEED = getNodePtr(enpoweredBullet, "SPEED")->valueint;
    config->ENPOWERED_BULLET->SHOOTABLE_INTERVAL_SEC = getNodePtr(enpoweredBullet, "SHOOTABLE_INTERVAL_SEC")->valuedouble;
    cJSON_Delete(enpoweredBullet);

    cJSON *NaturalHeal = getNodePtr(root, "NATURAL_HEAL");
    config->NATURAL_HEAL->HP = getNodePtr(NaturalHeal, "HP")->valueint;
    config->NATURAL_HEAL->INTERVAL = getNodePtr(NaturalHeal, "NATURAL_HEAL")->valueint;
    cJSON_Delete(NaturalHeal);

    cJSON *enemy = getNodePtr(root, "ENEMY");
    config->ENEMY->ALPHA_RATE = getNodePtr(enemy, "ALPHA_RATE")->valuedouble;
    cJSON *enemyAlpha = getNodePtr(enemy, "ALPHA");
    config->ENEMY->ALPHA->DMG_RATE = getNodePtr(enemyAlpha, "DMG_RATE")->valuedouble;
    config->ENEMY->ALPHA->HP_RATE = getNodePtr(enemyAlpha, "HP_RATE")->valuedouble;
    config->ENEMY->ALPHA->REWARD_RATE = getNodePtr(enemyAlpha, "REWARD_RATE")->valuedouble;
    config->ENEMY->ALPHA->SIZE_RATE = getNodePtr(enemyAlpha, "SIZE_RATE")->valuedouble;
    config->ENEMY->ALPHA->SPEED_RATE = getNodePtr(enemyAlpha, "SPEED_RATE")->valuedouble;
    cJSON_Delete(enemyAlpha);
    cJSON_Delete(enemy);

    cJSON *stage = getNodePtr(root, "STAGE");
    config->STAGE->BULLETS_CAPACITY = getNodePtr(stage, "BULLETS_CAPACITY")->valueint;
    config->STAGE->CHARACTERS_CAPACITY = getNodePtr(stage, "STAGE_CAPACITY")->valueint;
    config->STAGE->CELL_SIZE = getNodePtr(stage, "CELL_SIZE")->valueint;
    cJSON_Delete(stage);

    cJSON_Delete(root);
    return config;
}

JSON_LOADED_RESULT loadAllJsons(const char *enemiesDefinitionJson, const char *playerDefinitionJson, const char *configJson){
    EnemiesDefinition *enemiesDefinition = _loadEnemiesDefinition(enemiesDefinitionJson);
    PlayerDefinition *playerDefinition = _loadPlayerDefinition(playerDefinitionJson);
    Config *config = _loadConfig(configJson);
    if(enemiesDefinition == NULL || playerDefinition == NULL || configJson == NULL) return JSON_LOADED_FAILURE;

    jsonData = malloc(sizeof(JsonData));
    jsonData->enemiesDefinition = enemiesDefinition;
    jsonData->playerDefinition = playerDefinition;
    jsonData->config = config;
    return JSON_LOADED_SUCCESS;
}