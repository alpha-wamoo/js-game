import Player from "./modules/Player.js";
import keydown from "./modules/keydown.js";

const FPS = 60;
const MILISEC_PER_FRAME = 1000 / FPS;
const SEC_PER_FRAME = 1 / FPS;
const CANV_SIZE = 1024;
/**@type {HTMLCanvasElement | null} */
let canvas;
/**@type {CanvasRenderingContext2D | null} */
let ctx;
/**@type {Player | null} */
let pl;

console.log("js is run.");
window.onload = () => {
	console.log("onload is run.");
	/**@type {HTMLCanvasElement | null} */
	canvas = document.getElementById("gamecanvas");
	ctx = canvas?.getContext("2d");
	init();
	document.onkeydown = keydown;
	setInterval(gameloop, MILISEC_PER_FRAME);
};

function init(){
	pl = new Player({ x: 100, y: 400 });
	pl.setImage("./dalmatian.png");
}

function gameloop(){
	update();
	draw();
}

function update(){

}

function draw(){
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, CANV_SIZE, CANV_SIZE);

	ctx.drawImage(pl.img, pl.pos.x - pl.img.width/2, pl.pos.y - pl.img.height/2);
}
