class BoxDimension {

    constructor(context, gridSize = 64, showGrid = false) {
        this.ctx = context;
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
        this.gridSize = Math.max(8,Number(gridSize));
        this.showGrid = showGrid;

        // Create Canvas for Box-Dimension-Visualization
        this.boxCanvas = document.createElement("canvas");
        this.boxCanvas.id = "boxCanvasId";
        this.boxCanvas.width = this.width;
        this.boxCanvas.height = this.height;

        if (this.boxCanvas && this.boxCanvas.getContext) {
            this.boxContext = this.boxCanvas.getContext('2d');
            this.boxContext.drawImage(this.ctx.canvas, 0, 0);
            this.boxContext.fillStyle = "red";
            this.boxContext.strokeStyle = "black";
            this.boxContext.lineWidth = 0.1;

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
        for (let i = 0; i < this.width * this.height * 4; i += 4) {

            if (img.data[i] == 0 && img.data[i + 3] > 0) {
                var x = (i / 4) % this.width;
                var y = Math.floor((i / 4) / this.width);

                var rx = x - x % this.gridSize;
                var ry = y - y % this.gridSize;

                this.boxContext.fillRect(rx, ry, this.gridSize, this.gridSize);
            }
        }
        if (this.showGrid)
            for (let i = 0; i < this.width; i += this.gridSize) {

                this.boxContext.beginPath();

                // Horizontal Lines
                if (Number(i % (this.gridSize * 4)) == 0)
                    this.boxContext.lineWidth = 1.0;
                else
                    this.boxContext.lineWidth = 0.1;

                this.boxContext.moveTo(0, i);
                this.boxContext.lineTo(this.width, i);  

                // Vertical Lines
                if (i % (this.gridSize * 2) == 0)
                    this.boxContext.lineWidth = 0.5;
                else
                    this.boxContext.lineWidth = 0.1;
                this.boxContext.moveTo(i, 0);
                this.boxContext.lineTo(i, this.height);

                this.boxContext.stroke();
                this.boxContext.closePath();
                //this.boxContext.strokeRect(x, y, this.gridSize, this.gridSize);

            }
    }
}