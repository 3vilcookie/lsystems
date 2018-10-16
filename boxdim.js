class BoxDimension {

    constructor(context, gridSize = 64, showGrid = false) {
        this.ctx = context;
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
        this.gridSize = gridSize;

        // Create Canvas for Box-Dimension-Visualization
        this.boxCanvas = document.createElement("canvas");
        this.boxCanvas.id = "boxCanvasId";
        this.boxCanvas.width = this.width;
        this.boxCanvas.height = this.height;

        if (this.boxCanvas && this.boxCanvas.getContext) {
            this.boxContext = this.boxCanvas.getContext('2d');
            this.boxContext.drawImage(this.ctx.canvas, 0, 0);
            this.boxContext.fillStyle = "rgba(255, 0, 0)";
            this.boxContext.strokeStyle = "red";
            this.boxContext.lineWidth = 0.5;

            this.boxContext.save();
            this.boxContext.scale(1, -1)
            this.boxContext.translate(0, -this.width);
            //console.log(this.width + "/" + this.height + "/" + this.gridSize + "/" + this.width / this.gridSize);

            if (showGrid)
                for (let y = 0; y < this.height; y += this.gridSize)
                    for (let x = 0; x < this.width; x += this.gridSize)
                        this.boxContext.strokeRect(x, y, this.gridSize, this.gridSize);


            this.boxContext.restore();
        }
        else
            throw "Invalid Box Canvas";
    }

    get boxCanvas() {
        return this._boxCanvas;
    }
    set boxCanvas(value) {
        this._boxCanvas = value;
    }
    get boxContext() {
        return this._boxContext;
    }
    set boxContext(value) {
        this._boxContext = value;
    }

    calculate() {
        var img = this.ctx.getImageData(0, 0, this.width, this.height);
        var pixelCounter = 0;
        for (let i = 0; i < this.width * this.height * 4; i +=4) {

            if (img.data[i] == 0 && img.data[i + 3] > 0) {
                var x = (i / 4) % this.width;
                var y = Math.floor((i / 4) / this.width);

                var rx = x - x % this.gridSize;
                var ry = y - y % this.gridSize;

                this.boxContext.fillRect(rx, ry, this.gridSize, this.gridSize);
            }
        }
    }
}