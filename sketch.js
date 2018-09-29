const RAINDROP_TOTAL = 1000;
const BACKGROUND = 'rgba(0,0,0,1)';
const RAIN_COLOR = 'rgba(119,8,236,1)';

const rain = [];

function setup() {
  const canvasHeight = window.innerHeight;
  const canvasWidth = window.innerWidth;

  const body = document.querySelector('body');
  body.style.backgroundColor = BACKGROUND;

  createCanvas(canvasWidth, canvasHeight);

  createRain();
}

function createRain() {
  for (i = 0; i < RAINDROP_TOTAL; i++) {
    rain.push(new RainDrop(RAIN_COLOR));
  }
}

function draw() {
  background(BACKGROUND);
  push();

  rain.forEach(drop => {
    const fallDistance = random(5, 35);
    drop.fall(fallDistance);
  });

  pop();
}
