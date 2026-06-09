import Character from "./modules/Character.js";
import Keyboard from "./modules/Keyboard.js";
import {FPS, CANV_SIZE, MILISEC_PER_FRAME} from "./modules/constants.js";

/**@type {Character | null} */
const pl = new Character("./dalmatian.png", { x: 100, y: 400 }, CANV_SIZE/8).setSpeed(CANV_SIZE/4);
/**@type {HTMLCanvasElement | null} */
let canvas;
/**@type {CanvasRenderingContext2D | null} */
let ctx;

window.onload = () => {
	/**@type {HTMLCanvasElement | null} */
	canvas = document.getElementById("gamecanvas");
	ctx = canvas?.getContext("2d");
	init();
	requestAnimationFrame(gameLoop);
};

function init(){
	document.onkeydown = Keyboard.keydown;
	document.onkeyup = Keyboard.keyup;
}

function gameLoop(){
	update();
	draw();

	requestAnimationFrame(gameLoop);
}

function update(){
	const deltaPos = pl.speed / FPS;
	if(Keyboard.keysPressed.d) pl.pos.x += deltaPos;
	if(Keyboard.keysPressed.a) pl.pos.x -= deltaPos;
	if(Keyboard.keysPressed.s) pl.pos.y += deltaPos;
	if(Keyboard.keysPressed.w) pl.pos.y -= deltaPos;
}

function draw(){
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, CANV_SIZE, CANV_SIZE);

	const plCenterPos = pl.getCenter();
	ctx.drawImage(pl.img, plCenterPos.x, plCenterPos.y, pl.size, pl.size);
}
