// random colors from css
// var c0 = window
//   .getComputedStyle(document.documentElement)
//   .getPropertyValue("--c0");
var c1 = window
  .getComputedStyle(document.documentElement)
  .getPropertyValue("--c1");
var c2 = window
  .getComputedStyle(document.documentElement)
  .getPropertyValue("--c2");
var c3 = window
  .getComputedStyle(document.documentElement)
  .getPropertyValue("--c3");
var c4 = window
  .getComputedStyle(document.documentElement)
  .getPropertyValue("--c4");
var c5 = window
  .getComputedStyle(document.documentElement)
  .getPropertyValue("--c5");
let shade = [c1, c2, c3, c4, c5];

let count = 1000;
let countmax = 1000;
let countb = 0;
let countmaxb = 3;

let blurx = 3;

let noiseMax;
let zoff = 1;

let paused = 0;

let palette;
let bg;
let ca, cb;

let ox, oy;

var fps = 60;
var pixeldensity = "false";

// create a capturer that exports PNG images in a TAR file
var filming = "false";
var capturer = new CCapture({
  framerate: fps,
  format: "png",
  name: "floating",
  timeLimit: 60,
  verbose: true,
});

function setup() {
  // createCanvas(1280, 720);
  createCanvas(windowWidth, windowHeight);
	pixelDensity(1);
  frameRate(fps);
  angleMode(DEGREES);
	smooth();
  strokeWeight(0.2);

  // ribbons
  r1 = new Ribbons();
  // r2 = new Ribbons();
  // r3 = new Ribbons();
}

function draw() {
  r1.move();
  // r2.move();
  // r3.move();
}

class Ribbons {
  move() {
    // define colors after ribbon completes
    if (count < countmax) {
      count = count + 1;
    } else {
      let shades = random(shade);
      ca = color(shades);
			let shadesb = random(shade);
			cb = color(shadesb);
			// cb = c0

      // init or blur
      if (countmax < 1000) {
        if (blurx > 0) {

          // blur after three ribbons
          if (countb < countmaxb) {
            countb = countb + 1;
          } else {
						countb = 0;
						countmaxb = random(5);
            filter(BLUR, blurx);
          }
        }

			// set background (init)
      } else {
        background(cb);
      }

      // randoms
      noiseMax = random(1.2, 1.7);
      ox = random(-width * 0.5, width * 1.5);
      oy = random(-height * 0.5, height * 1.5);

      count = 0;
      countmax = random(20, 200);
    }

    noFill();

    stroke(ca);
    push();
    translate(ox, oy);
    beginShape();
    for (let t = 0; t < 360; t++) {
      let xoff = map(cos(t), -1, 1, 0, noiseMax);
      let yoff = map(sin(t), -1, 1, 0, noiseMax);

      let n = noise(xoff, yoff, zoff);

      let r = map(n, 0, 1, 0, width * 1.5);
      let x = r * cos(t);
      let y = r * sin(t);

      // let c = lerpColor(ca, cb, n);

      vertex(x, y);
    }
    endShape(CLOSE);

    zoff += random(0.00033, 0.00045);
  }
}

function render() {
  requestAnimationFrame(render);
  // rendering stuff ...
  capturer.capture(canvas);
}

function mousePressed() {
  if (paused < 1) {
    noLoop();
    stop();
    paused = 1;
  } else {
    paused = 0;
    background(cb);
    loop();
  }
}

function mouseDragged() {
  blurx = (mouseY / height) * 5;
  if (blurx > 1) {
    filter(BLUR, blurx);
  } else {
    blurx = 0;
  }
  paused = 0;
  loop();
}

function keyReleased() {
  if (keyCode == DELETE || keyCode == BACKSPACE) background(cb);
  if (key == "s" || key == "S") {
    if (filming == "false") {
      capturer.start();
      render();
      filming = "true";
    } else {
      capturer.stop();
      capturer.save();
      filming = "false";
    }
  }
  if (key == "r" || key == "R") {
    if (pixeldensity == "false") {
      pixelDensity(2);
      background(cb);
      pixeldensity = "true";
    } else {
      pixelDensity(1);
      background(cb);
      pixeldensity = "false";
    }
  }
  if (key == "1") blurx = 0;
  if (key == "2") blurx = 1;
  if (key == "3") blurx = 5;
  if (key == "4") blurx = 10;
  if (key == "5") blurx = 100;
}
