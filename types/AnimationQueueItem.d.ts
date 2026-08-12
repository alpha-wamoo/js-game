/**
 * @import {Vector2} from "./Vector2"
 */

import type {Vector2} from "Vector2"

export interface AnimationQueueItem{
    key: string;
    dest: Vector2;
    aniOptions?: {
        cntFrom?: number;
        scale?: number;
        speed?: number;
    };
};