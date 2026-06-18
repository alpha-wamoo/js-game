/**@module ObjectPool */
/**
 * - 使用されたオブジェクトの参照を管理し、生成の代わりに参照を使いまわします.
 * - Character, Bulletを生成又は削除したい場合、new, deleteは使わないでください
 * @example
 * const fishPool = new ObjectPool(100, () => new Fish()); // new Fish()を初期値としてサイズ100のプールを生成
 * const fish = fishPool.get(); // 使われていない参照を取得
 * fish.reset(size, weight) // Fishクラスにリセット用メソッドを実装
 * @class
 * @template T
 */
export default class ObjectPool{
    /**@private @type {T[]?} */
    _buffer = null;
    /**@private @type {number} */
    _capacity = 0;
    /**@private @type {number[]?} */
    _freeStack = [];

    /**
     * @constructor
     * @param {number} capacity 
     * @param {(id: number) => T} presetCreater 
     */
    constructor(capacity, presetCreater){
        this._capacity = capacity;
        this._buffer = new Array(capacity);

        for(let i = 0; i < capacity; i++){
            this._buffer[i] = presetCreater(i);
            this._freeStack.push(i);
        }
    }

    /**
     * プールから使用可能なオブジェクト参照を取得します.
     * @public @method
     * @returns {T}
     */
    get(){
        if(this._freeStack.length === 0) return null;
        const idx = this._freeStack.pop();
        return this._buffer[idx];
    }

    /**
     * プールからインデックスを指定して参照を取り出します
     * @public @method
     * @param {number} idx 
     * @returns {T}
     */
    getByIdx(idx){
        if(idx < 0 || idx >= this._capacity) return null;
        if(this._freeStack.includes(idx)) return null;
        return this._buffer[idx];
    }

    /**
     * 使用後のオブジェクト参照を戻します.
     * @public @method
     * @param {T} obj 戻すオブジェクト
     * @returns {boolean} 一致する参照がプール中に見つかったか
     */
    release(obj){
        const idx = this._buffer.indexOf(obj);
        if(idx === -1) return false;

        this._freeStack.push(idx);
        return true;
    }
}