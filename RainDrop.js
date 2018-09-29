class RainDrop {
  constructor(backgroundColor) {
    this.xPos = random(0, width);
    this.yPos = random(0, height);

    this.maxHeight = 75;
    this.minHeight = 25;

    this.maxWidth = 4;
    this.minWidth = 1;

    this.height = random(this.minHeight, this.maxHeight);
    this.width = random(this.minWidth, this.minWidth);

    this.backgroundColor = backgroundColor;
  }

  fall(distance) {
    this.yPos += distance;

    if (this.yPos >= height) {
      this.xPos = random(0, width);
      this.yPos = -10;
    }
    fill(this.backgroundColor);
    noStroke()
    push();
    translate(this.xPos, this.yPos);
    rect(0, 0, this.width, this.height);
    pop();
  }
}
