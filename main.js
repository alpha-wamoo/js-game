/// <reference path="./types/emscripten.d.ts" />

import {Game, Stage, Util, JsonData, C} from "./modules.js";
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
	const cFunctions = {
		"initGameContext": ["initGameContext", "boolean", ["string", "string", "string"]]
	};

	Object.entries(cFunctions).forEach(([fnName, args]) => {
		C[fnName] = Module.cwrap(...args);
	});

	console.log("initializing C processes...");
	const isSuccessed = C.initGameContext(
		Module.allocateUTF8(await (await fetch("./json/enemiesDefinition.json")).text()),
		Module.allocateUTF8(await (await fetch("./json/playerDefinition.json")).text()),
		Module.allocateUTF8(await (await fetch("./json/config.json")).text())
	);
	if(!isSuccessed) console.warn("failure...............");
	else console.log("C processes were completely initialized.");
});

window.onload = async () => {
	await JsonData.initAll();
	await initC();

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