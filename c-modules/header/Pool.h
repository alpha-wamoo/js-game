#pragma once
#include <stdint.h>
#include <stdlib.h>

typedef struct Pool{
    void *buff;
    uint8_t capacity;
    uint8_t *freeIdStack;
} Pool;

#define initPool(POOL_PTR, TYPE, CAPACITY) ({ \
    (POOL_PTR)->capacity = (CAPACITY); \
    (POOL_PTR)->buff = malloc((POOL_PTR)->capacity * sizeof(TYPE)); \
    (POOL_PTR)->freeIdStack = malloc((POOL_PTR)->capacity * sizeof(TYPE)); \
    for(int i = 0; i < (POOL_PTR)->capacity; i++){ \
        *((POOL_PTR)->freeIdStack + i) = i; \
        ((TYPE*)((POOL_PTR)->buff) + i)->id = i; \
    } \
})