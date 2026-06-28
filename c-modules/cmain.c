#include "header/framework.h"

// global structures

GameContext *game = NULL;

// functions definition

/**
 * - 新たにゲーム状態を生成します
 * @param enemiesDefinitionJson enemiesDefinition.jsonの文字列
 * @param playerDefinitionJson playerDefinition.jsonの文字列
 * @param configJson config.jsonの文字列
 * @returns ゲーム状態の初期化に成功したらtrue
 */
EMSCRIPTEN_KEEPALIVE
bool initGameContext(const char* enemiesDefinitionJson, const char* playerDefinitionJson, const char* configJson){
    printf("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
    game = malloc(sizeof(GameContext));
    game->jsonData = json_loadAll(enemiesDefinitionJson, playerDefinitionJson, configJson);
    if(!game || !game->jsonData || !game->jsonData->config || !game->jsonData->config->STAGE) return false;
    printf("wwwwwwwwwwwwwwwwwwwwwwwwwwwww");
    game->enemiesPool = pool_newInstance(game->jsonData->config->STAGE->CHARACTERS_CAPACITY, sizeof(Enemy), 0);
    game->bulletsPool = pool_newInstance(game->jsonData->config->STAGE->BULLETS_CAPACITY, sizeof(Bullet), 0);
    game->keyboard = keyboard_newInstance();
    return true;
}

/**
 * - GameContextの参照を取得します
 */
EMSCRIPTEN_KEEPALIVE
GameContext *getGameContextPtr(){
    return game;
}
// Player* createPlayer(){
//     Player* player;
//     return player;
// }