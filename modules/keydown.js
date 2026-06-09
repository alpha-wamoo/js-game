export default function keydown(ev){
	const SPEED = CANV_SIZE / 2;
	if(ev.key === "d") pl.pos.x += SPEED / FPS;
    else if(ev.key === "a") pl.pos.x -= SPEED / FPS;
}