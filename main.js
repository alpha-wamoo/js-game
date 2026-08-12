import {Game, Stage, Util, JsonData, Keyboard} from "./modules.js";

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