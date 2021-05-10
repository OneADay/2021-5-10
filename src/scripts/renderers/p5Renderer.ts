import * as seedrandom from 'seedrandom';
import { BaseRenderer } from './baseRenderer';
import gsap from 'gsap';
import P5 from 'p5';

const srandom = seedrandom('b');

export default class P5Renderer implements BaseRenderer{

    recording: boolean = false;
    colors = ['#EFF2C0', '#2F4858', '#BEA57D', '#A52422'];
    backgroundColor = '#8E5572';

    canvas: HTMLCanvasElement;
    s: any;

    completeCallback: any;
    delta = 0;
    animating = true;

    width: number = 1920 / 2;
    height: number = 1080 / 2;

    size: number;

    x: number;
    y: number;

    frameCount = 0;
    totalFrames = 1000;

    constructor(w, h) {

        this.width = w;
        this.height = h;

        const sketch = (s) => {
            this.s = s;
            s.pixelDensity(1);
            s.setup = () => this.setup(s)
            s.draw = () => this.draw(s)
        }

        new P5(sketch);
    }

    protected setup(s) {
        let renderer = s.createCanvas(this.width, this.height);
        this.canvas = renderer.canvas;

        s.noiseSeed(10);
        let bg = s.color(this.backgroundColor);
        s.background(bg);
        s.rectMode(s.CENTER);

        //s.colorMode(s.HSB);
    }

    protected draw(s) {

        if (this.animating) { 
            this.frameCount += 5;

            let frameDelta = 2 * Math.PI * (this.frameCount % this.totalFrames) / this.totalFrames;

            //s.colorMode(s.RGB);
            let bg = s.color(this.backgroundColor);
            s.background(bg);

            let x = 0;
            let y = 0;
            //s.colorMode(s.HSB);

            var ySize = 20;  //Height of each row in pixels.
            var xSize = 1;   //How many pixels to sample at.
            var sinSpectrum = 0;
            var pX = 0;
            var pY = 0;
            var yMargin = -10;

            for (y = (ySize / 2) - ySize; y < s.height + ySize; y += ySize + yMargin) {

                let pct = y / this.height;

                let colorA = s.color(this.colors[0]);
                let colorB = s.color(this.colors[1]);
                let color = s.lerpColor(colorA, colorB, pct);
                
                s.noFill();
                s.stroke(color);
                s.strokeWeight(5);

                pX = 0;
                pY = y;

                for (x = 0; x < s.width; x += xSize) {

                    var xFreq = s.noise(x / 100, y / 100,  Math.sin(frameDelta) * 0.25) * .25;
                    sinSpectrum += xFreq;
                    let y2 = y + s.sin(sinSpectrum) * ySize*.45;
                    s.line(pX, pY, x, y2);
                    x += 1;

                    pX = x;
                    pY = y + s.sin(sinSpectrum) * ySize*.45;
                }


            }

            if (this.recording) {
                if (frameDelta == 0) {
                    this.completeCallback();
                }
            }
        }
    }

    protected getPolar = function(x, y, r, a) {
        // Get as radians
        var fa = a * (Math.PI / 180);
        
        // Convert coordinates
        var dx = r * Math.cos(fa);
        var dy = r * Math.sin(fa);
        
        // Add origin values (not necessary)
        var fx = x + dx;
        var fy = y + dy;
    
        return [fx, fy];
    }
    

    public render() {

    }

    public play() {
        this.frameCount = 0;
        this.recording = true;
        this.animating = true;
        let bg = this.s.color(this.backgroundColor);
        this.s.background(bg);
    }

    public stop() {
        this.animating = false;
    }

    public setCompleteCallback(completeCallback: any) {
        this.completeCallback = completeCallback;
    }

    public resize() {
        this.s.resizeCanvas(window.innerWidth, window.innerHeight);
        this.s.background(0, 0, 0, 255);
    }
}