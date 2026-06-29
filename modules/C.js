/**
 * @typedef {Object} Module
 */

export default class C{
    /**@public @static @type {Module} */
    static cmodule = {};
    static exportedFns = {
		"initGameContext": ["initGameContext", "boolean", ["string", "string", "string"]],
		"keyboard_update": ["keyboard_update", null, ["number", "number", "number"]]
	};
    /**
     * @public @static @method
     * @param {Module} module
    */
    static init(module){
        C.cmodule = module;
        for(const [fnName, args] of Object.entries(C.exportedFns)){
            C[fnName] = module.cwrap(...args);
        }
    }
    static PlayerView = class{
        /**@private @type {DataView} */
        _view;
        /**@private @type {number} */
        _ptr;
        constructor(view, ptr){
            this._view = view;
            this._ptr = ptr;
        }

        get x
    }
};