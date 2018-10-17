
class Audiopreter {

    constructor() {
        this.notes = [
            //      C        D        E        F        G        A        H
            16.35, 18.35, 20.60, 21.83, 24.50, 27.50, 30.87, // 0. Octave
            32.70, 36.71, 41.20, 43.65, 49.00, 55.00, 61.74, // 1. Octave
            65.41, 73.42, 82.41, 87.31, 98.00, 110.00, 123.47, // 2. Octave
            130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94, // 3. Octave
            261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, // 4. Octave
            523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, // 5. Octave
            1046.50, 1174.66, 1318.51, 1396.91, 1567.98, 1760.00, 1975.53, // 6. Octave
            2093.00, 2349.32, 2637.02, 2793.83, 3135.96, 3520.00, 3951.07, // 7. Octave
            4186.01, 4698.63, 5274.04, 5587.65, 6271.93, 7040.00, 7902.13 // 8. Octave
        ]
        this.noteScale = ['c', 'd', 'e', 'f', 'g', 'h', 'a']
        this.currentNote = 0;
        this.currentOctave = 4;
        this.ctx = new AudioContext();
        this.now = this.ctx.currentTime;

        this.stack = [];
        this.sheduledNotes = [];
        this.running = true;
    }

    noteUp() {
        if (this.currentNote + 1 >= 7) {
            this.currentOctave++;
            this.currentNote = 0;
        }
        else
            this.currentNote++;
    }

    noteDown() {
        if (this.currentNote - 1 < 0) {
            this.currentOctave--;
            this.currentNote = 6;
        }
        else
            this.currentNote--;
    }

    play(t) {
        // Create Audio Generation Environment
        var osc = this.ctx.createOscillator();
        var gainNode = this.ctx.createGain();

        // Set properties of the sound
        osc.type = "triangle";

        osc.frequency.value = this.notes[this.currentOctave * 7 + this.currentNote];

        // Set up gain node to define the length of the node and 
        // suppress the click noise        
        var stopTime = t + 0.5;
        gainNode.gain.setValueAtTime(0.3, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, stopTime);

        // Connect everything together
        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        // Play sound
        osc.start(t);
        osc.stop(stopTime);

        this.sheduledNotes.push(osc);
    }

    stop() {
        this.running = false;

        while (this.sheduledNotes.length > 0)
            this.sheduledNotes.pop().stop(0.5);

    }

    interpretWord(word) {

        this.running = true;
        var delay = 0;
        for (let i = 0; i < word.length && this.running; i++) {
            const char = word.charAt(i);
            var n = this.ctx.currentTime

            switch (char) {
                case '+':
                    this.noteUp();
                    break;
                case '-':
                    this.noteDown();
                    break;
                case '|':
                case '[':
                    this.stack.push({ 'note': this.currentNote, 'octave': this.currentOctave });
                    break;
                case ']':
                    if (this.stack.length == 0) {
                        console.log("[Audiopreter::interpretWord] Stack error. '[' missing.");
                    }
                    else {
                        var state = this.stack.pop();
                        this.currentNote = state.note;
                        this.currentOctave = state.octave;
                    }
                    break;
                case 'F':
                case 'f':
                    this.play(n + 0.25 + delay);
                    delay += 0.25;
                    break;
                case 'G':
                    this.play(n + 0.5 + delay);
                    delay += 0.5;
                    break;
                default:
                    if (!isNaN(char))
                        this.currentOctave = Number(char) % 8;
                    else
                        console.log("[Audiopreter::interpretWord] Unknown Symbol " + char);
            }
        }
    }
}