ArrayList<Ball> balls = new ArrayList();
int anzahl = 15;

void setup() {
  size(600, 600);
  fill(0);
  noStroke();

  for (int i=0; i<anzahl; i++) {
    Ball b = new Ball();
    b.speedX = random(-3, 3);
    b.speedY = random(-3, 3);
    b.x = random(50, width-50);
    b.y = random(50, height-50);
    b.r = random(10, 60);
    balls.add(b);
  }

  /*
  Ball b = balls.get(0);
   b.x = 300;
   b.y = 300;
   b.speedX = 0;
   b.speedY = 0;
   b.r = 60;
   */
}

void draw() {
  background(255);

  // one circle follows the mouse
  
  if (mouseX != 0 || mouseY != 0) {
   Ball b = balls.get(0);
   b.speedX += (mouseX - b.x) * 0.01;
   b.speedY += (mouseY - b.y) * 0.01;
   b.speedX *= 0.95;
   b.speedY *= 0.95;
   }
   


  for (int i=0; i<balls.size ()-1; i++) {
    for (int j=i+1; j<balls.size (); j++) {
      if (i != j) {
        //println("collide " + i + " with " + j);
        balls.get(i).collideWith(balls.get(j));
      }
    }
  }

  for (int i=0; i<balls.size (); i++) {
    balls.get(i).draw();
  }

  //println(" ");
}


class Ball {
  float x = 100;
  float y = 100;
  float speedX = 4;
  float speedY = 3;
  float r = 20;
  //float mass = 1;


  void draw() {
    // gravity
    //speedY += 0.1;

    // friction
    //speedX *= 0.995;
    //speedY *= 0.995;

    x += speedX;
    y += speedY;

    if (x>width-r  || x<r) {
      x = constrain(x, r, width-r);
      speedX *= -1;
    }
    if (y>height-r || y<r) { 
      y = constrain(y, r, height-r);
      speedY *= -1;
    }

    ellipse( x, y, r*2, r*2 );
  }

  void collideWith(Ball other) {
    // if there is a collision
    if ( dist(other.x, other.y, this.x, this.y) < other.r+this.r ) {
      float thisMass = this.r * this.r;
      float otherMass = other.r * other.r;

      // vector from this to other
      float dx = other.x - this.x;
      float dy = other.y - this.y;
      // normal vector on (dx,dy)
      float nx = -dy;
      float ny = dx;

      // seperate circle overlapping
      float l = mag(dx, dy);
      float fac = (this.r+other.r)*1.01 / l;
      dx = dx * fac;
      dy = dy * fac;
      this.x -= (fac-1)/2 * dx;
      this.y -= (fac-1)/2 * dy;
      other.x += (fac-1)/2 * dx;
      other.y += (fac-1)/2 * dy;


      // orthogonal projection of the speed vector on (nx, ny) 
      // http://de.wikipedia.org/wiki/Orthogonalprojektion
      // FN = factor to multiply with vector (nx, ny)
      float thisFN = (this.speedX*nx + this.speedY*ny) / (nx*nx + ny*ny);
      float otherFN = (other.speedX*nx + other.speedY*ny) / (nx*nx + ny*ny);

      // orthogonal projection of the speed vector on (dx, dy)
      // F = factor to multiply with vector (dx, dy)
      float thisF = (this.speedX*dx + this.speedY*dy) / (dx*dx + dy*dy);
      float otherF = (other.speedX*dx + other.speedY*dy) / (dx*dx + dy*dy);

      // transfer impulses
      // http://de.wikipedia.org/wiki/Sto%C3%9F_%28Physik%29
      float thisFnew = 2 * (thisMass*thisF + otherMass*otherF) / (thisMass+otherMass) - thisF;
      float otherFnew = 2 * (thisMass*thisF + otherMass*otherF) / (thisMass+otherMass) - otherF;

      this.speedX = thisFN * nx + thisFnew * dx;
      this.speedY = thisFN * ny + thisFnew * dy;
      other.speedX = otherFN * nx + otherFnew * dx;
      other.speedY = otherFN * ny + otherFnew * dy;

      // reduce speed on each contact
      //this.speedX *= 0.9;
      //this.speedY *= 0.9;
      //other.speedX *= 0.9;
      //other.speedY *= 0.9;
    }
  }
}


