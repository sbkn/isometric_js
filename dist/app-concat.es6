// This inits the game

// Read in the map
function readMapFile(file)
{
	$.get(file, function(data){
		var wholeData = data;
		// A map file will have a width, a height and the matrix (map) separated by commas
		var array = wholeData.split(",");
		// Save width and height
		window.levelWidth = array[0];
		window.levelHeight = array[1];
		// Split by line breaks
		var map = array[2].split("\n");
		// Remove the frikkin first and last empty "arrays"
		map.splice(0,1);
		map.splice(window.levelHeight,1);
		// Split by spaces
		$.each(map, function(i, val){
			map[i] = map[i].split(" ");
		});
		// Save to global
		window.gamemap = map;
	});
}
	
// Read in the heightmap
function readHeightmapFile(file)
{
	$.get(file, function(data){
		var map = data.split("\n");
		$.each(map, function(i, val){
			map[i] = map[i].split(" ");
		});
		$.each(map, function(i, val){
			$.each(val, function(j, value){
				map[i][j] = parseInt(value);
			});
		});
		window.heightmap = map;
	});
}

	
// This function init's the game assets
function init(){
	readMapFile( "./Content/gamefile.txt" );
	readHeightmapFile( "./Content/heightmap.txt" );
	let cam = new Camera(0, 0, 15);
	window.cam = cam;
	let ghost = new Ghost(64, 64, 2, 2, 6, 4, 100);
	window.ghost = ghost;
}


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
		this._matY = matY;
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
		this._pxY = pxY;
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
}


var test;

// It's a ghost !
class Ghost {
	// framesCols = total columns of frames, framesRows = total rows of frames on the sheet
	// animSpeed = delay for frame jumps
	constructor(width, height, matX, matY, frameCols, frameRows, animSpeed){
		this._pos = new Point(matX, matY);
		this._width = width;
		this._height = height;
		this._frameCols = frameCols;
		this._frameRows = frameRows;
		this._curFrameCol = 0;
		this._curFrameRow = 0;
		this._animSpeed = animSpeed;
		this._sinceLastAnim = 0;
	}
	get matX() {
		return this._pos._matX;
	}
	get matY() {
		return this._pos._matY;
	}
	set matX(newX) {
		this._pos._matX = newX;
	}
	set matY(newY) {
		this._pos._matY = newY;
	}
	get pxX() {
		return this._pos._pxX;
	}
	get pxY() {
		return this._pos._pxY;
	}
	set pxX(newX) {
		this._pos._pxX = newX;
	}
	set pxY(newY) {
		this._pos._pxY = newY;
	}
	// Move me!
	movePx(dx,dy) {
		this._pos._pxX += dx;
		this._pos._pxY += dy;
	}
	// Jump to the next frame if it's time
	animate(timePassed) {
		if(this._sinceLastAnim + timePassed >= this._animSpeed) {
			this._sinceLastAnim = 0;
			this._curFrameCol++;
			if( this._curFrameCol >= this._frameCols ){
				this._curFrameCol = 0;
				this._curFrameRow++;
				if( this._curFrameRow >= this._frameRows ){
					this._curFrameRow = 0;
				}
			}
		} else {
			this._sinceLastAnim += timePassed;
		}
	}

	// Animate and draw the ghost, gets the time passed since last draw
	draw(timePassed) {
		this.animate(timePassed);
		ctx.drawImage(ghostImage, this._width*this._curFrameCol, this._height*this._curFrameRow, 
						this._width, this._height, this._pos._pxX+window.cam.x - this._width*window.scalingFac/2, 
						this._pos._pxY+window.cam.y - this._height*window.scalingFac, this._width*window.scalingFac, this._height*window.scalingFac);
	}
}


// Scaling factor - scale the pixmaps up
window.scalingFac = 2;
// tilewidth & height of the default tile
window.tileWidth = 64;
window.tileHeight = 32;
// Coord's of a click
window.clickX = 0; 
window.clickY = 0;
// Canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

window.addEventListener('resize', resizeCanvas, false);

// Time keeper
var time;
var test;

// Images
var iso_grid_spooky = new Image();
var iso_obstacle_spooky_box_closed = new Image();
var ghostImage = new Image();
iso_grid_spooky.src = './Content/iso_grid_spooky.png';
iso_obstacle_spooky_box_closed.src = './Content/iso_obstacle_spooky_box_closed.png';
ghostImage.src = './Content/ghost_2.png';

// Resize the canvas when needed
function resizeCanvas() {
	window.innerWidth <= 800 ? canvas.width = window.innerWidth : canvas.width = 800;
	window.innerHeight <= 640 ? canvas.height = window.innerHeight : canvas.height = 640;
}

// Draw the terrain
function drawGround() {
	for(var i=0; i<window.levelHeight; i++) {
		for(var j=0; j<window.levelWidth; j++) {
			// Draw the ground and the obstacles
			if(window.gamemap[i][j] == 0) {
				var x = (j-i)*(window.tileWidth*window.scalingFac/2)-(window.tileWidth*window.scalingFac/2)+window.cam.x; 
				var y = (j+i)*(window.tileHeight*window.scalingFac/2)-32*window.scalingFac+window.heightmap[i][j]+window.cam.y;
				ctx.drawImage(iso_grid_spooky, x, y, 64*window.scalingFac, 64*window.scalingFac);
			} else {
				var x = (j-i)*(window.tileWidth*window.scalingFac/2)-(window.tileWidth*window.scalingFac/2)+window.cam.x; 
				var y = (j+i)*(window.tileHeight*window.scalingFac/2)-64*window.scalingFac+window.heightmap[i][j]+window.cam.y;
				ctx.drawImage(iso_obstacle_spooky_box_closed, x, y, 64*window.scalingFac, 96*window.scalingFac);
			}
		}
	}
}
// Draw a number at (x,y)
function drawNumber(title, num, x, y) {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#FA58FA";
	ctx.fillText(title+num, x, y);
}

// This be the main game loop
function draw() {
	// Handle the timing, dt == delta
	var now = new Date().getTime(),
	timeDt = now - (time || now);
	time = now;

	// Clear the canvas and draw stuff
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGround();
	window.ghost.draw(timeDt);
	drawNumber( "Ghost.pos.matX: ", window.ghost.matX, canvas.width - 195, 40 );
	drawNumber( "Ghost.pos.matY: ", window.ghost.matY, canvas.width - 195, 60 );
	drawNumber( "Ghost.pos.pxX: ", window.ghost.pxX, canvas.width - 195, 80 );
	drawNumber( "Ghost.pos.pxY: ", window.ghost.pxY, canvas.width - 195, 100 );
	drawNumber( "touchDistX: ", window.touchDistX,8,45);
	drawNumber( "touchDistY: ", window.touchDistY,8,65);
	drawNumber( "timeDt: ", timeDt,8,85);
	drawNumber( "FPS: ", Math.floor(1000/timeDt),8,105);
	drawNumber( "clickX: ", window.clickX,8,135);
	drawNumber( "clickY: ", window.clickY,8,155);
	// Check for cam movement input
	var dx = 0;
	var dy = 0;
	// Keys
	if(rightPressed) {
		dx = -1*window.cam.ms;
	}
	else if(leftPressed) {
		dx = window.cam.ms;
	}
	if(upPressed) {
		dy = window.cam.ms;
	}
	else if(downPressed) {
		dy = -1*window.cam.ms;
	}
	//Touch
	if( Math.abs(window.touchDistX) > 45 ){
		if( window.touchDistX > 0 ) {
			dx = -1*window.cam.ms;
			if( window.touchDistX > window.cam.ms ) 
				window.touchDistX-=window.cam.ms;
			else
				window.touchDistX = 0;
		} else {
			dx = window.cam.ms;
			if( -1*window.touchDistX > window.cam.ms ) 
				window.touchDistX+=window.cam.ms;
			else
				window.touchDistX = 0;
		}
	}
	if( Math.abs(window.touchDistY) > 45 ){
		if( window.touchDistY > 0 ) {
			dy = -1*window.cam.ms;
			//dx = window.touchDistX;
			if( window.touchDistY > window.cam.ms ) 
				window.touchDistY-=window.cam.ms;
			else
				window.touchDistY = 0;
		} else {
			dy = window.cam.ms;
			if( -1*window.touchDistY > window.cam.ms ) 
				window.touchDistY+=window.cam.ms;
			else
				window.touchDistY = 0;
		}
	}
	// Move the cam
	if( dx != 0 || dy != 0 ) {
		window.cam.moveView(dx,dy);
	}

	// DO IT
	requestAnimationFrame(draw);
}

// Initialize everything
init();
// Resize canvas
resizeCanvas();
// Start loop
draw();	

// This handles the user input

// Input booleans
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var touchStartX = 0;
var touchStartY = 0;
window.touchDistX = 0;
window.touchDistY = 0;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("touchstart", touchDown, false);
document.addEventListener("touchend", touchUp, false);
document.addEventListener("touchmove", touchMove, false);

canvas.addEventListener( "click", clickHandler, false );

// CARE - this only works for the current position / sizing of canvas!
function clickHandler(e) {
	window.clickX = e.pageX - (window.innerWidth - canvas.width)/2 - window.cam.x;
	window.clickY = e.pageY - window.cam.y;
//	window.clickX = e.pageX - window.cam.x;
//	window.clickY = e.pageY - window.cam.y;
}

function keyDownHandler(e) {
	// right arrow and D
	if(e.keyCode == 39 || e.keyCode == 68) {
		rightPressed = true;
	}
	// left arrow and A
	else if(e.keyCode == 37 || e.keyCode == 65) {
		leftPressed = true;
	}
	// up arrow and W
	if(e.keyCode == 38 || e.keyCode == 87) {
		upPressed = true;
	}
	// down arrow and S
	else if(e.keyCode == 40 || e.keyCode == 83) {
		downPressed = true;
	}
}
function keyUpHandler(e) {
	if(e.keyCode == 39 || e.keyCode == 68) {
		rightPressed = false;
	}
	else if(e.keyCode == 37 || e.keyCode == 65) {
		leftPressed = false;
	}
	if(e.keyCode == 38 || e.keyCode == 87) {
		upPressed = false;
	}
	else if(e.keyCode == 40 || e.keyCode == 83) {
		downPressed = false;
	}
}

function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if(relativeX > 0 && relativeX < canvas.width) {
		//paddleX = relativeX - paddleWidth/2;
	}
}
// Handle the touch events
function touchDown(e) {
	var touchObj = e.changedTouches[0]; // reference first touch point
	touchStartX = parseInt(touchObj.clientX); // get x position of touch point relative to left edge of browser
	touchStartY = parseInt(touchObj.clientY); // get y position of touch point relative to left edge of browser
	e.preventDefault();
}
function touchUp(e) {
	window.touchDistX = 0;
	window.touchDistY = 0;
	e.preventDefault();
}
function touchMove(e) {
	var touchObj = e.changedTouches[0];
	window.touchDistX = parseInt(touchObj.clientX) - touchStartX;
	window.touchDistY = parseInt(touchObj.clientY) - touchStartY;
	e.preventDefault();
}

