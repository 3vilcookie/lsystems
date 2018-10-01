/*
 * @file:       turtle.js
 * @brief:      Another Turtle Graphic Class using HTML5-Canvas
 * @author:     Raphael Pour <turtle@raphaelpour.de>
 * @license:    (C) 2018 Raphael Pour GPL
 */

class Turtle {

    /*
     * Command Drawing System using an input string and a char interpreter to draw
     * on a HTML5 Canvas  
     */
    constructor(width, height, alpha = 60.0, iterationCount = 1, length = 100.0) {
        this.alpha = alpha;
        this.length = length;
        this.width = width;
        this.height = height;
        this.angle = 0;
        this.x = 0;
        this.y = 0;
        this.iterationCount = iterationCount;
        this.xOffset = 0;
        this.yOffset = 0;
        this.xOffsetUI = 0;
        this.yOffsetUI = 0;
        this.preProcessingStage = false;
        this.coordinateStack = [];


        this.bounds = new Bounds();


        // Create Pre-Processing Canvas
        this.preProcessingCanvas = document.createElement("canvas");
        this.preProcessingCanvas.id = "preProcessingCanvasId";
        this.preProcessingCanvas.width = width;
        this.preProcessingCanvas.height = height;

        if (this.preProcessingCanvas && this.preProcessingCanvas.getContext) {
            this.preProcessingContext = this.preProcessingCanvas.getContext('2d');
            this.preProcessingContext.fillStyle = "rgb(255, 255, 255)";
            this.preProcessingContext.strokeStyle = "black";
        }
        else
            throw "Invalid Pre-Processing Canvas";


        // Create Final Canvas 
        this.finalCanvas = document.createElement("canvas");
        this.finalCanvas.id = "finalCanvasId";
        this.finalCanvas.width = width;
        this.finalCanvas.height = height;

        if (this.finalCanvas && this.finalCanvas.getContext) {
            this.finalContext = this.finalCanvas.getContext('2d');
            this.finalContext.fillStyle = "rgb(255, 255, 255)";
            this.finalContext.strokeStyle = "black";
            this.finalContext.lineWidth = 5;

        }
        else
            throw "Invalid Final Canvas";

    }

    get finalCanvas() {
        return this._finalCanvas;
    }

    set finalCanvas(value) {
        this._finalCanvas = value;
    }

    get preProcessingCanvas() {
        return this._preProcessingCanvas;
    }

    set preProcessingCanvas(value) {
        this._preProcessingCanvas = value;
    }

    set zoomUI(value) {
        this._zoomUI = value;
    }

    get zoomUI() {
        return this._zoomUI;
    }

    get yOffsetUI() {
        return this._yOffsetUI;
    }

    set yOffsetUI(value) {
        this._yOffsetUI = value;
    }

    get xOffsetUI() {
        return this._xOffsetUI;
    }

    set xOffsetUI(value) {
        this._xOffsetUI = value;
    }

    get alpha() {
        return this._alpha;
    }

    set alpha(value) {
        this._alpha = value;
    }

    set angleOffset(value) {
        this._angleOffset = value;
    }

    get angleOffset() {
        return this._angleOffset;
    }

    radians(degrees) {
        return degrees * Math.PI / 180.0;
    }

    degrees(radians) {
        return radians * 180.0 / Math.PI;
    }

    forward(length = this.length) {
        var lastX = this.x;
        var lastY = this.y;

        this.x += Math.round(length * Math.sin(this.radians(this.angle)));
        this.y += Math.round(length * Math.cos(this.radians(this.angle)));

        if (this.preProcessingStage) {
            // Calculate min/max coordinates
            this.bounds.process(this.x, this.y);

            this.preProcessingContext.beginPath();
            this.preProcessingContext.moveTo(lastX, lastY);
            this.preProcessingContext.lineTo(this.x, this.y);
            this.preProcessingContext.stroke();
            this.preProcessingContext.closePath();
        }
        else {

            this.finalContext.beginPath();
            this.finalContext.moveTo(lastX, lastY);
            this.finalContext.lineTo(this.x, this.y);
            this.finalContext.stroke();
            this.finalContext.closePath();
        }

    }

    right(alpha = this._alpha) {
        this.angle += alpha;
    }

    left(alpha = this._alpha) {
        this.right(-alpha);
    }

    clear() {

        // Clear Pre-Processing Canvas
        this.preProcessingContext.save();

        this.preProcessingContext.fillRect(0, 0, this.width, this.height);

        this.preProcessingContext.restore();


        // Clear everything on the canvas
        this.finalContext.save();

        this.finalContext.fillRect(0, 0, this.width, this.height);

        this.finalContext.restore();

    }

    resetTurtle() {
        this.angle = this.angleOffset;
        this.x = 0;
        this.y = 0;
        this.coordinateStack = [];
    }

    computeWord(word) {

        if (typeof word == 'undefined' || word == "")
            throw "Word is empty. Check if the L-System is correct."


        /*
         * First Render Pass
         */

        // Bypass drawing and calculate bounds
        this.preProcessingStage = true;

        this.preProcessingContext.scale(1, -1);
        this.preProcessingContext.translate(0, -this.height);

        this.resetTurtle();
        for (var i = 0; i < word.length; i++) {
            this.consume(word[i]);
        }

        // Write Name of the View on the Canvas
        this.preProcessingContext.save();
        this.preProcessingContext.setTransform(1, 0, 0, 1, 0, 0);
        var fontSize = 20;
        this.preProcessingContext.font = fontSize + "px Consolas";
        this.preProcessingContext.fillStyle = "black";
        this.preProcessingContext.fillText("Pre-Processing View", fontSize, this.height - fontSize);
        this.preProcessingContext.restore();


        /*
         * Resize Canvas
         */
        var resizeFactor;

        // Use Dimension with the highest extend and stretch it to the
        // domain [0,1]x[0,1]
        resizeFactor = Math.max(this.width / this.bounds.xLength,this.height / this.bounds.yLength)


        /*
         * Second Render Pass
         */
        // Rendering with resized canvas

        console.log(this.bounds.toString());
        var translateX = (this.width/2.0) - (this.bounds.xAverage);
        var translateY = (this.height/2.0) - (this.bounds.yAverage);

        // Reset all Transformations
        this.finalContext.setTransform(1, 0, 0, 1, 0, 0);

        // Put Origin from Lefg-Up to Left-Down and put orientation
        // to up direction

        /*  .---->           ^
            |                |
            |          =>    |
            v                .---->
        */
        //this.finalContext.scale(1, -1);
        //this.finalContext.translate(0, -this.height);

        //this.finalContext.scale(resizeFactor, resizeFactor);
        //this.finalContext.translate(translateX, translateY);
        //this.length *= resizeFactor;
        this.finalContext.setTransform(resizeFactor,0,resizeFactor,0,
            this.width/2.0 - resizeFactor * this.bounds.xAverage,
            this.height/2.0 - resizeFactor * this.bounds.yAverage);
        this.finalContext.lineWidth = 1;

        this.preProcessingStage = false;
        this.resetTurtle();
        for (var i = 0; i < word.length; i++) {
            this.consume(word[i]);
        }
        

        // Write Name of the View on the Canvas
        this.finalContext.save();

        this.finalContext.setTransform(1, 0, 0, 1, 0, 0);
        var fontSize = 20;
        this.finalContext.font = fontSize + "px Consolas";
        this.finalContext.fillStyle = "black";
        this.finalContext.fillText("Output View", fontSize, this.height - fontSize);
        this.finalContext.restore();
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
            case "|":
                this.right(180.0);
                break;
            case "[":
                this.coordinateStack.push({ "x": this.x, "y": this.y, "angle": this.angle });
                break;
            case "]":
                if (this.coordinateStack.length == 0)
                    throw "[Turtle] Nothing coordinate on the stack. '[' missing?";
                var pos = this.coordinateStack.pop();
                this.x = pos.x;
                this.y = pos.y;
                this.angle = pos.angle;
                break;
            default:
                break;
        }
    }
}