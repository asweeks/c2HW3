// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];

var x, y;
var vx, vy;
var leftPaddle;
var rightPaddle;

var ln;
var rn;

var cl = 0;

var rs = 0;
var ls = 0;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();

  x = width / 2;
  y = height / 2;
  vx = 3;
  vy = 1.2;

  leftPaddle = height / 2;
  rightPaddle = height / 2;

  rectMode(CENTER);
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {

  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  //   drawKeypoints();
  //   drawSkeleton();

  // background(220);

  rect(20, leftPaddle, 10, 50);
  rect(width - 20, rightPaddle, 10, 50);

  ellipse(x, y, 20);
  if (cl > 0) {
    x = x + vx;
    y = y + vy;

    if (y < 10) {
      vy = -vy;
    }
    if (y > height - 10) {
      vy = -vy;
    }
    if (x < 35) {
      if (y < leftPaddle + 25 && y > leftPaddle - 25) {
        vx = -vx;
      } else {
        // game over
      }
    }
    if (x > width - 35) {
      if (y < rightPaddle + 25 && y > rightPaddle - 25) {
        vx = -vx;
      } else {
        // game over
      }
    }

    //Scoring

    text(ls, 40, 60);
    text(rs, width - 70, 60);

    if (rs >= 3) {
      text('Right Player Wins!', 100, 100);
      // rs = 0;
      // ls = 0;
      noLoop();

    }

    if (ls >= 3) {
      text('Left Player Wins!', 100, 100);
      // ls = 0;
      // rs = 0;
      noLoop();

    }

    if (x > width) {
      ls += 1;
      x = width / 2;
      y = height / 2;
    }

    if (x < 0) {
      rs += 1;
      x = width / 2;
      y = height / 2;
    }

  }
  stroke(255, 255, 255);
  fill(255, 255, 255);
  textSize(50);
  text(ls, 40, 60);
  text(rs, width - 70, 60);

  if (poses.length == 1) {
    rightPaddle = poses[0].pose.nose.y
  }
//Code for norm
  // if (poses.length >= 2) {
  //   print(poses[0].pose);
  //   if (poses[0].pose.nose.x < poses[1].pose.nose.x) {
  //     leftPaddle = poses[0].pose.nose.y;
  //     rightPaddle = poses[1].pose.nose.y;
  //   } else {
  //     leftPaddle = poses[1].pose.nose.y;
  //     rightPaddle = poses[0].pose.nose.y;
  //   }
  // }
  
  //Challenge?
  if (poses.length >= 2) {
    
    for (let i = 1; i < poses.length; i++) {
      if ((poses[i].pose.leftEye.x - poses[i].pose.rightEye.x) > (poses[i - 1].pose.leftEye.x - poses[i - 1].pose.rightEye.x) && poses[i].pose.nose.x > width / 2) {
        rightPaddle = poses[i].pose.nose.y;
      }

      if ((poses[i].pose.leftEye.x - poses[i].pose.rightEye.x) > (poses[i - 1].pose.leftEye.x - poses[i - 1].pose.rightEye.x) && poses[i].pose.nose.x < width / 2) {
        leftPaddle = poses[i].pose.nose.y;
      }
    }
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}


function mousePressed() {
  cl++;
}
