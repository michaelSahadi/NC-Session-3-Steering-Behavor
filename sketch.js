// Michael Sahadi
// Session 3
var boid = [];
var pred;
var dude;
var dino;
var dino2;
var bg;

function preload() {
	dude = loadImage('Images/dude.png');
	dino = loadImage('Images/dino.png');
	dino2 = loadImage('Images/dino2.png');
	bg = loadImage('Images/background.png');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	imageMode(CENTER);
	pred = new Pred(width / 2, height / 2);

	// Fill the array
	for (var i = 0; i < 250; i++) {
		var x = floor(random(width));
		var y = floor(random(height));
		boid.push(new Boid(x, y));
	}
}

function draw() {
	image(bg, width / 2, height / 2, width, height);

	for (var i = 0; i < boid.length; i++) {
		boid[i].escape(pred);
		boid[i].run(boid);
	}
	// pred.borders();
	// pred.update();
	// pred.eat(boid);
	// pred.display();
	pred.run(boid);
}
