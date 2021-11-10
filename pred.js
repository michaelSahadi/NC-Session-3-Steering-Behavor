// Setup Dino
function Pred(x, y) {
	this.pos = createVector(x, y);
	this.vel = createVector(0, 0);
	this.acc = createVector(0, 0);
	this.maxspeed = 2.0;
	this.maxforce = 0.05;
	this.r = 40;
	this.splat = false;

// Apply forces
	this.applyForce = function (force) {
		this.acc.add(force);
	};
// Sets up which functions to run
	this.run = function(boid){
		pred.borders();
		pred.update();
		pred.eat(boid);
		pred.display();

	}
// Find the closest Dude
	this.eat = function (list) {
		var record = Infinity;
		var closest = -1;
		for (var i = 0; i < list.length; i++) {
			var d = this.pos.dist(list[i].pos);
			if (d < record) {
				record = d;
				closest = i;
			}
		}
//  if "caught" remove Dude from array
		if (record < 155) {
			this.splat = true;
			list.splice(closest, 1);
			console.log(this.splat);
// Else keep looking 
		} else if (closest > -1) {
			this.seek(list[closest].pos);
			this.splat = false;
		 } 
	};
// Steer towards closest Dude identified in this.eat
	this.seek = function (target) {
		var desired = p5.Vector.sub(target, this.pos);
		desired.setMag(this.maxspeed);
		var steer = p5.Vector.sub(desired, this.vel);
		steer.limit(this.maxforce);
		this.applyForce(steer);
	};
// Update position
	this.update = function () {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	};
// Display
	this.display = function (splat) {
		if (this.vel.x > 0) {
			image(dino, this.pos.x, this.pos.y, this.r * 8, this.r * 7);
		} else {
			image(dino2, this.pos.x, this.pos.y, this.r * 8, this.r * 7);
		}
	};
// Allows Dino to move past edges
	this.borders = function () {
		if (this.pos.x < -this.r) this.pos.x = width + this.r;
		if (this.pos.y < -this.r) this.pos.y = height + this.r;
		if (this.pos.x > width + this.r) this.pos.x = -this.r;
		if (this.pos.y > height + this.r) this.pos.y = -this.r;
	};
}
