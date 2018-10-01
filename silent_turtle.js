class SilentTurtle {

    constructor() {
        this.lineLength = 10.0;
        this.alpha = 90.0;
        this.x = 0;
        this.y = 0;
        this.angle = 0.0;
        this.stateStack = [];
        this.bounds = new Bounds();

        this.points = [];
    }

    get points() {
        return this._points;
    }

    set points(value) {
        this._points = value;
    }

    get alpha() {
        return this._alpha;
    }

    set alpha(value) {
        this._alpha = value;
    }

    get angle() {
        return this._angle;
    }

    set angle(value) {
        this._angle = value;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get lineLength() {
        return this._lineLength;
    }

    set lineLength(value) {
        this._lineLength = value;
    }

    get bounds() {
        return this._bounds;
    }

    set bounds(value) {
        this._bounds = value;
    }

    radians(degrees) {
        return degrees * Math.PI / 180.0;
    }

    degrees(radians) {
        return radians * 180.0 / Math.PI;
    }

    round(value, decimals = 1) {
        var factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }

    forward(length = this.lineLength) {

        this.x += Math.round(length * Math.sin(this.radians(this.angle)));
        this.y += Math.round(length * Math.cos(this.radians(this.angle)));

        this.bounds.process(this.x, this.y);
        this.points.push([this.x, this.y]);
    }

    right(alpha = this.alpha) {
        this.angle += alpha;
    }

    left(alpha = this.alpha) {
        this.right(-alpha);
    }

    resetTurtle() {
        this.angle = 0.0;
        this.alpha = 90.0;
        this.x = 0;
        this.y = 0;
        this.stateStack = [];
        this.bounds = new Bounds();
        this.points = [];
    }

    processWord(word, alpha) {
        if (typeof word == 'undefined' || word == "")
            throw "Word is empty. Check if the L-System is correct."

        this.resetTurtle();
        this.alpha = alpha;

        for (var i = 0; i < word.length; i++)
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
            case "|":
                this.right(180.0);
                break;
            case "[":
                this.stateStack.push({ "x": this.x, "y": this.y, "angle": this.angle });
                break;
            case "]":
                if (this.stateStack.length == 0)
                    throw "[Turtle] Nothing on the stack. '[' missing?";
                var pos = this.stateStack.pop();
                this.x = pos.x;
                this.y = pos.y;
                this.angle = pos.angle;
                break;
            default:
                break;
        }
    }
}