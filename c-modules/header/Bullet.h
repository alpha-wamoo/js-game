#pragma once
#include <stdbool.h>
#include <stdint.h>
#include "GameContext.h"
#include "Vector2.h"
#include "RGB.h"

typedef struct Bullet{
    uint8_t id, ownerId, dmg;
    uint16_t size;
    bool isValid;
    Vector2 pos, vel;
    RGB color;
} Bullet;

typedef enum BulletMemberOffset{
    BULLET_OFFSET_ID = offsetof(Bullet, id),
    BULLET_OFFSET_OWNER_ID = offsetof(Bullet, ownerId),
    BULLET_OFFSET_DMG = offsetof(Bullet, dmg),
    BULLET_OFFSET_SIZE = offsetof(Bullet, size),
    BULLET_OFFSET_IS_VALID = offsetof(Bullet, isValid),
    BULLET_OFFSET_POS = offsetof(Bullet, pos),
    BULLET_OFFSET_VEL = offsetof(Bullet, vel),
    BULLET_OFFSET_COLOR = offsetof(Bullet, color)
} BulletMemberOffset;

/**
 * - Bullet構造体のメンバ変数のオフセットを格納した配列
 * - 配列の要素はBulletMemberOffsetの順番に対応
 */
extern BulletMemberOffset bullet_memberOffsetsAry[];

/**
 * - Bullet構造体のメンバ変数のオフセットを取得するための先頭ポインタを返します
 * @returns ポインタ
 */
int bullet_getMemberOffsetsPtr();

/**
 * - Bullet構造体arrayのポインタを取得します
 * @param game ゲーム状態
 * @returns Bullet構造体arrayのポインタ
 */
int bullet_getPtr(GameContext *game);

/**
 * - Bullet構造体のサイズを取得します
 * @returns Bullet構造体のサイズ
 */
int bullet_getStructSize();