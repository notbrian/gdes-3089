// Some code referenced from https://p5js.org/examples/simulate-flocking.html
// Concepts referenced from https://natureofcode.com/book/chapter-6-autonomous-agents/

const agents = [];

function setup() {
  createCanvas(1000, 600);
  for (let i = 0; i < 300; i++) {
    agents.push(new Person(width / 2, height / 2));
  }
}

function draw() {
  background(255);
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
    this.position = createVector(random(0, width), random(0, height));
    this.r = 15.0;
    this.maxspeed = 20; // Maximum speed
    this.maxforce = 0.05; // Maximum steering force
    this.strokeCol = 0;
    this.infected = Math.random() > 0.99 ? true : false;
    this.mask = Math.random() > 0.5 && this.infected === false ? true : false;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    // Update velocity
    this.acceleration
      .add(this.seek(createVector(width / 2, height / 2)))
      .mult(0.01);
    this.acceleration.add(this.seperate()).mult(2);
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelertion to 0 each cycle
    this.acceleration.mult(0);
    // this.strokeCol += 1;
    // if (this.strokeCol > 360) {
    //   this.strokeCol = 0;
    // }
  }

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {
    let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
    const d = desired.mag();
    desired.normalize();

    if (d < 100) {
      const m = map(d, 0, 100, 0, this.maxspeed);
      desired.mult(m);
    } else {
      desired.mult(this.maxspeed);
    }
    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.velocity);

    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
  }

  render() {
    // Draw a triangle rotated in the direction of velocity
    // let theta = this.velocity.heading() + radians(90);
    if (this.infected) {
      fill(255, 0, 0);
    } else if (this.mask) {
      fill(173, 216, 230);
    } else {
      fill(167);
    }
    stroke(255);
    push();
    translate(this.position.x, this.position.y);
    circle(0, 0, this.r);
    stroke(0, 0, 0, 30);
    fill(255, 241, 122, 50);
    circle(0, 0, 30);
    // rotate(theta);
    // beginShape();
    // vertex(0, -this.r * 2);
    // vertex(-this.r, this.r * 2);
    // vertex(this.r, this.r * 2);
    // endShape(CLOSE);
    pop();
  }

  seperate() {
    let desiredseparation = 30.0;
    let steer = createVector(0, 0);
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < agents.length; i++) {
      let d = p5.Vector.dist(this.position, agents[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if (d > 0 && d < desiredseparation) {
        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.position, agents[i].position);
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        count++; // Keep track of how many
      }

      if (this.infected && d < 20 && !agents[i].mask && millis() > 2000) {
        agents[i].infected = true;
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  borders() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }
}
