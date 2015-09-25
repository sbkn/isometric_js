
// Point consists of x,y in pixel an x,y in matrix coordinates
class Point {
	constructor(matX, matY) {
		this._matX = matX;
		this._matY = matY;
		this._pxX = 0;
		this._pxY = 0;
		// Calculate the pos in px
		this.matToPx(matX, matY);
	}
	get matX() {
		return this._matX;
	}
	get matY() {
		return this._matY;
	}
	set matX(matX) {
		this._matX = matX;
	}
	set matY(matY) {
		this._matX = matY;
	}
	get pxX() {
		return this._pxX;
	}
	get pxY() {
		return this._pxY;
	}
	set pxX(pxX) {
		this._pxX = pxX;
	}
	set pxY(pxY) {
		this._pxX = pxY;
	}

	// matrix -> px
	matToPx( matX, matY ) {
		this._pxX= (matX - matY) * (window.tileWidth / 2);
		this._pxY = (matX + matY) * (window.tileHeight / 2) + window.tileHeight / 2;
	}
	// px -> matrix
	pxToMat(pxX, pxY) {
		// I HAVE REMOVED THE TYPECAST RIGHT BEFORE THE FIRST, IT WAS A (INT) !!!!
		this._matX = (pxX / (window.tileWidth / 2) + pxY / (window.tileHeight / 2)) / 2;
		this._matY = (pxY / (window.tileHeight / 2) - pxX / (window.tileWidth / 2)) / 2;
	}

}


