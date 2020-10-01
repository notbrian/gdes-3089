// Flowers in Motion Redux by Brian Nguyen
// Some code referenced from original Flowers in Motion
const numOfVert = 15;
const vertices = [];
const controlPoints = [];

const newVertices = [];
const newControlPoints = [];

const easingFactor = 0.01;

let straightMode = false;
let mainColor;
let newColor = {};
const bounds = {
  x: 600,
  y: 600,
  z: 600,
};

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  const canvas = document.querySelector("canvas");
  canvas.oncontextmenu = () => false;
  colorMode(HSL);
  for (let i = 0; i < numOfVert; i++) {
    const point = {
      x: random(-bounds.x, bounds.x),
      y: random(-bounds.y, bounds.y),
      z: random(-bounds.z, bounds.z),
    };
    vertices[i] = point;
  }

  for (let i = 0; i < numOfVert; i++) {
    const point = {
      x: random(-bounds.x, bounds.x),
      y: random(-bounds.y, bounds.y),
      z: random(-bounds.z, bounds.z),
    };
    newVertices[i] = point;
  }

  for (let i = 0; i < 2; i++) {
    const point = {
      x: random(-bounds.x, bounds.x),
      y: random(-bounds.y, bounds.y),
      z: random(-bounds.z, bounds.z),
    };
    controlPoints[i] = point;
  }

  for (let i = 0; i < 2; i++) {
    const point = {
      x: random(-bounds.x, bounds.x),
      y: random(-bounds.y, bounds.y),
      z: random(-bounds.z, bounds.z),
    };
    newControlPoints[i] = point;
  }

  mainColor = color(`hsl(${Math.round(random(0, 360))},100%, 68%)`);

  newColor = color(`hsl(${Math.round(random(0, 360))},100%, 68%)`);
}

function draw() {
  background(0, 0, 0);
  // rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.002);

  smooth();
  stroke(mainColor);
  strokeWeight(0.7);
  noFill();

  if (straightMode) {
    vertices.forEach((vertex) => {
      vertices.forEach((vertex2) => {
        bezier(
          vertex.x,
          vertex.y,
          vertex.z,
          vertex.x,
          vertex.y,
          vertex.z,
          vertex.x,
          vertex.y,
          vertex.z,
          vertex2.x,
          vertex2.y,
          vertex2.z
        );
      });
    });
  } else {
    vertices.forEach((vertex) => {
      vertices.forEach((vertex2) => {
        bezier(
          vertex.x,
          vertex.y,
          vertex.z,
          controlPoints[0].x,
          controlPoints[0].y,
          controlPoints[0].z,
          controlPoints[1].x,
          controlPoints[1].y,
          controlPoints[1].z,
          vertex2.x,
          vertex2.y,
          vertex2.z
        );
      });
    });
  }

  const dx = newControlPoints[0].x - controlPoints[0].x;
  controlPoints[0].x += dx * easingFactor;
  const dy = newControlPoints[0].y - controlPoints[0].y;
  controlPoints[0].y += dy * easingFactor;
  const dz = newControlPoints[0].z - controlPoints[0].z;
  controlPoints[0].z += dz * easingFactor;

  const dx2 = newControlPoints[1].x - controlPoints[1].x;
  controlPoints[1].x += dx2 * easingFactor;
  const dy2 = newControlPoints[1].y - controlPoints[1].y;
  controlPoints[1].y += dy2 * easingFactor;
  const dz2 = newControlPoints[1].z - controlPoints[1].z;
  controlPoints[1].z += dz2 * easingFactor;

  for (let i = 0; i < newVertices.length; i++) {
    const dx = newVertices[i].x - vertices[i].x;
    vertices[i].x += dx * easingFactor;
    const dy = newVertices[i].y - vertices[i].y;
    vertices[i].y += dy * easingFactor;
    const dz = newVertices[i].z - vertices[i].z;
    vertices[i].z += dz * easingFactor;
  }

  for (let i = 0; i < mainColor._array.length; i++) {
    const dx = newColor._array[i] - mainColor._array[i];
    mainColor._array[i] += dx * 0.1;
  }
}

function mouseReleased() {
  for (let i = 0; i < numOfVert; i++) {
    const point = {
      x: random(-bounds.x, bounds.x),
      y: random(-bounds.y, bounds.y),
      z: random(-bounds.z, bounds.z),
    };
    newVertices[i] = point;
  }
  for (let i = 0; i < 2; i++) {
    const point = {
      x: random(-bounds.x, bounds.x),
      y: random(-bounds.y, bounds.y),
      z: random(-bounds.z, bounds.z),
    };
    newControlPoints[i] = point;
  }

  newColor = color(`hsl(${Math.round(random(0, 360))},100%, 68%)`);

  if (mouseButton === RIGHT) {
    straightMode = true;
  }

  if (mouseButton === LEFT) {
    straightMode = false;
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
