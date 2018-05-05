/*
 * @file:       turtle.js
 * @brief:      Another Turtle Graphic Class using HTML5-Canvas
 * @author:     Raphael Pour <turtle@raphaelpour.de>
 * @license:    (C) 2018 Raphael Pour LGPL
 */

class Turtle {
    constructor(context, alpha = 60.0, length = 1.0) {
        this.alpha = alpha;
        this.length = length;
        this.angle = 0.0;
        this.x = 0;
        this.y = 0;
        this.xOffset = 0;
        this.yOffset = 0;
        this.alphaOffset = 0;
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

    log() {
        console.log("[Turtle] x:" + this.x + " y:" + this.y + " angle:" + this.alpha + " length:" + this.length);
    }

    forward(length = this.length) {
        var lastX = this.x;
        var lastY = this.y;

        //this.x += this.context.canvas.width* length*length  * Math.sin(this.angle);
        // this.y += this.context.canvas.height*length*length * Math.cos(this.angle) ;

        this.x += length * Math.sin(this.angle);
        this.y += length * Math.cos(this.angle);
        this.context.beginPath();
        this.context.moveTo(lastX, this.context.canvas.height - lastY);
        this.context.lineTo(this.x, this.context.canvas.height - this.y);
        this.context.stroke();

    }

    right(alpha = this.alpha) {
        this.angle += alpha * Math.PI / 180.0;
    }

    left(alpha = this.alpha) {
        this.right(-alpha);
    }

    clear() {

        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
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
                if (this.coordinateStack.length == 0) {
                    console.log("[Turtle] Nothing coordinate on the stack. '[' missing?");
                    break;
                }
                var pos = this.coordinateStack.pop();
                this.x = pos[0];
                this.y = pos[1];
                this.angle = pos[2];
                break;
            default:
                //console.log("[Turtle] Ignore symbol '" + symbol + "'");
                break;
        }
    }
}