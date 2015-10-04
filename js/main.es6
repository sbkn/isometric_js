/**
 * // Scaling factor - scale the pixmaps up
 * @type {number}
 */
window.scalingFac = 2;
/**
 *  tilewidth & height of the default tile
 * @type {number}
 */
window.tileWidth = 64;
window.tileHeight = 32;
/**
 * Coord's of a click
 * @type {number}
 */
window.clickX = 0;
window.clickY = 0;

/**
 * Canvas
 * @type {Element}
 */
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

window.addEventListener('resize', resizeCanvas, false);

// Time keeper
var time;
var test;

// Images
var iso_grid_spooky = new Image();
var iso_obstacle_spooky_box_closed = new Image();
var iso_highlighted_grid = new Image();
var ghostImage = new Image();
iso_grid_spooky.src = './Content/iso_grid_spooky.png';
iso_obstacle_spooky_box_closed.src = './Content/iso_obstacle_spooky_box_closed.png';
iso_highlighted_grid.src = './Content/iso_highlighted_grid.png';
ghostImage.src = './Content/ghost_2.png';

/**
 * Resize the canvas when needed
 */
function resizeCanvas() {
	window.innerWidth <= 800 ? canvas.width = window.innerWidth : canvas.width = 800;
	window.innerHeight <= 640 ? canvas.height = window.innerHeight : canvas.height = 640;
}

/**
 * Draw the terrain
 */
function drawGround() {
	var x = 0;
	var y = 0;
	for(var i=0; i<window.levelHeight; i++) {
		for(var j=0; j<window.levelWidth; j++) {
			// Draw the ground and the obstacles
			if(window.gamemap[i][j] == 0) {
				x = (j-i)*(window.tileWidth*window.scalingFac/2)-(window.tileWidth*window.scalingFac/2)+window.cam.x;
				y = (j+i)*(window.tileHeight*window.scalingFac/2)-32*window.scalingFac+window.heightmap[i][j]+window.cam.y;
				ctx.drawImage(iso_grid_spooky, x, y, 64*window.scalingFac, 64*window.scalingFac);
			} else {
				x = (j-i)*(window.tileWidth*window.scalingFac/2)-(window.tileWidth*window.scalingFac/2)+window.cam.x;
				y = (j+i)*(window.tileHeight*window.scalingFac/2)-64*window.scalingFac+window.heightmap[i][j]+window.cam.y;
				ctx.drawImage(iso_obstacle_spooky_box_closed, x, y, 64*window.scalingFac, 96*window.scalingFac);
			}
		}
	}
    ctx.drawImage(iso_highlighted_grid, window.pointerX, window.pointerY, 64*window.scalingFac, 32*window.scalingFac);
}

/**
 * Draw a number at (x,y)
 * @param title
 * @param num
 * @param x
 * @param y
 */
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
