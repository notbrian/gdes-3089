// Some code referenced from https://p5js.org/examples/simulate-flocking.html
// Concepts referenced from https://natureofcode.com/book/chapter-6-autonomous-agents/

const agents = [];
let jobPoint;
let homePoint;

function setup() {
  createCanvas(1000, 600);

  homePoint = createVector(width * 0.1, height / 2);
  jobPoint = createVector(width * 0.85, height / 2);
  for (let i = 0; i < 1; i++) {
    agents.push(new Person(homePoint.x, homePoint.y));
  }
}

function draw() {
  background(255);
  noStroke();
  push();
  fill(0, 255, 0);
  translate(jobPoint.x, jobPoint.y);
  rectMode(CENTER);
  rect(0, 0, 50, 50);
  pop();

  push();
  fill(0, 0, 255);
  translate(homePoint.x, homePoint.y);
  rectMode(CENTER);
  rect(0, 0, 50, 50);
  pop();
  for (let i = 0; i < agents.length; i++) {
    agents[i].update();
    // agents[i].borders();
    agents[i].render();
  }
}

class Person {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.position = createVector(x, y);
    this.r = 15.0;
    this.maxspeed = 3; // Maximum speed
    this.maxforce = 0.05; // Maximum steering force
    this.strokeCol = 0;
    // this.infected = Math.random() > 0.99 ? true : false;
    this.infected = false;
    this.mask = Math.random() > 0.5 && this.infected === false ? true : false;
    this.food = 0;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    // Main behaviour states
    if (this.food == 0) {
      this.acceleration.add(this.seek(jobPoint)).mult(1);
    } else {
      this.acceleration.add(this.seek(homePoint)).mult(1);
    }

    let jobDist = p5.Vector.dist(this.position, jobPoint);
    if (jobDist < 50) {
      if (this.food < 100) {
        this.food++;
      }
    }

    let homeDist = p5.Vector.dist(this.position, homePoint);
    if (homeDist < 50) {
      if (this.food > 0) {
        this.food--;
      }
    }

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

    if (d < 200) {
      const m = map(d, 0, 200, 0, this.maxspeed);
      // console.log(m);
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
    push();
    if (this.infected) {
      fill(255, 0, 0);
    } else if (this.mask) {
      fill(173, 216, 230);
    } else {
      fill(167);
    }
    stroke(255);
    translate(this.position.x, this.position.y);
    circle(0, 0, this.r);
    stroke(0, 0, 0, 30);
    fill(255, 241, 122, 50);
    circle(0, 0, 30);
    textAlign(CENTER);
    fill(255, 0, 0);
    textSize(15);
    text(this.infected ? "INFECTED" : "", 0, -10);
    fill(0, map(this.food, 0, 100, 0, 255), 0);
    text(this.food > 0 ? this.food : "", 0, 30);
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
