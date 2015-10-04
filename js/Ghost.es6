var test;

// It's a ghost !
class Ghost {
    // framesCols = total columns of frames, framesRows = total rows of frames on the sheet
    // animSpeed = delay for frame jumps
    constructor(width, height, matX, matY, frameCols, frameRows, animSpeed) {
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
    movePx(dx, dy) {
        this._pos._pxX += dx;
        this._pos._pxY += dy;
    }

    // Jump to the next frame if it's time
    animate(timePassed) {
        if (this._sinceLastAnim + timePassed >= this._animSpeed) {
            this._sinceLastAnim = 0;
            this._curFrameCol++;
            if (this._curFrameCol >= this._frameCols) {
                this._curFrameCol = 0;
                this._curFrameRow++;
                if (this._curFrameRow >= this._frameRows) {
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
        ctx.drawImage(ghostImage, this._width * this._curFrameCol, this._height * this._curFrameRow,
            this._width, this._height, this._pos._pxX + window.cam.x - this._width * window.scalingFac / 2,
            this._pos._pxY + window.cam.y - this._height * window.scalingFac, this._width * window.scalingFac, this._height * window.scalingFac);
    }
}

