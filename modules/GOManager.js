/**@module GOManager */

/**
 * 
 * @typedef {{[name: string]: {type: number, offset: number, bytes: number}}} ElementStructs
 * 
 */

// 敵の移動、hp増減、当たり判定
/**
 * @class
 * @template T
 */
export default class GOManager{
    /**@private @type {number[]} */
    _freeIdStack = null;
    /**@private @type {ElementStructs} */
    _elements = null;
    /**@private @type {string[]} */
    _propNames = null;
    /**@private @type {number} */
    _bytesOfElement = null;
    /**@private @type {number} */
    _maxLength = null;
    /**@private @type {ArrayBuffer} */
    _buffer;
    /**@private @type {DataView} */
    _view;


    /**
     * elementsにはisValidを含める必要があります
     * @constructor
     * @param {number} bytesOfElem
     * @param {number} maxLength
     * @param {ElementStructs} elements
     */
    constructor(maxLength, elements){
        this._elements = elements;
        this._propNames = Object.keys(elements);
        this._maxLength = maxLength;

        this._freeIdStack = [];
        for(let id = 0; id < maxLength; id++) this._freeIdStack.push(id);

        this._bytesOfElement = 0;
        for(const {bytes} of Object.values(elements)) this._bytesOfElement += bytes;

        this._buffer = new ArrayBuffer(this._bytesOfElement * maxLength);
        this._view = new DataView(this._buffer);
    }

    /**
     * バッファー参照を返します
     * @returns {ArrayBuffer}
     */
    getBuffer(){
        return this._buffer;
    }

    /**
     * 指定の場所に書き込みます
     * @param {number} id
     * @param {string} propName 
     * @param {T[propName]} value 
     */
    write(id, propName, value){
        const base = id * this._bytesOfElement;
        const {type, offset} = this._elements[propName];
        this._view[`set${type}`](base + offset, value)
        // const id = this._view.setUint8(base + 0); // 1B
        // const posX = this._view.setFloat32(base + 1) // 4B
        // const posY = this._view.setFloat32(base + 5) // 4B
        // const size = this._view.setUint8(base + 9) // 1B
    }

    /**
     * 指定の場所を読み込みます
     * @param {number} id
     * @param {string} propName 
     * @returns {T[propName]} value
     */
    read(id, propName){
        const base = id * this._bytesOfElement;
        const {type, offset} = this._elements[propName];
        return this._view[`set${type}`](base + offset);
    }

    /**
     * 新たに生成します
     * @param {T} initialData 
     */
    create(initialData){
        const id = this._freeIdStack.pop();
        if(!id) console.log("これ以上の構造体を生成できません.");
        for(const propName of this._propNames) this.write(id, propName, initialData[propName]);
        this.write(id, "isValid", 1);
        return id;
    }

    /**
     * 削除します
     * @param {number} id 
     */
    remove(id){
        this._freeIdStack.push(id);
        this.write(id, "isValid", 0);
    }

    /**
     * 各要素に関数を実行します.
     * @param {(id: number, thisManager: GOManager<T>, view: DataView)} callback 
     * @returns 
     */
    forEach(callback){
        for(let id = 0; id < this._maxLength; id++){
            if(!this.read(id, "isValid")) return;
            callback(id, this, this._view);
        }
    }
}