#pragma once
#include <stdint.h>
#include <stdlib.h>
#include <stdio.h>

typedef struct Pool{
    void *buff;
    uint8_t capacity;
    uint8_t *freeIdStack;
    uint16_t elemSize, idOffset;
    uint8_t freeIdsLength;
} Pool;

typedef enum PoolReleaseResult{
    POOL_RELEASE_FAILURE = 0,
    POOL_RELEASE_SUCCESS = 1
} PoolReleaseResult;

/**
 * - プールの実態を生成します
 * @param capacity プールの要素数
 * @param bytesOfElem 要素当たりのバイト数
 * @param idOffset 構造体の先頭アドレスからidメンバへのオフセット
 * @returns 生成されたPoolインスタンス
 */
Pool *pool_newInstance(const uint8_t capacity, const uint16_t bytesOfElem, const uint8_t idOffset);

/**
 * - プールから使用可能なオブジェクトの参照を取得します
 * @param pool オブジェクトのプール
 * @returns オブジェクトの参照(void*). 取得失敗時はNULL.
 */
void *pool_get(Pool* pool);

/**
 * - プールから特定のidのオブジェクトの参照を取得します
 * @param pool オブジェクトのプール
 * @param id オブジェクトのid
 * @returns オブジェクトの参照(void*). 無効なidにはNULL.
 */
void *pool_getById(Pool* pool, const uint8_t id);

/**
 * - 使用しないオブジェクトをプールに解放します
 * @param pool プール
 * @param id オブジェクトのid
 * @returns idが有効ならばPOOL_RELEASE_SUCCESS. 無効ならばPOOL_RELEASE_FAILURE
 */
PoolReleaseResult pool_release(Pool *pool, const uint8_t id);