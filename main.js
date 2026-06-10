import {Game, Stage, CANV_SIZE} from "./modules.js";

window.onload = () => {
	/**@type {HTMLCanvasElement} */
	const canv = document.getElementById("gamecanvas");
	const stage = new Stage({ min: {x:0, y:0}, max: {x:CANV_SIZE, y:CANV_SIZE} });
	const game = new Game(canv, stage);

	setTimeout(() => {
		game.start();
	}, 3 * 1000);
};
