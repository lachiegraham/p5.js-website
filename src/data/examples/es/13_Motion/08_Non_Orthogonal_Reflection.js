/*
 * @name Non Orthogonal Reflection 2
 * @arialabel A white circle bounces around a black screen and on a grey slanted floor leaving a white streak behind it. 
 * @frame 710,400
 * @description This is a port of the "Reflection 2" example from processing.org/examples
 */

// Motion constants
const grav = 0.05;
const damping = 0.8;

// Ground
const numberOfPeaks = 30;
let peaks = [];

// Ball
let ballPosition;
let ballVelocity;
const r = 5;

function setup() {
  createCanvas(710, 400);
    
  // Initialize ball
  ballPosition = createVector(50, 50);
  ballVelocity = createVector(0.5, 0);

  // Initialize ground
  for (var i = 0; i < numberOfPeaks; i++) {
      var peakHeight = random(height - 70, height - 50)
      peaks[i] = createVector(i * width / (numberOfPeaks - 1), peakHeight);
  }
}

function draw() {
  // Background
  fill(0, 15);
  noStroke();
  rect(0, 0, width, height);

  // Draw the ball
  fill(255);
  ellipse(ballPosition.x, ballPosition.y, r * 2);
    
  // Draw the ground
  fill(200);
  beginShape();
  for (var i = 0; i < numberOfPeaks; i++) {
     vertex(peaks[i].x, peaks[i].y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Ball physics
  moveBall();
  checkBoundaryCollision(); 
  checkGroundCollision();
}

function moveBall() {
  ballVelocity.y += grav;
  ballPosition.add(ballVelocity);
}

function checkGroundCollision() {
  for (var i = 0; i < numberOfPeaks - 1; i++) {
    var x1 = peaks[i].x;
    var x2 = peaks[i+1].x;
    var y1 = peaks[i].y;
    var y2 = peaks[i+1].y;
    var avgX = (x1 + x2) / 2;
    var avgY = (y1 + y2) / 2;

    // Get difference between ball and ground
    var deltaX = ballPosition.x - avgX;
    var deltaY = ballPosition.y - avgY;

    // Precalculate trig values
    var rot = atan2(y2-y1,x2-x1);
    var cosine = cos(rot);
    var sine = sin(rot);
    
    /* Rotate ground and velocity to allow
     orthogonal collision calculations */
    var groundXTemp = cosine * deltaX + sine * deltaY;
    var groundYTemp = cosine * deltaY - sine * deltaX;
    var velocityXTemp = cosine * ballVelocity.x + sine * ballVelocity.y;
    var velocityYTemp = cosine * ballVelocity.y - sine * ballVelocity.x;
         
    /* Ground collision - check that the
     ball is within left/right bounds of
     ground segment and it has collided */
    if (ballPosition.x > x1 && ballPosition.x < x2 && groundYTemp > -r) {
      // prevent ball from going into ground
      groundYTemp = -r;
      // Bounce and slow down orb
      velocityYTemp *= -damping;
    }
        
    // Reset ground, velocity and ball
    deltaX = cosine * groundXTemp - sine * groundYTemp;
    deltaY = cosine * groundYTemp + sine * groundXTemp;
    ballVelocity.x = cosine * velocityXTemp - sine * velocityYTemp;
    ballVelocity.y = cosine * velocityYTemp + sine * velocityXTemp;
    ballPosition.x = avgX + deltaX;
    ballPosition.y = avgY + deltaY;
  }
}

function checkBoundaryCollision() {
  if (ballPosition.x < r) {
    ballPosition.x = r;
    ballVelocity.x *= -damping;
  } else if (ballPosition.x > width - r) {
    ballPosition.x = width - r;
    ballVelocity.x *= -damping;
  }
}