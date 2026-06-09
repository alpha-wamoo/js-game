const _keysList = {};
export default {
    keysPressed: _keysList,
    /**
     * @param {GlobalEventHandlers} ev 
     */
    keydown(ev){
        _keysList[ev.key.toLowerCase()] = true;
    },
    /**
     * @param {GlobalEventHandlers} ev
     */
    keyup(ev){
        _keysList[ev.key.toLowerCase()] = false;
    }
}