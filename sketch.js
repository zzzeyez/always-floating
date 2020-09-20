// let shade = ["#774F38", "#E08E79", "#F1D4AF", "#ECE5CE", "#C5E0DC"];
// let shade = ["#02C8D6", "#8DF0F7", "#4FC8F3", "#567E9C", "#ABE0DB"];
// let shade = ["#AFFBFF", "#D2FDFE", "#FEFAC2", "#FEBF97", "#FE6960"];
// let shade = ["#A7C5BD", "#E5DDCB", "#EB7B59", "#CF4647", "#524656"];
let shade = ["#99B898", "#FECEA8", "#FF847C", "#E84A5F", "#2A363B"];

let count = 1000;
let countmax = 1000;

let blurx = 0;

let noiseMax;
let zoff = 1;

let paused = 0;

let palette;
let ca, cb;

let ox, oy;

// let MAX;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  // smooth();
  strokeWeight(0.6);

  // ribbons
  r1 = new Ribbons();
  r2 = new Ribbons();
  r3 = new Ribbons();
}

function draw() {
  r1.move();
  r2.move();
  r3.move();
  // if (blurx < 0) {
  //   blurx = 2;
  // }
}

class Ribbons {
  move() {
    if (count < countmax) {
      count = count + 1;
    } else {
      let shades = random(shade);
      ca = color(shades);
      cb = color(shades);
      // prevent duplicate colors
      if (ca === cb) {
        ca = color(shades);
      }
      // check if first run
      if (countmax < 1000) {
        if (blurx > 0) {
          filter(BLUR, blurx);
        }
      } else {
        background(cb);
      }

      // randoms
      noiseMax = random(1.2, 1.7);
      ox = random(-width * 0.5, width * 1.5);
      oy = random(-height * 0.5, height * 1.5);

      count = 0;
      countmax = random(333);
    }

    noFill();

    stroke(lerpColor(ca, cb, abs(sin(zoff * width))));
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

    zoff += random(0.0004, 0.00065);
  }
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
  if (key == "s" || key == "S") saveCanvas();
  if (key == "1") blurx = 0;
  if (key == "2") blurx = 1;
  if (key == "3") blurx = 5;
  if (key == "4") blurx = 10;
  if (key == "5") blurx = 100;
}
