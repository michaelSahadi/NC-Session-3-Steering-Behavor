// Setup Dude
function Boid(x, y) {
	this.pos = createVector(x, y);
	this.vel = createVector(0, 0);
	this.acc = createVector(0, 0);
	this.maxspeed = 5.0;
	this.maxforce = 1;
	this.r = 5.0;

	// Applies Forces
	this.applyForce = function (force) {
		this.acc.add(force);
	};

	// Sets up which functions to run
	this.run = function (boids) {
		this.flock(boids);
		this.update();
		this.edges();
		this.display();
	};

	// Sets up values for flocking
	this.flock = function (boids) {
		let sep = this.separate(boid); // Separation
		let ali = this.align(boid); // Alignment
		let coh = this.cohesion(boid); // Cohesion

		sep.mult(2.5);
		ali.mult(1.0);
		coh.mult(1.0);

		this.applyForce(sep);
		this.applyForce(ali);
		this.applyForce(coh);
	};

	// Seek function
	this.seek = function (target) {
		let desired = p5.Vector.sub(target, this.pos); // A vector pointing from the location to the target
		// Normalize desired and scale to maximum speed
		desired.normalize();
		desired.mult(this.maxspeed);
		// Steering = Desired minus Velocity
		let steer = p5.Vector.sub(desired, this.vel);
		steer.limit(this.maxforce); // Limit to maximum steering force
		return steer;
	};

	// Seperate function
	this.separate = function (boid) {
		let desiredseparation = 25.0;
		let steer = createVector(0, 0);
		let count = 0;
		// For every boid in the system, check if it's too close
		for (let i = 0; i < boid.length; i++) {
			let d = p5.Vector.dist(this.pos, boid[i].pos);
			// If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
			if (d > 0 && d < desiredseparation) {
				// Calculate vector pointing away from neighbor
				let diff = p5.Vector.sub(this.pos, boid[i].pos);
				diff.normalize();
				diff.div(d); // Weight by distance
				steer.add(diff);
				count++; // Keep track of how many
			}
		}
		if (count > 0) {
			steer.div(count);
		}

		// As long as the vector is greater than 0
		if (steer.mag() > 0) {
			// Implement Reynolds: Steering = Desired - Velocity
			steer.normalize();
			steer.mult(this.maxspeed);
			steer.sub(this.vel);
			steer.limit(this.maxforce);
		}
		return steer;
	};

	// Aligns everyone up
	this.align = function (boid) {
		let neighbordist = 50;
		let sum = createVector(0, 0);
		let count = 0;
		for (let i = 0; i < boid.length; i++) {
			let d = p5.Vector.dist(this.pos, boid[i].pos);
			if (d > 0 && d < neighbordist) {
				sum.add(boid[i].vel);
				count++;
			}
		}
		if (count > 0) {
			sum.div(count);
			sum.normalize();
			sum.mult(this.maxspeed);
			let steer = p5.Vector.sub(sum, this.vel);
			steer.limit(this.maxforce);
			return steer;
		} else {
			return createVector(0, 0);
		}
	};

	// Cohesion
	this.cohesion = function (boid) {
		let neighbordist = 50;
		let sum = createVector(0, 0); // Start with empty vector to accumulate all locations
		let count = 0;
		for (let i = 0; i < boid.length; i++) {
			let d = p5.Vector.dist(this.pos, boid[i].pos);
			if (d > 0 && d < neighbordist) {
				sum.add(boid[i].pos); // Add location
				count++;
			}
		}
		if (count > 0) {
			sum.div(count);
			return this.seek(sum); // Steer towards the location
		} else {
			return createVector(0, 0);
		}
	};

	// Run from dino
	this.escape = function (pred) {
		var desiredseparation = 180;
		var sum = createVector();
		var count = 0;
		for (var i = 0; i < boid.length; i++) {
			// For every boid in the system, check if it's too close
			var d = p5.Vector.dist(this.pos, pred.pos);
			if (d > 0 && d < desiredseparation) {
				// If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
				var diff = p5.Vector.sub(this.pos, pred.pos); // Calculate vector pointing away from neighbor
				diff.normalize();
				diff.div(d); // Weight by distance
				sum.add(diff);
				count++; // Keep track of how many
			}
		}
		if (count > 0) {
			sum.div(count);
			// Our desired vector is the average scaled to maximum speed
			sum.normalize();
			sum.mult(this.maxSpeed);
			// Implement Reynolds: Steering = Desired - Velocity
			var steer = p5.Vector.sub(sum, this.vel);
			steer.limit(this.maxForce);
			this.applyForce(steer);
			// console.log(steer);
		}
	};

	// Up dates position
	this.update = function () {
		this.vel.add(this.acc);
		this.vel.limit(this.maxspeed);
		this.pos.add(this.vel);
		this.acc.mult(0);
	};

	// Display
	this.display = function () {
		image(dude, this.pos.x, this.pos.y, this.r * 10, this.r * 14);
	};

	// Edges
	this.edges = function () {
		if (this.pos.x < -this.r) this.pos.x = width + this.r;
		if (this.pos.y < -this.r) this.pos.y = height + this.r;
		if (this.pos.x > width + this.r) this.pos.x = -this.r;
		if (this.pos.y > height + this.r) this.pos.y = -this.r;
	};
}
