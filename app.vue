   var app = new Vue({
            el: '#lSystemsApp',
            data: {
                V: "",
                P: "",
                E: "+-[]|f",
                A: "",
                n: 4,
                alpha: 45.0,
                startAngle: 0.0,
                angleOffset: 90.0,
                out: "",
                log: "",
                xoffsetUI: 0,
                yoffsetUI: 0,
                zoomUI: 1,
                startTime: null,
                endTime: null,
                durationOut: "",
                showCanvasDebug: false,
                ctx: null,
                autoGen: true,
                boxDimensionValue: 0,
                occupiedBoxes : 0,
                allBoxes : 0,
                gridSize: 0.05,
                gridCheckBox: false,
                audiopreter: null,
                boxDimCheckBox: false,
                showPoints: false
            },
            created: function () {
                //this.setLStarTemplate(); // --> Default

                // Disable AutoGenerate inside the constructor
                // to avoid Canvas Context Reference Errors
                // This is maybe caused by the execution order of the browser
                var temp = this.autoGen;
                this.autoGen = false;
                this.setKochSnowflakeTemplate();
                this.autoGen = temp;
            },
            methods: {

                autoGenerate: function () {
                    if (this.autoGen)
                        this.generate();
                },
                generate: function () {
                    this.startTime = performance.now();

                    this.clearCanvas();

                    var l = new LSystem();
                    var output = "";
                    this.log = "";
                    try {
                        l.V = this.V;
                        l.E = this.E;
                        l.Axiom = this.A;
                        l.P = this.P;
                        l.n = this.n;
                        l.generate()
                        this.out = l.out;
                    } catch (error) {
                        this.log = "<div class='alert alert-danger'>[LSystem]: " + error + "</div>";
                        return;
                    }

                    if (this.boxDimCheckBox)
                        this.calcBoxDimension(l);
                    else {
                        var t = new Turtle(this.ctx.canvas.width, this.ctx.canvas.height, parseFloat(this.alpha), Number(this.n), 100.0, this.showCanvasDebug, this.showPoints);

                        t.angleOffset = parseFloat(this.angleOffset) + parseFloat(this.startAngle);

                        t.computeWord(l.out);
                        this.ctx.drawImage(t.finalCanvas, 0, 0);
                    }

                    if (this.gridCheckBox)
                        this.drawGrid();

                    this.endTime = performance.now();

                    var duration = (this.endTime - this.startTime) / 1000.0;
                    this.durationOut = "Rendered within " + duration + "s"


                },

                drawGrid: function () {

                    var localGridSize = Number((this.gridSize * this.ctx.canvas.width));

                    this.ctx.save();
                    for (let i = 0; i < this.ctx.canvas.width; i += localGridSize) {

                        this.ctx.beginPath();

                        // Horizontal Lines
                        if (Number(i % (localGridSize * 4)) == 0)
                            this.ctx.lineWidth = 0.25;
                        else
                            this.ctx.lineWidth = 0.1;

                        this.ctx.moveTo(0, i);
                        this.ctx.lineTo(this.ctx.canvas.width, i);

                        // Vertical Lines
                        if (i % (localGridSize * 2) == 0)
                            this.ctx.lineWidth = 0.25;
                        else
                            this.ctx.lineWidth = 0.1;
                        this.ctx.moveTo(i, 0);
                        this.ctx.lineTo(i, this.ctx.canvas.height);

                        this.ctx.stroke();
                        this.ctx.closePath();
                    }

                    this.ctx.restore();

                },
                calcBoxDimension: function (lsystem = false) {


                    this.clearCanvas();

                    if (lsystem === false) {
                        lsystem = new LSystem();
                        lsystem.V = this.V;
                        lsystem.E = this.E;
                        lsystem.Axiom = this.A;
                        lsystem.P = this.P;
                        lsystem.n = this.n;
                        lsystem.generate();
                    }


                    var width = this.ctx.canvas.width;
                    var height = this.ctx.canvas.height;
                    var resolution = width * height;

                    var t = new Turtle(this.ctx.canvas.width, this.ctx.canvas.height, parseFloat(this.alpha), Number(this.n), 100.0);
                    t.angleOffset = parseFloat(this.angleOffset) + parseFloat(this.startAngle);
                    t.computeWord(lsystem.out);

                    this.out = lsystem.out;

                    var boxDim = new BoxDimension(t.finalContext,Number((this.gridSize * this.ctx.canvas.width)), parseFloat(this.gridSize), this.gridCheckBox);
                    
                    boxDim.calculate();
                    this.ctx.drawImage(boxDim.boxCanvas, 0, 0);
                    this.ctx.drawImage(t.finalContext.canvas, 0, 0);

                   this.occupiedBoxes = boxDim.occupied;
                   this.allBoxes = boxDim.totalBoxCount;
                   this.boxDimensionValue = boxDim.dimension;
                },
                // Clear-Function for L-System and Turtle

                clear: function () {
                    this.V = "";
                    this.P = "";
                    this.E = "+-[]|f";
                    this.A = "";
                },
                clearCanvas: function () {
                    this.ctx.save();
                    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                    this.ctx.fillStyle = "#FFF"
                    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                    this.ctx.restore();
                },

                // L-System Templates
                setHoneycombTemplate: function () {
                    this.V = "F";
                    this.P = "F=F++F+F+F+F";
                    this.A = "F|F|F";
                    this.alpha = 60
                    this.n = 5;
                    this.startAngle = 0;
                    this.out = "";
                    this.log = "";
                    this.autoGenerate();
                },
                setCoastlineTemplate: function () {
                    this.V = "F";
                    this.P = "F=F+F--[--F]+F";
                    this.A = "F|F";
                    this.alpha = 90
                    this.n = 6;
                    this.startAngle = 0;
                    this.out = "";
                    this.log = "";
                    this.autoGenerate();
                },
                setCloudTemplate: function () {
                    this.V = "F";
                    this.P = "F=F+FF-";
                    this.A = "F|F";
                    this.alpha = 90
                    this.n = 6;
                    this.startAngle = 0;
                    this.out = "";
                    this.log = "";
                    this.autoGenerate();
                },
                setLichterketteTemplate: function () {
                    this.V = "FG";
                    this.P = "F=F+F-G-F-\nG=GFG";
                    this.A = "F|F";
                    this.alpha = 212
                    this.n = 6;
                    this.startAngle = 0.0;
                    this.out = "";
                    this.log = "";
                    this.autoGenerate();
                },
                setLStarTemplate: function () {
                    this.V = "AF";
                    this.P = "A=AAffff--f--fff++ff--f--fff+AA-";
                    this.A = "FA";
                    this.alpha = 45.0;
                    this.startAngle = 0.0;
                    this.n = 3;
                    this.out = "";
                    this.log = "";
                    this.autoGenerate();
                },
                setKochTemplate: function () {
                    this.V = "F";
                    this.P = "F=F+F--F+F";
                    this.A = "F";
                    this.alpha = 60.0;
                    this.startAngle = 0.0;
                    this.n = 3;
                    this.out = "";
                    this.log = "";
                    this.autoGenerate();
                },
                setKochSnowflakeTemplate: function () {
                    this.V = "F";
                    this.P = "F=F+F--F+F";
                    this.A = "F--F--F";
                    this.alpha = 60.0;
                    this.startAngle = 0.0;
                    this.n = 3;
                    this.out = "";
                    this.log = "";
                    this.autoGenerate();
                },
                setDragonCurveTemplate: function () {
                    this.V = "FG";
                    this.P = "F=F+Gf+\nG=-fF-G";
                    this.A = "fF";
                    this.alpha = 90.0;
                    this.startAngle = 0.0;
                    this.n = 3;
                    this.out = "";
                    this.log = "";
                    this.autoGenerate();
                },
                setHilbertTemplate: function () {
                    this.V = "AB";
                    this.P = "A=-Bf+AfA+fB-\nB=+Af-BfB-fA+";
                    this.A = "B";
                    this.alpha = 90.0;
                    this.startAngle = 0.0;
                    this.n = 3;
                    this.out = "";
                    this.log = "";
                    this.autoGenerate();
                },
                setSierpinskiTriangleTemplate: function () {
                    this.V = "FG";
                    this.P = "F=G-F-G\nG=F+G+F";
                    this.A = "F";
                    this.alpha = 60.0;
                    this.startAngle = 0.0;
                    this.n = 4;
                    this.out = "";
                    this.log = "";
                    this.autoGenerate();
                },
                setNotSierpinskiTemplate: function () {
                    this.V = "F";
                    this.P = "F=F[-F][+F]F";
                    this.A = "F";
                    this.alpha = 120.0;
                    this.startAngle = 270.0;
                    this.n = 8;
                    this.out = "";
                    this.log = "";
                    this.autoGenerate();
                },
                setPlantTemplate: function () {
                    this.V = "FG";
                    this.P = "G=F+[[G]-G]-F[-FG]+F\nF=FF";
                    this.A = "G";
                    this.alpha = 25.0;
                    this.startAngle = 270.0;
                    this.n = 3;
                    this.out = "";
                    this.log = "";
                    this.autoGenerate();
                },
                setLecyCTemplate: function () {
                    this.V = "F";
                    this.P = "F=+F--F+";
                    this.A = "F";
                    this.alpha = 45.0;
                    this.startAngle = 180.0;
                    this.n = 10;
                    this.out = "";
                    this.log = "";
                    this.autoGenerate();
                },
                setGosperTemplate: function () {
                    this.V = "FG";
                    this.P = "F = F+G++G-F--FF-G+\nG = -F+GG++G+F--F-G";
                    this.A = "F";
                    this.alpha = 60.0;
                    this.startAngle = 0.0;
                    this.n = 5;
                    this.out = "";
                    this.log = "";
                    this.autoGenerate();
                },

                // Audio Interpreter
                playFractal: function () {
                    this.stopFractal();
                    var l = new LSystem();
                    var output = "";
                    this.log = "";
                    try {
                        l.V = this.V;
                        l.E = this.E;
                        l.Axiom = this.A;
                        l.P = this.P;
                        l.n = this.n;
                        l.generate()
                        this.out = l.out;
                    } catch (error) {
                        this.log = "<div class='alert alert-danger'>[LSystem]: " + error + "</div>";
                        return;
                    }

                    this.audiopreter = new Audiopreter();
                    this.audiopreter.interpretWord(l.out);
                },

                stopFractal: function () {
                    if (this.audiopreter != null) {
                        this.audiopreter.stop();

                    }
                }
            },
            filters : {
                round2f : function(value){
                    if(!value) return 0;
                    return Math.round(Number(value)*100.0)/100.0;
                }
            }
        });