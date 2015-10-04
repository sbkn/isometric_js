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

canvas.addEventListener("click", clickHandler, false);

// CARE - this only works for the current position / sizing of canvas!
function clickHandler(e) {
    window.clickX = e.pageX - (window.innerWidth - canvas.width) / 2 - window.cam.x;
    window.clickY = e.pageY - window.cam.y;
}

function keyDownHandler(e) {
    // right arrow and D
    if (e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = true;
    }
    // left arrow and A
    else if (e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = true;
    }
    // up arrow and W
    if (e.keyCode == 38 || e.keyCode == 87) {
        upPressed = true;
    }
    // down arrow and S
    else if (e.keyCode == 40 || e.keyCode == 83) {
        downPressed = true;
    }
    // key R - reset the camera offset
    if (e.keyCode == 82) {
        window.cam.resetView();
    }
}
function keyUpHandler(e) {
    if (e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = false;
    }
    else if (e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = false;
    }
    if (e.keyCode == 38 || e.keyCode == 87) {
        upPressed = false;
    }
    else if (e.keyCode == 40 || e.keyCode == 83) {
        downPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    var relativeY = e.clientY - canvas.offsetTop;
    if (relativeX > 0 && relativeX < canvas.width) {
        if (relativeY > 0 && relativeY < canvas.height) {
            window.mousePointer.pxX = relativeX;
            window.mousePointer.pxY = relativeY;
            window.mousePointer.pxToMat(relativeX, relativeY);
        }
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

