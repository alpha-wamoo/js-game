import type {Vector2} from "Vector2";

export interface Character{
    public props: [
        img: HTMLImageElement,
        pos: Vector2,
        speed: number,
        size: number,
        id: number,
        typeId: string,
        max_hp: number,
        hp: number,
        hitDmg: number,
        bulletDmg: number,
        rewardScore: number,
        frame: number,
        bulletShootableCnt: number,
        posBegin: Vector2,
        randoms: number[6],
        runnableCnt: number,
        magicUsableCnt: number,
        isEnpowered: boolean,
        unbeatableTime: number,
        unbeatableCnt: number,
        isAlpha: boolean,
        motion: (pos: Vector2, speed: number, frame: number) => Vector2,
    ]
}