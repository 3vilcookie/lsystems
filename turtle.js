/*
 * @file:       turtle.js
 * @brief:      Another Turtle Graphic Class using HTML5-Canvas
 * @author:     Raphael Pour <turtle@raphaelpour.de>
 * @license:    (C) 2018 Raphael Pour GPL
 */

class Bounds {

    constructor() {
        this.xMin = Infinity;
        this.xMax = -Infinity;
        this.yMin = Infinity;
        this.yMax = -Infinity;

        this.decimals = 3;
    }

    get xMin() {
        return this._xmin;
    }

    set xMin(value) {
        this._xmin = value;
    }

    get xMax() {
        return this._xmax;
    }

    set xMax(value) {
        this._xmax = value;
    }
    get yMin() {
        return this._ymin;
    }

    set yMin(value) {
        this._ymin = value;
    }

    get yMax() {
        return this._ymax;
    }

    set yMax(value) {
        this._ymax = value;
    }

    process(x, y) {
        this.processX(x);
        this.processY(y);
    }

    processX(value) {
        if (value > this.xMax)
            this.xMax = this.round(value);
        if (value < this.xMin)
            this.xMin = this.round(value);
    }

    processY(value) {
        if (value > this.yMax)
            this.yMax = this.round(value);
        if (value < this.yMin)
            this.yMin = this.round(value);
    }

    get xAverage() {
        return this.round((this.xMax + this.xMin) / 2.0);
    }

    get yAverage() {
        return this.round((this.yMax + this.yMin) / 2.0);
    }

    get xLength() {
        return Math.abs(this.xMax) - Math.abs(this.xMin);
    }

    get yLength() {
        return Math.abs(this.yMax) - Math.abs(this.yMin);
    }

    round(value)
    {
        var factor = Math.pow(10,this.decimals);
        return Math.round(value*factor)/factor;
    }

    toString() {
        return "X: " + this.xMin + "/" + this.xMax + "\n" + 
            "Y: " + this.yMin + "/" + this.yMax +"\n" + 
            "LEN: " + this.xLength + "/" + this.yLength +"\n" + 
            "AVG: " + this.xAverage + "/" + this.yAverage;
    }
}

class Turtle {

    /*
     * Command Drawing System using an input string and a char interpreter to draw
     * on a HTML5 Canvas  
     */
    constructor(width, height, alpha = 60.0, iterationCount = 1, length = 10.0) {
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
        this.debugColorValue = 0.0;

        this.bounds = new Bounds();


        // Create Pre-Processing Canvas
        this.preProcessingCanvas = document.createElement("canvas");
        this.preProcessingCanvas.id = "preProcessingCanvasId";
        this.preProcessingCanvas.width = width;
        this.preProcessingCanvas.height = height;

        if (this.preProcessingCanvas && this.preProcessingCanvas.getContext) {
            this.preProcessingContext = this.preProcessingCanvas.getContext('2d');
            this.preProcessingContext.fillStyle = "rgb(0, 70, 215)";
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
            this.finalContext.fillStyle = "rgb(190, 20, 10)";
            this.finalContext.strokeStyle = "black";

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
        return this._alpha * 180.0 / Math.PI;
    }

    set alpha(value) {
        this._alpha = value * Math.PI / 180.0;
    }

    set angleOffset(value) {
        this.angle = value * Math.PI / 180.0;
    }

    log() {
        console.log("[Turtle] x:" + this.x + " y:" + this.y + " angle:" + this.alpha + " length:" + this.length);
    }


    forward(length = this.length) {
        var lastX = this.x;
        var lastY = this.y;

        this.x += length * Math.sin(this.angle);
        this.y += length * Math.cos(this.angle);


        var precision = 100;

        if (this.preProcessingStage) {
            // Calculate min/max coordinates
            this.bounds.process(this.x, this.y);

            this.preProcessingContext.beginPath();
            this.preProcessingContext.moveTo(lastX, lastY);
            this.preProcessingContext.lineTo(this.x, this.y);
            this.preProcessingContext.stroke();
        }
        else {

            this.debugColorValue += 0.05;

            this.finalContext.beginPath();
            this.finalContext.strokeStyle = "rgb(" + this.debugColorValue + "," + this.debugColorValue + "," + this.debugColorValue + ")";
            this.finalContext.moveTo(lastX, lastY);
            this.finalContext.lineTo(this.x, this.y);
            this.finalContext.stroke();
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

    computeWord(word) {

        if (typeof word == 'undefined' || word == "")
            throw "Word is empty. Check if the L-System is correct."


        /*
         * First Render Pass
         */

        // Bypass drawing and calculate bounds
        this.preProcessingStage = true;
        var i;
        for (i = 0; i < word.length; i++) {
            this.consume(word[i]);
        }

        /*
         * Resize Canvas
         */

        //var xLength = Math.abs(this.bounds.x.max) - Math.abs(this.bounds.x.min);
        //var yLength = Math.abs(this.bounds.y.max) - Math.abs(this.bounds.y.min);

        var resizeFactor;

        // Use Dimension with the highest extend and stretch it to the
        // domain [0,1]x[0,1]
        console.log(this.bounds.toString());
        if (this.bounds.xLength > this.bounds.yLength)
            resizeFactor = this.width / this.bounds.xLength;
        else
            resizeFactor = this.height / this.bounds.yLength;


        /*
         * Second Render Pass
         */
        // Rendering with resized canvas
        var xOffsetToCenter = this.bounds.xAverage / 2.0;
        var yOffsetToCenter = this.bounds.yAverage / 2.0;

        this.finalContext.setTransform(1, 0, 0, 1, 0, 0);
        this.finalContext.scale(resizeFactor, resizeFactor);
        this.finalContext.translate(xOffsetToCenter, yOffsetToCenter);

        // TODO : Display first rendering pass in order to check if
        //        the debug circle is inside the canvas
        //        If yes: fuck, if no, adjust translation
        this.preProcessingStage = false;
        //this.clear();

        for (i = 0; i < word.length; i++) {
            this.consume(word[i]);
        }
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