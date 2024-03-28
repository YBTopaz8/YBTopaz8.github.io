
let heartRateData;
let dataArray;
let particles = [];


let currentFileIndex = 0; // Start with the first file
let fileNames = [
  'AllHearRates/heart_rate-2023-03-11.json',
  'AllHearRates/heart_rate-2024-01-04.json',
  // Add more file names as needed
];

function preload() {
    
    dataArray = loadJSON(fileNames[currentFileIndex]); // Load the current file

}
function setup() {
  createCanvas(1200, 800);
  //createCanvas(windowWidth, windowHeight);
  if (dataArray !== null && typeof dataArray === 'object') {
  heartRateData = Object.values(dataArray);
  // Call the createParticles function to create particles for the current file
  createParticles();
  } else {
  console.error('heartRateData is undefined or null');
  }
  frameRate(24);
  }

function createParticles() {
  // create particles for each data point
    for (let i = 0; i < heartRateData.length; i++) 
    {
      let bpm = heartRateData[i].value.bpm;
      let confidence = heartRateData[i].value.confidence;
      let p = new Particle(bpm, confidence);
      particles.push(p);
    }
  }
 
let frameCounter = 0;
function draw() {
background(105); // to remove trail

// Update and display each particle
for (let j = particles.length - 1; j >= 0; j--) {
particles[j].update();


particles[j].display();

// Remove particles that have gone off-screen
if (particles[j].isOffScreen()) {
particles.splice(j, 1);
}
}

// Increment frame counter
frameCounter++;

// Check if frame counter has reached 120
if (frameCounter >= 120) {
 
  // Determine the maximum value
let maxValue = Math.max(nbRed, nbBlack, nbLB, nbOrange);

// Find out which variable has the maximum value
let maxName;
switch (maxValue) {
    case nbRed: maxName = 'nbRed'; break;
    case nbBlack: maxName = 'nbBlack'; break;
    case nbLB: maxName = 'nbLB'; break;
    case nbOrange: maxName = 'nbOrange'; break;
}

  noLoop();
  console.log("Number of red: ",nbRed, " Orange:", nbOrange ," blue: ", nbLB, " back: ", nbBlack);
}
}

class Particle {
  constructor(bpm) {
    // this.position = createVector(width / 2, height / 2); // Start at the center of the canvas
    // this.velocity = p5.Vector.fromAngle(random(TWO_PI), map(bpm, 0, 200, 1, 5)); // Calculate a random velocity based on the bpm and a random angle
    
    // this.acceleration = createVector(0, 0);
    // this.color = getColor(confidence);

    this.position = createVector(width / 2, height / 2);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(map(bpm, 40, 190, 1, 5));
    this.acceleration = createVector(0, 0);
    this.bpm = bpm;
    this.color = getColor(bpm);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
  }

  display() {
    // stroke(this.color);
    // strokeWeight(3);
    // point(this.position.x, this.position.y);
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, 10, 10);
  }

  isOffScreen() {
    return (this.position.x < -10 || this.position.x > width + 10 || this.position.y < -10 || this.position.y > height + 10);
  }
}


let nbRed = 0, nbOrange = 0, nbLB = 0, nbBlack = 0;


function getColor(bpm) {
  if (bpm >= 110) 
  {
    nbRed++;
    return color(255, 0, 0); // red for very fast heart rate
  } 
  else if (bpm >= 85) 
  {
    nbOrange++;
    return color(255, 140, 0); // orange for medium heart rate
  } 
  else if (bpm >= 55) 
  {
    nbLB++;
    return color(0, 191, 255); // light blue for slow heart rate
  } else 
  {
    nbBlack++;
    return color(0, 0, 128); // black as default color
  }
}
function keyPressed() {
  if (key === 'R' || key === 'r') {
    // For 'R', restart drawing with the same file
    restartDrawing();
  } else if (key === 'N' || key === 'n') {
    // For 'N', move to the next file, then clear and redraw
    moveToNextFile();
  }
}

function restartDrawing() {
  // Common function to reset and load data for redrawing
  resetEnvironment();
  loadDataFile();
}

function moveToNextFile() {
  // Increment to the next file index
  currentFileIndex = (currentFileIndex + 1) % fileNames.length;
  
  // Reset environment and load the next file
  resetEnvironment();
  loadDataFile();
}

function resetEnvironment() {
  // Clear the current particles and any other variables as needed
  particles = [];
  frameCounter = 0; // Reset frame counter or any other necessary variables
  
  // Ensure the draw loop is running if it was previously stopped
  loop();
}

function loadDataFile() {
  // Load the current data file
  dataArray = loadJSON(fileNames[currentFileIndex], function() {
    if (dataArray !== null && typeof dataArray === 'object') {
      heartRateData = Object.values(dataArray);
      createParticles(); // Recreate particles with the new data
    } else {
      console.error('Failed to load data from', fileNames[currentFileIndex]);
    }
  });
}
