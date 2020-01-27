var brick;
var ball;
var score = 0;
var highScore = 0;
var cd = 0;
var myCanvas;

let bg1, bl1, bk1a, bk1b;


function preload() {
  bg1 = loadImage('assets/background1.png');
  bl1 = loadImage('assets/ball1.png');
  bk1a = loadImage('assets/brick1a.png');
  bk1b = loadImage('assets/brick1b.png');
}


function setup() {
  launchIntoFullscreen(document.documentElement); // the whole page
  frameRate(60);


  // myCanvas = createCanvas(windowWidth*0.9, windowHeight*0.9);
  myCanvas = createCanvas(1000, 1000);
  noStroke();
  ball = new balls();
  brick = new bricks();
  ball.xSpd = random(-1, 1);
  ball.ySpd = ball.xSpd / abs(ball.xSpd) * sqrt(1 - ball.xSpd * ball.xSpd);

  createButton('Fullscreen').id('fullscreen');
  select('#fullscreen').mousePressed(fsc);
  select('#fullscreen').style('background-color', color(25));
  select('#fullscreen').style('color', color(255));
  select('#fullscreen').position(windowWidth / 2 + 525, windowHeight / 2 - 470);
}

function fsc() {
  launchIntoFullscreen(document.documentElement);
  select('#fullscreen').hide();
}

//1 在draw()读取ball的状态,读取score，读取其他brick状态;
//2 每当bounce()触发之后，上传ball的状态;
//3 在服务器端运算ball.move();
//4 在server判断gameOver()的触发;

function launchIntoFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}


function touchMoved() {
  return false;//CANVAS NO MOVING
}


function draw() {
  // myCanvas.position(-0.1*(winMouseX-width), -0.1*(winMouseY-height));
  // background(0, 0, 0, 25);
  push();
  tint(255, 255, 255, 100);
  image(bg1, 500, 500, 1000, 1000);
  pop();
  textAlign(CENTER);
  textSize(100);
  push();
  colorMode(HSB);
  fill(frameCount%360,225,180);
  text(score, width / 2, 400);
  textSize(50);
  text("HIGHSCORE: " + highScore, width / 2, 625 );
  pop();
  fill(255);
  cd = constrain(cd - 1, 0, 10);
  bounce();
  gameOver();
  ball.move();
  brick.brickMove();
  brick.brickRect();
}

function gameOver() {
  //reset ball postion
  if (abs(ball.xPos - width / 2) > width / 2 + 100 || abs(ball.yPos - height / 2) > height / 2 + 100) {
    ball.xPos = random(0.25, 0.75) * width;
    ball.yPos = random(0.25, 0.75) * height;
    // score = constrain(score - 10, 0, 999999999);
    score = 0;
    background(0);
    textAlign(CENTER);
    textSize(300);
    fill('red');
    text("MISS!", width / 2, height / 2);
    fill(255);
  }
}



function bounce() {
  //collision detect
  var hit = collideRectCircle(brick.bX - brick.bW / 2, brick.bY - brick.bH / 2, brick.bW, brick.bH, ball.xPos, ball.yPos, ball.r);



  if (hit == true) {
    // console.log("hit");
    score++;
    if (score > highScore) {
      highScore = score;
    }
    // console.log(int(100 * ball.xSpd));
    // console.log(int(100 * ball.ySpd));

    //random the ball orientation
    if (cd < 1) {
      if (brick.bX == 0 || brick.bX == width) {
        ball.xSpd *= -1;
        // ball.ySpd = random(-1, 1);
        ball.ySpd = random(-1, 1);
        cd = 10;
        // ball.xSpd = ball.ySpd / abs(ball.ySpd) * sqrt(1 - ball.ySpd * ball.ySpd);
      } else if (brick.bY == 0 || brick.bY == height) {
        ball.ySpd *= -1;
        ball.xSpd = random(-1, 1);
        cd = 10;
        // ball.ySpd = ball.xSpd / abs(ball.xSpd) * sqrt(1 - ball.xSpd * ball.xSpd);
      }
    }


    // if (brick.bX == 0 || brick.bX == width) {
    //   ball.ySpd = (ball.yPos - brick.bY - brick.bH / 2) / brick.bH * 2;
    //   ball.xSpd = ball.ySpd / abs(ball.ySpd) * sqrt(1 - ball.ySpd * ball.ySpd);
    //   console.log("x=" + ball.xSpd);
    //   console.log("y=" + ball.ySpd);
    // } else if (brick.bY == 0 || brick.bY == height) {
    //   ball.xSpd = (ball.xPos - brick.bX - brick.bW / 2) / brick.bW * 2;
    //   ball.ySpd = ball.xSpd / abs(ball.xSpd) * sqrt(1 - ball.xSpd * ball.xSpd);
    //   console.log("x=" + ball.xSpd);
    //   console.log("y=" + ball.ySpd);
    // }
  }
}

function balls() {
  //ball parameters
  this.r = 30;
  this.xSpd;
  this.ySpd;
  this.xPos = width / 2;
  this.yPos = height / 2;

  this.move = function () {
    this.xPos += this.xSpd * 10;
    this.yPos += this.ySpd * 10;
    // console.log(this.xPos);
    // console.log(this.yPos);
    noFill();
    ellipse(this.xPos, this.yPos, this.r);
    imageMode(CENTER);
    image(bl1, this.xPos, this.yPos, this.r, this.r);
  }

}

function bricks() {
  //brick parameters
  this.bX;
  this.bY;
  this.bW;
  this.bH;
  var k = height / width;
  var brickOrien;

  this.brickMove = function () {
    var m = k * mouseX - mouseY;
    var n = height - k * mouseX - mouseY;
    var a = mouseX - width / 2;
    var b = mouseY - height / 2;
    //mouseXY -> brick position
    if (m * n > 0) {
      this.bW = 200;
      this.bH = 50;
      brickOrien = 0;
      if (b > 0) {
        this.bY = height;
        this.bX = height / 2 * a / b + width / 2;
      } else {
        this.bY = 0;
        this.bX = -height / 2 * a / b + width / 2;
      }
    } else if (m * n < 0) {
      this.bW = 50;
      this.bH = 200;
      brickOrien = 1;
      if (a > 0) {
        this.bY = width / 2 * b / a + height / 2;
        this.bX = width;
      } else {
        this.bY = -width / 2 * b / a + height / 2;
        this.bX = 0;
      }
    } else {
      this.bX = -500;
      this.bY = -500;
    }

    // console.log(this.bX);
    // console.log(this.bY);
  }

  this.brickRect = function () {
    //create brick
    rectMode(CENTER);
    noFill();
    rect(this.bX, this.bY, this.bW, this.bH);
    imageMode(CENTER);
    // rotate(brickOrien);
    if (brickOrien == 0) {
      image(bk1a, this.bX, this.bY, this.bW, this.bH);
    } else {
      image(bk1b, this.bX, this.bY, this.bW, this.bH);
    }
    // image();
  }
}
