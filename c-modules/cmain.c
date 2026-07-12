#include "header/framework.h"

// global structures

GameContext *game = NULL;

// functions definition

/**
 * - 新たにゲーム状態を生成します
 * @param enemiesDefinitionJson enemiesDefinition.jsonの文字列
 * @param playerDefinitionJson playerDefinition.jsonの文字列
 * @param configJson config.jsonの文字列
 * @param skillDefinitionJson skillDefinition.jsonの文字列
 * @returns ゲーム状態の初期化に成功したらtrue
 */
EMSCRIPTEN_KEEPALIVE
bool initGameContext(const char* enemiesDefinitionJson, const char* playerDefinitionJson, const char* configJson, const char* skillDefinitionJson){
    cdb_call(__func__);
    game = malloc(sizeof(GameContext));
    game->jsonData = json_loadAll(enemiesDefinitionJson, playerDefinitionJson, configJson, skillDefinitionJson);
    if(!game || !game->jsonData || !game->jsonData->config || !game->jsonData->config->STAGE) return false;

    game->enemiesPool = pool_newInstance(game->jsonData->config->STAGE->CHARACTERS_CAPACITY, sizeof(Enemy), 0);
    game->bulletsPool = pool_newInstance(game->jsonData->config->STAGE->BULLETS_CAPACITY, sizeof(Bullet), 0);
    game->keyboard = keyboard_newInstance();
    if(!game->enemiesPool || !game->bulletsPool || !game->keyboard) return false;

    cdb_exit(__func__);
    return true;
}

/**
 * - GameContextの参照を取得します
 */
EMSCRIPTEN_KEEPALIVE
GameContext *getGameContextPtr(){
    return game;
}