/**@module WorkManager */

/**
 * @typedef {keyof typeof WorkManager._workers} WorkKey - Workerを管理する文字列です
 */

/**
 * Workerを起動し、メッセージの送受信を行います.
 * @class
 * @template T
 */
export default class WorkManager{
    /**@private @static @enum {Worker} */
    static _workers = {
        "HittingDetector": new Worker("./modules/worker/HittingDetector.js", { type: "module" })
    };

    /** @private @static @type {number} */
    static _nextRequestId = 0;

    /** @private @static @type {Map<number, Function>} */
    static _callbacks = new Map();

    /**
     * Workerを取得します.
     * @public @static @method
     * @param {WorkKey} key - キー
     * @returns {Worker?} 存在しなければnull.
     */
    static get(key){
        return this._workers[key];
    }

    /**
     * Workerからの返信を受け取り、対応するコールバックを実行します.
     * @private @static @method
     * @param {MessageEvent<T>} ev
     */
    static _handleWorkerMessage(ev){
        const { requestId, payload } = ev.data ?? {};
        if(requestId == null) return;

        const callback = this._callbacks.get(requestId);
        if(!callback) return;

        callback({ data: payload });
        this._callbacks.delete(requestId);
    }

    /**
     * Workerにメッセージを送信し、メッセージの受け取り時に与えた処理を実行します.
     * @public @static @method
     * @param {WorkKey} key - キー
     * @param {T} msg - Workerに送信するメッセージ
     * @param {((this: Worker, ev: MessageEvent<T>) => any)?} onMessageReplied - Workerからメッセージ受信時の処理
     */
    static activate(key, msg, onMessageReplied){
        const worker = this.get(key);
        if(!worker.onmessage) worker.onmessage = this._handleWorkerMessage.bind(this);

        const requestId = ++this._nextRequestId;
        this._callbacks.set(requestId, onMessageReplied);
        worker.postMessage({ ...msg, requestId });
    }

    /**
     * Workerを終了します.
     * @public @static @method
     * @param {WorkKey} key - キー
     */
    static terminate(key){
        this.get(key).terminate();
    }
}