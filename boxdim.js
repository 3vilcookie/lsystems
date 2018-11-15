class BoxDimension {

    constructor(context, gridSize = 64, sigma = 0.5, showGrid = false) {
        this.ctx = context;
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
        this.gridSize = Math.max(2,Number(gridSize));
        this.showGrid = showGrid;

        let xBoxCount = Math.ceil(this.width/this.gridSize);
        let yBoxCount = Math.ceil(this.height/this.gridSize);

        this.sigma = sigma;
        this.totalBoxCount = xBoxCount*yBoxCount;

        this.dimension = 0;
        this.occupied = 0;

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

        this.occupied = 0;
        this.occupiedL = {};

        for (let i = 0; i < this.width * this.height * 4; i += 4) {

            if (img.data[i] == 0 && img.data[i + 3] > 0) {
                var x = (i / 4) % this.width;
                var y = Math.floor((i / 4) / this.width);

                var rx = x - x % this.gridSize;
                var ry = y - y % this.gridSize;

                if(ry in this.occupiedL)
                {
                    if(rx in this.occupiedL[ry])
                    //if(this.occupiedL[ry].indexOf(rx) >= 0)
                        continue;
                    
                }
                else
                    this.occupiedL[ry] = {}

                this.occupied++;
                this.boxContext.fillRect(rx, ry, this.gridSize, this.gridSize);
                
                this.occupiedL[ry][rx] = undefined
            }
        }
        this.dimension = -Math.log(this.occupied)/Math.log(this.sigma);
    
    }
}