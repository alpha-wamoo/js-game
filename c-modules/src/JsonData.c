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
    if(!obj) return NULL;

    // root/[enemyType]/*
    enemyDefinition->existAlpha = getNodePtr(obj, "existAlpha")->valueint;
    enemyDefinition->imgSrc = getNodePtr(obj, "imgSrc")->valuestring;
    enemyDefinition->motionKey = getNodePtr(obj, "motionKey")->valuestring;
    enemyDefinition->speed = getNodePtr(obj, "speed")->valuedouble;
    enemyDefinition->size = getNodePtr(obj, "size")->valueint;
    enemyDefinition->hitDmg = getNodePtr(obj, "hit_dmg")->valueint;
    enemyDefinition->maxHp = getNodePtr(obj, "max_hp")->valueint;
    enemyDefinition->rewardScore = getNodePtr(obj, "rewardScore")->valueint;

    return enemyDefinition;
}

/**
 * - jsonを解析してEnemiesDefinition構造体参照を返します
 * @param json json形式の文字列
 * @returns 失敗時はNULL
 */
EnemiesDefinition* _loadEnemiesDefinition(const char *json){
    cdb_call(__func__);
    EnemiesDefinition *enemiesDefinition = malloc(sizeof(EnemiesDefinition));
    cJSON *root = cJSON_Parse(json);
    if(!root) return NULL;

    enemiesDefinition->basic = _createEnemyDefinition(root, "basic");
    enemiesDefinition->tough = _createEnemyDefinition(root, "tough");
    enemiesDefinition->small = _createEnemyDefinition(root, "small");
    enemiesDefinition->tricky = _createEnemyDefinition(root, "tricky");

    cJSON_Delete(root);
    if(!enemiesDefinition->basic || !enemiesDefinition->tough || !enemiesDefinition->small || !enemiesDefinition->tricky) return NULL;
    cdb_exit(__func__);
    return enemiesDefinition;
}

/**
 * - jsonを解析してPlayerDefinition構造体参照を返します
 * @param json json形式の文字列
 * @returns 失敗時はNULL
 */
PlayerDefinition* _loadPlayerDefinition(const char *json){
    cdb_call(__func__);
    PlayerDefinition *playerDefinition = malloc(sizeof(PlayerDefinition));
    cJSON *root = cJSON_Parse(json);
    if(!root) return NULL;

    // root/*
    playerDefinition->bltDmg = getNodePtr(root, "bltDmg")->valueint;
    playerDefinition->imgSrc = getNodePtr(root, "imgSrc")->valuestring;
    playerDefinition->maxHp = getNodePtr(root, "max_hp")->valueint;
    playerDefinition->size = getNodePtr(root, "size")->valueint;
    playerDefinition->speed = getNodePtr(root, "speed")->valueint;
    playerDefinition->unbeatableTime = getNodePtr(root, "unbeatableTime")->valuedouble;

    // root/beginPos/*
    cJSON *beginPos = getNodePtr(root, "beginPos");
    if(!beginPos) return NULL;
    playerDefinition->beginPosX = getNodePtr(beginPos, "x")->valueint;
    playerDefinition->beginPosY = getNodePtr(beginPos, "y")->valueint;

    cJSON_Delete(root);
    cdb_exit(__func__);
    return playerDefinition;
}

/**
 * - jsonを解析してRGB構造体参照を返します
 * @param parent RGB構造体の親ノード
 * @return 生成されたRGBインスタンス. 失敗時はNULL
 */
RGB *_createRGBFromJson(cJSON *parent){
    RGB *rgb = malloc(sizeof(RGB));
    cJSON *rgbNode = getNodePtr(parent, "RGB");
    if(!rgbNode) return NULL;

    // [parent]/RGB/*
    rgb->r = getNodePtr(rgbNode, "R")->valueint;
    rgb->g = getNodePtr(rgbNode, "G")->valueint;
    rgb->b = getNodePtr(rgbNode, "B")->valueint;

    return rgb;
}

/**
 * - jsonを解析してConfig構造体参照を返します
 * @param json json形式の文字列
 * @returns 失敗時はNULL
 */
Config *_loadConfig(const char *json){
    cdb_call(__func__);
    Config *config = malloc(sizeof(Config));
    cJSON *root = cJSON_Parse(json);
    if(!config || !root) return NULL;

    // root/*
    config->CANV_H = getNodePtr(root, "CANV_H")->valueint;
    config->CANV_W = getNodePtr(root, "CANV_W")->valueint;

    // root/BULLET/*
    cJSON *bullet = getNodePtr(root, "BULLET");
    if(!bullet) return NULL;
    config->BULLET = malloc(sizeof(struct ConfigBullet));
    config->BULLET->RGB = *_createRGBFromJson(bullet);
    config->BULLET->SIZE = getNodePtr(bullet, "SIZE")->valueint;
    config->BULLET->SPEED = getNodePtr(bullet, "SPEED")->valueint;
    config->BULLET->SHOOTABLE_INTERVAL_SEC = getNodePtr(bullet, "SHOOTABLE_INTERVAL_SEC")->valuedouble;

    // root/ENPOWERED_BULLET/*
    cJSON *enpoweredBullet = getNodePtr(root, "ENPOWERED_BULLET");
    if(!enpoweredBullet) return NULL;
    config->ENPOWERED_BULLET = malloc(sizeof(struct ConfigBullet));
    config->ENPOWERED_BULLET->RGB = *_createRGBFromJson(enpoweredBullet);
    config->ENPOWERED_BULLET->SIZE = getNodePtr(enpoweredBullet, "SIZE")->valueint;
    config->ENPOWERED_BULLET->SPEED = getNodePtr(enpoweredBullet, "SPEED")->valueint;
    config->ENPOWERED_BULLET->SHOOTABLE_INTERVAL_SEC = getNodePtr(enpoweredBullet, "SHOOTABLE_INTERVAL_SEC")->valuedouble;

    // root/NATURAL_HEAL/*
    cJSON *naturalHeal = getNodePtr(root, "NATURAL_HEAL");
    if(!naturalHeal) return NULL;
    config->NATURAL_HEAL = malloc(sizeof(struct ConfigNaturalHeal));
    config->NATURAL_HEAL->HP = getNodePtr(naturalHeal, "HP")->valueint;
    config->NATURAL_HEAL->INTERVAL = getNodePtr(naturalHeal, "NATURAL_HEAL")->valueint;

    // root/ENEMY/*
    cJSON *enemy = getNodePtr(root, "ENEMY");
    if(!enemy) return NULL;
    config->ENEMY = malloc(sizeof(struct ConfigEnemy));
    config->ENEMY->ALPHA_RATE = getNodePtr(enemy, "ALPHA_RATE")->valuedouble;
    // root/ENEMY/ALPHA/*
    cJSON *enemyAlpha = getNodePtr(enemy, "ALPHA");
    if(!enemyAlpha) return NULL;
    config->ENEMY->ALPHA = malloc(sizeof(struct ConfigEnemyAlpha));
    config->ENEMY->ALPHA->DMG_RATE = getNodePtr(enemyAlpha, "DMG_RATE")->valuedouble;
    config->ENEMY->ALPHA->HP_RATE = getNodePtr(enemyAlpha, "HP_RATE")->valuedouble;
    config->ENEMY->ALPHA->REWARD_RATE = getNodePtr(enemyAlpha, "REWARD_RATE")->valuedouble;
    config->ENEMY->ALPHA->SIZE_RATE = getNodePtr(enemyAlpha, "SIZE_RATE")->valuedouble;
    config->ENEMY->ALPHA->SPEED_RATE = getNodePtr(enemyAlpha, "SPEED_RATE")->valuedouble;

    // root/STAGE/*
    cJSON *stage = getNodePtr(root, "STAGE");
    if(!stage) return NULL;
    config->STAGE = malloc(sizeof(struct ConfigStage));
    config->STAGE->BULLETS_CAPACITY = getNodePtr(stage, "BULLETS_CAPACITY")->valueint;
    config->STAGE->CHARACTERS_CAPACITY = getNodePtr(stage, "STAGE_CAPACITY")->valueint;
    config->STAGE->CELL_SIZE = getNodePtr(stage, "CELL_SIZE")->valueint;

    cJSON_Delete(root);
    cdb_exit(__func__);
    return config;
}

/**
 * - jsonを解析してSkillDefinition構造体参照を返します
 * @param json 解析するjson文字列
 * @returns 失敗時はNULL.
 */
SkillDefinition *_loadSkillDefinition(const char *json){
    cdb_call(__func__);
    SkillDefinition *def = malloc(sizeof(SkillDefinition));
    cJSON *root = cJSON_Parse(json);
    if(!root){
        cwarn("!root");
        return NULL;
    }

    // root/RUN_FASTER/*
    cJSON *runFaster = getNodePtr(root, "RUN_FASTER");
    if(!runFaster) return NULL;
    def->RUN_FASTER = malloc(sizeof(struct SkillDefinitionRunFaster));
    def->RUN_FASTER->SPEED_RATE = getNodePtr(runFaster, "SPEED_RATE")->valuedouble;
    def->RUN_FASTER->DURATION = getNodePtr(runFaster, "DURATION")->valueint;
    def->RUN_FASTER->INTERVAL = getNodePtr(runFaster, "INTERVAL")->valueint;
    def->RUN_FASTER->CNT_UPDATE_INTERVAL = getNodePtr(runFaster, "CNT_UPDATE_INTERVAL")->valueint;

    // root/MAGIC/*
    cJSON *magic = getNodePtr(root, "MAGIC");
    if(!magic) return NULL;
    def->MAGIC = malloc(sizeof(struct SkillDefinitionMagic));
    def->MAGIC->ATK_REACH = getNodePtr(magic, "ATK_REACH")->valueint;
    def->MAGIC->BUFF_DELAY_SEC = getNodePtr(magic, "BUFF_DELAY_SEC")->valuedouble;
    def->MAGIC->BUFF_DURATION_SEC = getNodePtr(magic, "BUFF_DURATION_SEC")->valuedouble;
    def->MAGIC->CNT_UPDATE_INTERVAL = getNodePtr(magic, "CNT_UPDATE_INTERVAL")->valueint;
    def->MAGIC->DAMAGE = getNodePtr(magic, "DAMAGE")->valueint;
    def->MAGIC->INTERVAL = getNodePtr(magic, "INTERVAL")->valueint;
    def->MAGIC->SPEED_RATE = getNodePtr(magic, "SPEED_RATE")->valuedouble;

    cJSON_Delete(root);
    cdb_exit(__func__);
    return def;
}

JsonData *json_loadAll(const char *enemiesDefinitionJson, const char *playerDefinitionJson, const char *configJson, const char *skillDefinitionJson){
    cdb_call(__func__);
    EnemiesDefinition *enemiesDefinition = _loadEnemiesDefinition(enemiesDefinitionJson);
    PlayerDefinition *playerDefinition = _loadPlayerDefinition(playerDefinitionJson);
    Config *config = _loadConfig(configJson);
    SkillDefinition *skillDefinition = _loadSkillDefinition(skillDefinitionJson);
    if(!enemiesDefinition || !playerDefinition || !config || !skillDefinition) return NULL;

    JsonData *jsonData = malloc(sizeof(JsonData));
    if(!jsonData) return NULL;
    jsonData->enemiesDefinition = enemiesDefinition;
    jsonData->playerDefinition = playerDefinition;
    jsonData->config = config;
    jsonData->skillDefinition = skillDefinition;

    cdb_exit(__func__);
    return jsonData;
}