/*
 * @file:       turtle.js
 * @brief:      Another Turtle Graphic Class using HTML5-Canvas
 * @author:     Raphael Pour <turtle@raphaelpour.de>
 * @license:    (C) 2018 Raphael Pour LGPL
 */

class Turtle {
    constructor(context, alpha = 60.0, n = 1, length = 1.0) {
        this.alpha = alpha;
        this.length = length;
        this.angle = 0.0;
        this.x = 0;
        this.y = 0;
        this.n = n;
        this.xOffset = 0;
        this.yOffset = 0;
        this.coordinateStack = [];
        if (context == null)
            throw new Error("Invalid Context: null");

        this.context = context;

    }


    get alpha() {
        return this._alpha * 180.0 / Math.PI;
    }

    set alpha(value) {
        this._alpha = value * Math.PI / 180.0;
    }

    set angleOffset(value){
        this.angle = value *Math.PI/180.0;
    }

    log() {
        console.log("[Turtle] x:" + this.x + " y:" + this.y + " angle:" + this.alpha + " length:" + this.length);
    }

    setOrigin(x, y) {
        this.context.translate(x, y);
    }

    scale(x, y) {
        this.context.scale(x, y);
    }

    rotate(angle) {
        this.context.rotate(angle);
    }

    transform(x, y, sx, sy) {
        this.context.transform(sx, 0, sy, 0, x, y);
    }

    forward(length = this.length) {
        var lastX = this.x;
        var lastY = this.y;

        var w = this.context.canvas.width / Math.pow(this.length,this.n);
        var h = this.context.canvas.height / Math.pow(this.length,this.n);
        this.x += w * Math.sin(this.angle);
        this.y += h * Math.cos(this.angle);


        this.context.beginPath();
        this.context.moveTo(lastX, lastY);
        this.context.lineTo(this.x, this.y);
        this.context.stroke();

    }

    right(alpha = this._alpha) {
        this.angle += alpha;
    }

    left(alpha = this._alpha) {
        this.right(-alpha);
    }

    clear() {

        // Clear Transformation with Identity Matrix
        this.context.setTransform(1, 0, 0, 1, 0, 0);

        // Clear everything on the canvas
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        // Move the coordinate system to left-bottom-corner
        this.context.translate(this.context.canvas.width/1.5, this.context.canvas.height/2);

        this.context.rotate(-90* Math.PI / 180.0);

        // Scale it to the current factor
        this.context.scale(.5, -.5);

    }

    computeWord(word) {

        var i;
        for (i = 0; i < word.length; i++)
            this.consume(word[i]);

    }
    consume(symbol) {
        switch (symbol) {
            case "G":
            case "F":
            case "f":
                this.forward();
                break;
            case "+":
                this.left();
                break;
            case "-":
                this.right();
                break;
            case "[":
                this.coordinateStack.push([this.x, this.y, this.angle]);
                break;
            case "]":
                if (this.coordinateStack.length == 0)
                    throw "[Turtle] Nothing coordinate on the stack. '[' missing?";
                var pos = this.coordinateStack.pop();
                this.x = pos[0];
                this.y = pos[1];
                this.angle = pos[2];
                break;
            default:
                break;
        }
    }
}