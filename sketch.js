var brick;
var brickScaleX = 1,
  brickScaleY = 1;
var ball;
var score = 0,
  prevscore = 0;
var highScore = 0;
var cd = 0;
var myCanvas;
var music, hitSound, fallSound;
var motionBlur = false,
  soundEffects = true;
let bg1, bl1, bk1a, bk1b;


function preload() {
  music = loadSound('assets/Theme music cutted.mp3');
  hitSound = loadSound('assets/hit.wav');
  fallSound = loadSound('assets/fall.wav');
  bg1 = loadImage('assets/background1.png');
  bl1 = loadImage('assets/ball1.png');
  bk1a = loadImage('assets/brick1a.png');
  bk1b = loadImage('assets/brick1b.png');
}


function setup() {
  music.setVolume(0.1);
  music.loop();
  select('#btnMB').style('color', '#e94e1a');

  // toggleFullscreen(document.documentElement); // the whole page
  frameRate(60);
  // document.getElementById('btnFullscreen').addEventListener('click', function() {
  //   toggleFullscreen();
  // });

  // myCanvas = createCanvas(windowWidth*0.9, windowHeight*0.9);
  myCanvas = createCanvas(1000, 1000);
  noStroke();
  ball = new balls();
  brick = new bricks();
  ball.xSpd = random(-1, 1);
  ball.ySpd = ball.xSpd / abs(ball.xSpd) * sqrt(1 - ball.xSpd * ball.xSpd);

  select('#btnFullscreen').mousePressed(toggleFullscreen);
  select('#btnMute').mouseClicked(MuteMusic);
  select('#btnMB').mouseClicked(ToggleMotionBlur);
  select('#btnSoundEffects').mouseClicked(ToggleSoundEffects);

  if (windowHeight < windowWidth) {
    myCanvas.style('height', '90%');
    myCanvas.style('width', 'auto');
    // select("#setting").style('transform','translate(-'++'px,-50%)');
  } else {
    myCanvas.style('height', 'auto');
    myCanvas.style('width', '90%');
  }
}


//1 在draw()读取ball的状态,读取score，读取其他brick状态;
//2 每当bounce()触发之后，上传ball的状态;
//3 在服务器端运算ball.move();
//4 在server判断gameOver()的触发;


function draw() {
  // myCanvas.position(-0.1*(winMouseX-width), -0.1*(winMouseY-height));
  // background(0, 0, 0, 25);
  //Motion Blur
  if (motionBlur == true) {
    push();
    tint(255, 255, 255, 150);
    image(bg1, 500, 500, 1000, 1000);
    pop();
  } else {
    image(bg1, 500, 500, 1000, 1000);
  }

  touchPt();

  // textAlign(CENTER);
  // textFont('Press Start 2P');
  // textSize(100);
  // push();
  // colorMode(HSB);
  // fill(frameCount % 360, 225, 180);
  // text(score, width / 2, 400);
  // textSize(50);
  // text("HIGHSCORE: " + highScore, width / 2, 625);
  // pop();
  // fill(255);

  select('#currentScore').html(score);
  select('#Highscore').html(highScore);


  cd = constrain(cd - 1, 0, 10);
  brickScaleX = constrain(brickScaleX + 0.05, 0.6, 1);
  brickScaleY = constrain(brickScaleY + 0.05, 0.6, 1);
  // console.log(cd);
  // console.log(brickScaleX + " " + brickScaleY);


  bounce();
  gameOver();
  ball.move();
  brick.brickMove();
  brick.brickRect();
}

function ResetTouchPt() {
  select('#lvl1').html('▇');
  select('#lvl2').html('▇');
  select('#lvl3').html('▇');
  select('#lvl4').html('▇');
  select('#lvl5').html('▇');
  select('#lvl6').html('▇');
}

function touchPt() {
  var touchpoint = [0, 5, 10, 15, 20, 25, 30];
  var lvl = "#lvl1";
  var i;
  for (i = 0; i < 7; i++) {
    if (score < touchpoint[i]) {
      lvl = "#lvl" + i;
      if (i > 1) {
        prevscore = touchpoint[i - 2];
      } else {
        prevscore = 0;
      }
      // console.log(lvl);
      // console.log(prevscore);
      break;
    } else if (score >= touchpoint[6]) {
      lvl = "#lvl6";
      break;
    }
  }
  ResetTouchPt();
  select(lvl).html('👉▇');
}

function gameOver() {
  //reset ball postion
  if (abs(ball.xPos - width / 2) > width / 2 + 100 || abs(ball.yPos - height / 2) > height / 2 + 100) {
    if (soundEffects == true) {
      fallSound.setVolume(0.1);
      fallSound.play();
    }
    ball.xPos = random(0.25, 0.75) * width;
    ball.yPos = random(0.25, 0.75) * height;
    score = prevscore;
  }
}



function bounce() {
  //collision detect
  var hit = collideRectCircle(brick.bX - brick.bW / 2, brick.bY - brick.bH / 2, brick.bW, brick.bH, ball.xPos, ball.yPos, ball.r);

  if (hit == true && cd == 0) {
    // console.log("hit");
    if (soundEffects == true) {
      hitSound.setVolume(1);
      hitSound.play();
    }
    score++;
    if (score > highScore) {
      highScore = score;
    }
    // console.log(int(100 * ball.xSpd));
    // console.log(int(100 * ball.ySpd));

    //random the ball orientation
    if (brick.bX == 0 || brick.bX == width) {
      ball.xSpd *= -1;
      // ball.ySpd = random(-1, 1);
      ball.ySpd = random(constrain(-brick.bY / height * 2, -1, 0), constrain(2 - 2 * brick.bY / height, 0, 1));
      cd = 10;
      brickScaleX = 0.6;
      // ball.xSpd = ball.ySpd / abs(ball.ySpd) * sqrt(1 - ball.ySpd * ball.ySpd);
    } else if (brick.bY == 0 || brick.bY == height) {
      ball.ySpd *= -1;
      // ball.xSpd = random(-1, 1);
      ball.xSpd = random(constrain(-brick.bX / width * 2, -1, 0), constrain(2 - 2 * brick.bX / width, 0, 1));
      cd = 10;
      brickScaleY = 0.6;
      // ball.ySpd = ball.xSpd / abs(ball.xSpd) * sqrt(1 - ball.xSpd * ball.xSpd);
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
  this.bX = 0;
  this.bY = 0;
  this.bW = 200;
  this.bH = 50;
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
    push();
    translate(this.bX, this.bY);
    scale(brickScaleX, brickScaleY);
    translate(-this.bX, -this.bY);
    if (brickOrien == 0) {
      image(bk1a, this.bX, this.bY, this.bW, this.bH);
    } else {
      image(bk1b, this.bX, this.bY, this.bW, this.bH);
    }
    pop();
    // image();
  }
}



function MuteMusic() {
  if (music.isLooping()) {
    music.pause();
    select('#btnMute').style('color', '#e94e1a');
    select('#btnMute').html('× Music');
  } else {
    music.loop();
    select('#btnMute').style('color', 'white');
    select('#btnMute').html('√ Music');
  }
}

function ToggleSoundEffects() {
  if (soundEffects == true) {
    soundEffects = false;
    select('#btnSoundEffects').style('color', '#e94e1a');
    select('#btnSoundEffects').html('× Sound Effects');
  } else {
    soundEffects = true;
    select('#btnSoundEffects').style('color', 'white');
    select('#btnSoundEffects').html('√ Sound Effects');
  }
}

function ToggleMotionBlur() {
  if (motionBlur == true) {
    motionBlur = false;
    select('#btnMB').style('color', '#e94e1a');
    select('#btnMB').html('× Motion Blur');
  } else {
    motionBlur = true;
    select('#btnMB').style('color', 'white');
    select('#btnMB').html('√ Motion Blur');
  }
}

function toggleFullscreen(elem) {
  elem = elem || document.documentElement;
  if (!document.fullscreenElement && !document.mozFullScreenElement &&
    !document.webkitFullscreenElement && !document.msFullscreenElement) {

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      select('#btnFullscreen').html('√ Fullscreen');
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
      select('#btnFullscreen').html('√ Fullscreen');
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
      select('#btnFullscreen').html('√ Fullscreen');
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      select('#btnFullscreen').html('√ Fullscreen');
    }
  } else {

    if (document.exitFullscreen) {
      document.exitFullscreen();
      select('#btnFullscreen').html('× Fullscreen');
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
      select('#btnFullscreen').html('× Fullscreen');
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
      select('#btnFullscreen').html('× Fullscreen');
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
      select('#btnFullscreen').html('× Fullscreen');
    }
  }
}


function touchMoved() {
  return false; //CANVAS NO MOVING
}
