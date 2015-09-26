// This represents the viewport the player has
class Camera {
	constructor(x,y,ms) {
		this._x = x;
		this._y = y;
		this._ms = ms;
	}
	get x() {
		return this._x;
	}
	get y() {
		return this._y;
	}
	get ms() {
		return this._ms;
	}
	set x(newX) {
		this._x = newX;
	}
	set y(newY) {
		this._y = newY;
	}
	set ms(newMs){
		this._ms = newMs;
	}
	moveView(dx,dy) {
		this._x += dx;
		this._y += dy;
	}
	// Center the camera on (x,y)
	centerView(x,y) {
		this._x = x-canvas.width/2;
		this._y = y-canvas.height/2;
	}
	// Reset the View
	resetView() {
		this._x = 64;
		this._y = 64;
	}
}

