// Some code referenced from https://p5js.org/examples/simulate-flocking.html
// Concepts referenced from https://natureofcode.com/book/chapter-6-autonomous-agents/

const agents = [];
let jobPoint;
let homePoint;
let hospitalPoint;
let seperationSlider;
let seperatationSliderTitle;
let seperatationSliderText;
let infectedText;
let recoveredText;
let infectedCount = 0;
let recoveredCount = 0;

function calcSeperationText(value) {
  let text = "";

  if (value < 50) {
    seperatationSliderText.style("color", "grey");
    text = "NO SOCIAL DISTANCING";
  }
  if (value >= 50) {
    seperatationSliderText.style("color", "green");
    text = "REGULAR SOCIAL DISTANCING";
  }
  if (value >= 100) {
    seperatationSliderText.style("color", "red");
    text = "EXTREME SOCIAL DISTANCING";
  }

  return text;
}

function setup() {
  createCanvas(1000, 800);

  // Create agents
  for (let i = 0; i < 220; i++) {
    agents.push(new Person(random(width), random(height)));
  }

  // Create HTML elements
  createP("Left click on a person to infect them.").style(
    "text-align",
    "center"
  );
  createDiv().id("bottomContainer");

  createDiv().id("statistics").parent("#bottomContainer");
  createDiv().id("socialControls").parent("#bottomContainer");

  infectedText = createP(
    `Infected: ${infectedCount} (${(infectedCount / agents.length) * 100}%)`
  )
    .style("color", "red")
    .parent("#statistics");
  recoveredText = createP(
    `Recovered: ${recoveredCount} (${(recoveredCount / agents.length) * 100}%)`
  )
    .style("color", "rgb(117, 66, 245)")
    .parent("#statistics");

  seperatationSliderTitle = createP("Social Distancing Factor").parent(
    "#socialControls"
  );
  seperationSlider = createSlider(30, 150, 30).parent("#socialControls");
  seperatationSliderText = createP(seperationSlider.value()).parent(
    "#socialControls"
  );

  // Create vector points for key points
  homePoint = createVector(width * 0.05, height / 2);
  jobPoint = createVector(width * 0.95, height / 2);
  hospitalPoint = createVector(width / 2, height * 0.95);
}

function draw() {
  seperatationSliderText.html(calcSeperationText(seperationSlider.value()));
  background(255);
  noStroke();

  // Draw Job
  push();
  fill(0, 255, 0);
  translate(jobPoint.x, jobPoint.y);
  rectMode(CENTER);
  rect(0, 0, 50, 50);
  textSize(20);
  text("Job", -70, textAscent() / 2);
  pop();

  // Draw Home
  push();
  fill(0, 0, 255);
  translate(homePoint.x, homePoint.y);
  rectMode(CENTER);
  rect(0, 0, 50, 50);
  textSize(20);
  text("Home", 35, textAscent() / 2);
  pop();

  // Draw Hospital
  push();
  fill(255, 0, 0);
  translate(hospitalPoint.x, hospitalPoint.y);
  rectMode(CENTER);
  rect(0, 0, 100, 50);
  textSize(20);
  text("Hospital", 60, textAscent() / 2);
  pop();

  // Agents update
  for (let i = 0; i < agents.length; i++) {
    agents[i].update();
    agents[i].render();
  }
}

// Agent class
class Person {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.position = createVector(x, y);
    this.d = 15.0;
    this.maxspeed = 3;
    this.maxforce = 0.05; // Maximum steering force
    this.strokeCol = 0;
    // this.infected = Math.random() > 0.95 ? true : false;
    this.infectedTimer = null;
    this.infected = false;
    // this.mask = Math.random() > 0.5 && this.infected === false ? true : false;
    // this.mask = false;
    this.food = 0;
    this.collecting = true;
    this.recovered = false;
  }

  update() {
    // Job logic
    let jobDist = p5.Vector.dist(this.position, jobPoint);
    if (jobDist < 50) {
      if (this.food < 100) {
        this.food++;
      }
      if (this.food === 100) {
        this.collecting = false;
      }
    }

    // Home logic
    let homeDist = p5.Vector.dist(this.position, homePoint);
    if (homeDist < 100) {
      if (this.food > 0) {
        this.food--;
      }
      if (this.food === 0) {
        this.collecting = true;
      }
    }

    // Hospital logic
    let hospitalDist = p5.Vector.dist(this.position, hospitalPoint);
    // If infected and inside the hospitals range, start a 3 second time to recovery
    if (hospitalDist < 50 && this.infectedTimer == null && this.infected) {
      this.infectedTimer = setTimeout(() => {
        this.infected = false;
        this.infectedTimer = null;
        this.recovered = true;
        recoveredCount++;
        infectedCount--;
        infectedText.html(
          `Infected: ${infectedCount} (${Math.round(
            (infectedCount / agents.length) * 100
          )}%)`
        );
        recoveredText.html(
          `Recovered: ${recoveredCount} (${Math.round(
            (recoveredCount / agents.length) * 100
          )}%)`
        );
      }, 3000);
    }

    // Main behaviour states
    // If not infected, do regular behavior of going to work
    // Else go to the hospital
    if (!this.infected) {
      if (this.collecting) {
        this.acceleration.add(this.seek(jobPoint)).mult(1);
      } else {
        this.acceleration.add(this.seek(homePoint)).mult(1);
      }
    } else {
      this.acceleration.add(this.seek(hospitalPoint)).mult(1);
    }

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);
  }

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  // Code referenced from p5 flocking example
  seek(target) {
    let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
    const d = desired.mag();
    desired.normalize();

    if (d < 200) {
      const m = map(d, 0, 200, 0, this.maxspeed);
      desired.mult(m);
    } else {
      desired.mult(this.maxspeed);
    }
    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.velocity);

    steer.limit(this.maxforce); // Limit to maximum steering force
    steer.add(this.seperate().mult(3));

    return steer;
  }

  render() {
    push();
    if (this.infected) {
      fill(255, 0, 0);
    } else if (this.recovered) {
      fill(117, 66, 245);
    } else {
      fill(167, map(this.food, 0, 100, 167, 255), 167);
    }
    stroke(255);
    translate(this.position.x, this.position.y);
    circle(0, 0, this.d);

    // Infected Text
    if (this.infected) {
      noStroke();
      textAlign(CENTER);
      fill(255, 0, 0);
      textSize(15);
      text("INFECTED", 0, -10);
    }

    pop();
  }

  // Seperate from other people function
  // Also referenced from flocking example
  seperate() {
    let desiredseparation = seperationSlider.value();
    let steer = createVector(0, 0);
    let count = 0;
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

      // If too close, infect other agents
      // Barring if they recovered, or already infected
      if (
        this.infected &&
        d < 20 &&
        !agents[i].recovered &&
        !agents[i].infected
      ) {
        agents[i].infected = true;
        infectedCount++;
        infectedText.html(
          `Infected: ${infectedCount} (${Math.round(
            (infectedCount / agents.length) * 100
          )}%)`
        );
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
}

// Infect a person by clicking with your mouse
function mouseReleased(e) {
  if (mouseButton === "left") {
    for (let i = 0; i < agents.length; i++) {
      let d = p5.Vector.dist(createVector(mouseX, mouseY), agents[i].position);
      if (d < agents[i].d) {
        agents[i].infected = true;
        infectedCount++;
        infectedText.html(
          `Infected: ${infectedCount} (${Math.round(
            (infectedCount / agents.length) * 100
          )}%)`
        );
      }
    }
  }
}
