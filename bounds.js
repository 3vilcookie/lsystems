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
            this.xMax = value;
        if (value < this.xMin)
            this.xMin = value;
    }

    processY(value) {
        if (value > this.yMax)
            this.yMax = value;
        if (value < this.yMin)
            this.yMin = value;
    }

    get xCenter() {
        return (this.xMax + this.xMin) / 2.0;
    }

    get yCenter() {
        return (this.yMax + this.yMin) / 2.0;
    }

    get xLength() {
        return this.xMax- this.xMin;
    }

    get yLength() {
        return this.yMax - this.yMin;
    }

    /*
    round(value) {
        return value;
        var factor = Math.pow(10, this.decimals);
        return Math.round(value * factor) / factor;
    }*/

    toString() {
        return "X: " + this.xMin + "/" + this.xMax +
            " LEN: " + this.xLength + " AVG: " + this.xCenter + "\n" +
            "Y: " + this.yMin + "/" + this.yMax +
            " LEN: " + this.yLength + " AVG: " + this.yCenter + "\n";

    }
}