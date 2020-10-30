// Some code referenced from https://p5js.org/examples/simulate-flocking.html
// Concepts referenced from https://natureofcode.com/book/chapter-6-autonomous-agents/

const agents = [];

function setup() {
  createCanvas(1000, 600);
  for (let i = 0; i < 20; i++) {
    agents.push(new Person(width / 2, height / 2));
  }
}

function draw() {
  for (let i = 0; i < agents.length; i++) {
    agents[i].update();
    agents[i].borders();
    agents[i].render();
  }
}

class Person {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.position = createVector(x, y);
    this.r = 3.0;
    this.maxspeed = 30; // Maximum speed
    this.maxforce = 0.05; // Maximum steering force
    this.strokeCol = 0;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelertion to 0 each cycle
    this.acceleration.mult(0);
    this.strokeCol += 1;
    if (this.strokeCol > 360) {
      this.strokeCol = 0;
    }
  }

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {
    let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
  }

  render() {
    // Draw a triangle rotated in the direction of velocity
    let theta = this.velocity.heading() + radians(90);
    fill(127);
    stroke(color(`hsl(${this.strokeCol},100%, 68%)`));

    strokeWeight(sin(millis() / 5000) * 10 + 1);
    // strokeWeight(5);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }

  borders() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }
}
