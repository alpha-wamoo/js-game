/// <reference path="./types/emscripten.d.ts" />

import {Game, Stage, Util, JsonData, C, Keyboard} from "./modules.js";
import createModule from "./cmodules.js";

const canvs = {
	bg: loadCanvas("bg"),
	object: loadCanvas("object"),
	ui: loadCanvas("ui")
};

const contexts = {
	bg: loadContext(canvs.bg),
	object: loadContext(canvs.object),
	ui: loadContext(canvs.ui)
};


createModule().then(async Module => {
	C.init(Module);

	console.log("C: initializing...");
	if(C.initGameContext(
		await (await fetch("./json/enemiesDefinition.json")).text(),
		await (await fetch("./json/playerDefinition.json")).text(),
		await (await fetch("./json/config.json")).text(),
		await (await fetch("./json/skillDefinition.json")).text()
	)) console.log("ゲーム状態の初期化に成功しました.");

	/**@type {number} */
	C.gameContextPtr = Module._getGameContextPtr();
	Keyboard.init();
	console.log("C: initialized.");
});

window.onload = async () => {
	await JsonData.initAll();

	const {CANV_W, CANV_H} = JsonData.config;
	const stage = new Stage({ min: {x:0, y:0}, max: {x:CANV_W, y:CANV_H} });
	const game = await Game.init(canvs, contexts, stage);

	setTimeout(() => game.start(), 2 * 1000);
};


/**
 * idをもとにHTMLからコンテクストを取得します
 * @param {string} id 
 * @returns {CanvasRenderingContext2D | null} 
 */
function loadContext(canv){
	if(canv instanceof HTMLCanvasElement) return canv.getContext("2d");
	return null;
}

function loadCanvas(id){
	return document.getElementById(id);
}