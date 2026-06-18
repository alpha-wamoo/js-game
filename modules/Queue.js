/**@module Queue */
/**
 * @class
 * @template Item
 */
export default class Queue{
    /**
     * キューのデータ
     * @private @type {Item[]}
    */
    _items = null;

    /**
     * @constructor
     * @param {Item[]?} preset
     */
    constructor(preset = []){
        this._items = preset;
    }

    /**
     * エンキューします
     * @public @method
     * @param {Item} item
     */
    enqueue(item){
        this._items.push(item);
    }

    /**
     * デキューします
     * @public @method
     * @returns {Item?} 取り出した要素. 空ならばnull.
     */
    dequeue(){
        if(this.isEmpty()) return null;
        return this._items.shift();
    }

    /**
     * 先頭の要素を非破壊的に取得します.
     * @public @method
     * @returns {Item?} 先頭の要素. 空ならばnull.
     */
    peek(){
        if(this.isEmpty())  return null
        return this._items[0];
    }

    /**
     * キューが空であることを判定します
     * @public @method
     * @returns {boolean} キューが空ならばtrue
     */
    isEmpty(){
        return this._items.length === 0;
    }

    /**
     * キューをクリアします
     * @public @method
     */
    clear(){
        this._items.length = 0;
    }

    /**
     * キューの要素数
     * @public @method
     * @type {number}
     */
    get length(){
        return this._items.length;
    }

    /**
     * キューの配列データ
     * @public @method
     * @type {Item[]}
     */
    get items(){
        return this._items;
    }

    /**
     * @public @method
     * @param {Item[]} items
     */
    setItems(items){
        this._items = items;
    }
}