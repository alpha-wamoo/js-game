#include "../header/Pool.h"


Pool *pool_newInstance(const uint8_t capacity, const uint16_t bytesOfElem, const uint8_t idOffset){
    Pool *pool = malloc(capacity * bytesOfElem);
    pool->elemSize = bytesOfElem;
    pool->capacity = capacity;
    pool->idOffset = idOffset;
    pool->buff = malloc(pool->capacity * bytesOfElem);
    pool->freeIdStack = malloc(pool->capacity * sizeof(uint8_t));
    pool->freeIdsLength = capacity;
    for(uint8_t i = 0; i < pool->capacity; i++){
        pool->freeIdStack[i] = i;
        uint8_t *idPtr = (uint8_t*)pool->buff + i * bytesOfElem + idOffset;
        *idPtr = i;
    }
    return pool;
}

void *pool_getById(Pool *pool, const uint8_t id){
    if(id < pool->capacity) return (void*)((uint8_t*)pool->buff + id * pool->elemSize);
    return NULL;
}

void *pool_get(Pool *pool){
    if(pool->freeIdsLength == 0) return NULL;

    uint8_t freeId = pool->freeIdStack[--pool->freeIdsLength];
    return pool_getById(pool, freeId);
}

PoolReleaseResult pool_release(Pool *pool, const uint8_t id){
    if(pool->capacity <= id) return POOL_RELEASE_FAILURE;
    pool->freeIdStack[pool->freeIdsLength++] = id;
    return POOL_RELEASE_SUCCESS;
}