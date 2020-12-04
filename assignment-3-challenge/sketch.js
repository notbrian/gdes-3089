let scene = 0;
let yourScore = 0;
let unimateScore = 0;

let yourLevel = [];
let unimateLevel = [];

let correctIndex = 0;
let unimateIndex = 0;

let loadingGif;
let appleImg;
let rottenAppleImg;

let HYPERMODE = false;

let timeLeft = 60;

function generateLevel(side) {
  let newArr = [];
  for (let i = 0; i < 100; i++) {
    if (side === "left") {
      newArr.push([random(50, width / 2 - 50), random(220, height - 50)]);
    } else {
      newArr.push([
        random(width / 2 + 50, width - 50),
        random(220, height - 50),
      ]);
    }
  }

  return newArr;
}

function preload() {
  // loadingGif = createImg("spinner.gif");
  // loadingGif.style("width", "50px");
  loadingGif = loadImage("spinner.gif");
  appleImg = loadImage("apple.png");
  rottenAppleImg = loadImage("rottenapple.png");
}

function setup() {
  canvas = createCanvas(580, 790);
  background(60);
  // loadingGif.parent(canvas);
  yourLevel = generateLevel("left");
  unimateLevel = generateLevel("right");
  correctIndex = Math.round(random(0, yourLevel.length - 1));
  unimateIndex = Math.round(random(0, yourLevel.length - 1));
  // introScreen();
}

function draw() {
  background(60);

  switch (scene) {
    case 0: {
      introScreen();
      break;
    }
    case 1: {
      challengeIntro();
      break;
    }
    case 2: {
      challenge();
      break;
    }
    case 3: {
      results();
      break;
    }
  }
}

function mouseClicked() {
  if (mouseButton === "left") {
    if (
      mouseX >= 30 &&
      mouseX <= 440 &&
      mouseY >= 500 &&
      mouseY <= 580 &&
      scene === 0
    ) {
      scene = 1;
    } else if (
      mouseX >= 30 &&
      mouseX <= 440 &&
      mouseY >= 500 &&
      mouseY <= 580 &&
      (scene === 1 || scene === 3)
    ) {
      scene = 2;
      yourScore = 0;
      unimateScore = 0;
      timeLeft = 60;
      gameStart();
    }

    let correctRect = yourLevel[correctIndex];

    if (
      mouseX >= correctRect[0] &&
      mouseX <= correctRect[0] + 40 &&
      mouseY >= correctRect[1] &&
      mouseY <= correctRect[1] + 40 &&
      scene === 2
    ) {
      yourScore++;
      yourLevel = generateLevel("left");
      correctIndex = Math.round(random(0, yourLevel.length - 1));
    }
  }
}
function unimateCorrect() {
  unimateScore++;
  unimateLevel = generateLevel("right");
  unimateIndex = Math.round(random(0, yourLevel.length - 1));
}
function introScreen() {
  fill(255);
  textFont("Inter");
  textAlign(LEFT);
  textSize(68);
  textStyle(BOLD);
  text("CAN YOU BEAT \nWILHELM?", 30, 130);
  textStyle(NORMAL);
  textSize(25);
  text(
    "WILHELM is a new general purpose AI \ndesigned to make factory jobs obsolete.   \n\n\nCan you beat it in a 60 second challenge?",
    30,
    300
  );

  fill(255, 50, 50);
  noStroke();
  rect(30, 500, 410, 80);
  fill(255);
  text("Swipe to start the challenge", 45, 550);
  textStyle(BOLD);
  text("-->", 393 + sin(millis() / 300) * 3, 550);
  textSize(12);
  textStyle(NORMAL);
  // text("Created by Emdash Digital", 20, height - 20);
}

function challengeIntro() {
  fill(255);
  textFont("Inter");
  textAlign(LEFT);
  textSize(60);
  textStyle(BOLD);
  text("THE CHALLENGE", 30, 100);
  textStyle(NORMAL);
  textSize(20);
  text(
    "The challenge is to identify the most rotten apples.\n\nYou and WILHELM with both have 60 seconds to spot\nthe most rotten apples.",
    30,
    220
  );

  fill(50, 200, 50);
  noStroke();
  rect(30, 500, 410, 80);
  fill(255);
  text("Ok, I understand.", 45, 550);
  textStyle(BOLD);
  text("-->", 393 + sin(millis() / 300) * 3, 550);
  textSize(12);
  textStyle(NORMAL);
}

function results() {
  fill(255);
  textFont("Inter");
  push();
  textStyle(BOLD);
  textAlign(CENTER);
  textSize(40);
  translate(0, 60);
  text("You", width / 4, 120);
  text("WILHELM", width - width / 4, 120);

  textSize(35);
  text(yourScore, width / 4, 175);
  text(unimateScore, width - width / 4, 175);
  pop();

  textAlign(LEFT);
  textSize(60);
  textStyle(BOLD);
  text("RESULTS", 30, 100);
  textStyle(NORMAL);
  textSize(18);
  text(
    "WILHELM is able to adapt to any basic task within 30 seconds.\n\nThe apple sorting task is just the start, WILHELM is adapting\nand extinguishing jobs everyday.",
    30,
    310
  );

  fill(50, 200, 50);
  noStroke();
  rect(30, 500, 410, 80);
  fill(255);
  text("Swipe to try again", 45, 550);
  textStyle(BOLD);
  text("-->", 393 + sin(millis() / 300) * 3, 550);
}

function challenge() {
  push();
  fill(255);
  noStroke();
  rectMode(CENTER);
  rect(width / 2, height / 1.55, 4, height);
  textStyle(BOLD);
  textAlign(CENTER);
  textSize(40);
  text("You", width / 4, 120);
  text("WILHELM", width - width / 4, 120);
  textAlign(CENTER, CENTER);
  text(timeLeft, width / 2, 50);
  textSize(35);
  text(yourScore, width / 4, 175);
  text(unimateScore, width - width / 4, 175);
  pop();
  push();
  noFill();
  stroke(255);
  strokeWeight(4);
  ellipse(width / 2, 47, 75);
  pop();

  rectMode(CORNER);
  imageMode(CORNER);
  for (let i = 0; i < yourLevel.length; i++) {
    const element = yourLevel[i];
    if (correctIndex === i)
      image(rottenAppleImg, element[0], element[1], 40, 40);
    else {
      image(appleImg, element[0], element[1], 40, 40);
    }
  }

  for (let i = 0; i < unimateLevel.length; i++) {
    const element = unimateLevel[i];
    if (unimateIndex === i)
      image(rottenAppleImg, element[0], element[1], 40, 40);
    else {
      image(appleImg, element[0], element[1], 40, 40);
    }
  }
  if (HYPERMODE) {
    unimateCorrect();
  } else {
    if (random() > 0.99) {
      unimateCorrect();
    }
  }
  imageMode(CENTER);

  image(loadingGif, width - width / 4, 55, 70, 70);
  // loadingGif.position(0, 0);
}

let timer;

function gameStart() {
  timer = setInterval(() => {
    timeLeft--;
    if (timeLeft < 30) HYPERMODE = true;
    if (timeLeft <= 0) {
      clearInterval(timer);
      scene = 3;
    }
  }, 1000);
}
