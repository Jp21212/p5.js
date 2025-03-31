// Array to store the shapes
let shapes = [];
let bgColorIndex = 0;
const bgColors = ['#1E1E1E', '#3498db', '#e74c3c', '#2ecc71', '#f39c12'];
let lastShapeAddedTime = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    frameRate(60); // Set a high frame rate for smoother animations
}

// Main draw function
function draw() {
    // Dynamic background color based on the current index
    background(bgColors[bgColorIndex]);

    // Loop through shapes array and display each shape
    for (let i = shapes.length - 1; i >= 0; i--) {
        let shape = shapes[i];
        shape.update();
        shape.display();

        // If the shape's opacity is zero, remove it from the array
        if (shape.alpha <= 0) {
            shapes.splice(i, 1);
        }
    }

    // Automatically add a new shape after a certain time interval
    if (millis() - lastShapeAddedTime > 1000) {
        let newShape = new RandomShape(random(width), random(height), random(['circle', 'rectangle', 'triangle', 'polygon']));
        shapes.push(newShape);
        lastShapeAddedTime = millis();
    }
}

// Handle key press events
function keyPressed() {
    if (keyCode === RIGHT_ARROW) {
        bgColorIndex = (bgColorIndex + 1) % bgColors.length;
    } else if (keyCode === LEFT_ARROW) {
        bgColorIndex = (bgColorIndex - 1 + bgColors.length) % bgColors.length;
    }
}

// Handle mouse pressed events to create random shapes
function mousePressed() {
    let shapeType = random(['circle', 'rectangle', 'triangle', 'polygon']);
    let newShape = new RandomShape(mouseX, mouseY, shapeType);
    shapes.push(newShape);
}

// RandomShape class to generate different types of shapes with random properties
class RandomShape {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = random(30, 100);
        this.alpha = 255;
        this.color = color(random(255), random(255), random(255), this.alpha);
        this.speed = random(0.5, 2);
        this.rotation = random(TWO_PI);
        this.scaleFactor = random(0.5, 1.5);
        this.angleSpeed = random(0.01, 0.05);
        this.scaleSpeed = random(0.01, 0.05);
        this.points = [];
        this.numPoints = int(random(3, 8)); // For polygons
        this.createPolygon();
    }

    // Update method for shape properties like aging, movement, scaling, and rotation
    update() {
        this.alpha -= 1; // Gradually fade out the shape
        this.x += cos(this.rotation) * this.speed;
        this.y += sin(this.rotation) * this.speed;
        
        // Rotate and scale the shape over time
        this.rotation += this.angleSpeed;
        this.scaleFactor += this.scaleSpeed;
        
        if (this.scaleFactor > 2 || this.scaleFactor < 0.5) {
            this.scaleSpeed *= -1; // Reverse scaling direction when it exceeds the limits
        }
    }

    // Create a polygon shape with random points
    createPolygon() {
        this.points = [];
        for (let i = 0; i < this.numPoints; i++) {
            let angle = map(i, 0, this.numPoints, 0, TWO_PI);
            let radius = this.size / 2;
            let xOffset = cos(angle) * radius;
            let yOffset = sin(angle) * radius;
            this.points.push(createVector(this.x + xOffset, this.y + yOffset));
        }
    }

    // Display method for drawing the shape on the canvas
    display() {
        fill(this.color);
        push();
        translate(this.x, this.y);
        scale(this.scaleFactor);
        rotate(this.rotation);
        
        if (this.type === 'circle') {
            ellipse(0, 0, this.size);
        } else if (this.type === 'rectangle') {
            rectMode(CENTER);
            rect(0, 0, this.size, this.size);
        } else if (this.type === 'triangle') {
            triangle(
                0, -this.size / 2,
                -this.size / 2, this.size / 2,
                this.size / 2, this.size / 2
            );
        } else if (this.type === 'polygon') {
            beginShape();
            for (let p of this.points) {
                vertex(p.x - this.x, p.y - this.y);
            }
            endShape(CLOSE);
        }
        pop();
    }
}

// Handle window resizing
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
