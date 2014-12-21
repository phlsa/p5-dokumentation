// AniBuilder 1.1

Timeline timeline1 = new Timeline();



// no need to change anything between here ... ---------
final int X = 0;
final int Y = 1;
final int W = 2;
final int H = 3;
final int A = 4;
final int O = 5;
final int G = 6;
final int X_OFFSET = 7;
final int Y_OFFSET = 8;

final int LINEAR = 0;
final int EASE_IN = 1;
final int EASE_OUT = 2;
final int EASE_IN_OUT = 3;
final int SIN_IN = 4;
final int SIN_OUT = 5;
final int SIN_IN_OUT = 6;

float x, y, w, h, a, o, g, x_offset, y_offset;
// ... and here ----------------------------------------


void setup() {
  size(600, 600);
  smooth();
  fill(0);
  noStroke();
  rectMode(CENTER);

  // default values:
  x = 300;  // x-position
  y = 300;  // y-position
  w = 100;   // width
  h = 100;   // height
  a = 0;    // angle
  o = 255;  // opacity (255 = full opacity; 0 = completely transparent)
  g = 0;    // grey-value (0 = black; 255 = white)
  x_offset = 0;  // horizontal offset of the shape from the center
  y_offset = 0;  // vertical offset of the shape from the center

  // keyframes:
  // Time, Property, Value, optional: Easing

  timeline1.setValue( Y, 0 );
  timeline1.setValue( Y_OFFSET, 400 );
  timeline1.addKeyframe( 0, A, -30 );
  timeline1.addKeyframe( 1.5, A, 30, SIN_IN_OUT );
  timeline1.addKeyframe( 3, A, -30, SIN_IN_OUT );
}


void draw() {
  background(255);

  timeline1.draw(); 
}




class Keyframe {
  int id = 0;
  float time = 0;
  Float[] value = {null, null, null, null, null, null, null, null, null, null};
  int easing = LINEAR;
  
  Keyframe(float _time, int _property, float _value) {
    time = _time;
    value[_property] = _value;
  }

  Keyframe(float _time, int _property, float _value, int _easing) {
    time = _time;
    value[_property] = _value;
    easing = _easing;
  }
}
class Timeline {
  int form = ELLIPSE;
  ArrayList<Keyframe> ani = new ArrayList<Keyframe>();
  float[] aniValue = new float[10];
  float aniTime;
  float aniDuration;
  boolean aniStarted = false;

  Timeline() {
  }

  Timeline(int _form) {
    form = _form;
  }

  void start() {
    aniValue[X] = x;
    aniValue[Y] = y;
    aniValue[W] = w;
    aniValue[H] = h;
    aniValue[A] = a;
    aniValue[O] = o;
    aniValue[G] = g;
    aniValue[X_OFFSET] = x_offset;
    aniValue[Y_OFFSET] = y_offset;

    tidyUp();
    aniDuration = ani.get(ani.size()-1).time;

    aniStarted = true;
  }

  void draw() {
    if (!aniStarted) start();

    aniTime = (millis()/1000.0) % aniDuration;

    // find previous and next keyframes of each property
    // and interpolate values
    for (int p = 0; p < aniValue.length; p++) {
      Keyframe prev = prevKey(aniTime, p);
      Keyframe next = nextKey(aniTime, p);

      if (prev!=null && next!=null) {
        float v = 0;
        float t0 = prev.time;
        float v0 = prev.value[p];
        float t1 = next.time;
        float v1 = next.value[p];

        switch (next.easing) {
        case LINEAR:
          v = map(aniTime, t0, t1, v0, v1);
          break;
        case EASE_IN:
          v = map(aniTime, t0, t1, 0, 1);
          v = pow(v, 2);
          v = map(v, 0, 1, v0, v1);
          break;
        case EASE_OUT:
          v = map(aniTime, t0, t1, 1, 0);
          v = pow(v, 2);
          v = map(v, 0, 1, v1, v0);
          break;
        case EASE_IN_OUT:
          v = map(aniTime, t0, t1, 0, 2);
          if (v <= 1) {
            v = pow(v, 2);
            v = map(v/2, 0, 0.5, v0, v0+(v1-v0)/2);
          } 
          else {
            v = pow(2-v, 2);
            v = map(v/2, 0, 0.5, v1, v0+(v1-v0)/2);
          }
          break;
        case SIN_IN:
          v = map(aniTime, t0, t1, -HALF_PI, 0);
          v = sin(v);
          v = map(v, -1, 0, v0, v1);
          break;
        case SIN_OUT:
          v = map(aniTime, t0, t1, 0, HALF_PI);
          v = sin(v);
          v = map(v, 0, 1, v0, v1);
          break;
        case SIN_IN_OUT:
          v = map(aniTime, t0, t1, -HALF_PI, HALF_PI);
          v = sin(v);
          v = map(v, -1, 1, v0, v1);
          break;
        }

        aniValue[p] = v;
      } 
      else if (prev!=null) {
        aniValue[p] = prev.value[p];
      } 
      else if (next!=null) {
        aniValue[p] = next.value[p];
      }
    }

    /*
    for (int p = 0; p < 5; p++) {
     println(aniValue[p]);
     }
     println("");
     */

    pushMatrix();
    translate(aniValue[X], aniValue[Y]);
    rotate(radians(aniValue[A]));
    translate(aniValue[X_OFFSET], aniValue[Y_OFFSET]);

    fill(aniValue[G], aniValue[O]);

    switch (form) {
    case ELLIPSE:
      ellipse(0, 0, aniValue[W], aniValue[H]);
      break;
    case RECT:
      rect(0, 0, aniValue[W], aniValue[H]);
      break;
    case TRIANGLE:
      triangle(0, -aniValue[H]*2/3, aniValue[W]/2, aniValue[H]/3, -aniValue[W]/2, aniValue[H]/3);
      break;
    }
    popMatrix();
  }

  void addKeyframe(float _time, int _property, float _value, int _easing) {
    ani.add(new Keyframe(_time, _property, _value, _easing));
  }
  void addKeyframe(float _time, int _property, float _value) {
    ani.add(new Keyframe(_time, _property, _value));
  }

  void setValue(int _property, float _value) {
    Keyframe k0 = zeroKey(_property);
    if (k0 == null) {
      addKeyframe( 0, _property, _value );
    } 
    else {
      k0.value[_property] = _value;
    }
  }

  void tidyUp() {

    // add keyframes at time 0
    if (zeroKey(X) == null) addKeyframe( 0, X, x );
    if (zeroKey(Y) == null) addKeyframe( 0, Y, y );
    if (zeroKey(W) == null) addKeyframe( 0, W, w );
    if (zeroKey(H) == null) addKeyframe( 0, H, h );
    if (zeroKey(A) == null) addKeyframe( 0, A, a );
    if (zeroKey(O) == null) addKeyframe( 0, O, o );
    if (zeroKey(G) == null) addKeyframe( 0, G, g );
    if (zeroKey(X_OFFSET) == null) addKeyframe( 0, X_OFFSET, x_offset );
    if (zeroKey(Y_OFFSET) == null) addKeyframe( 0, Y_OFFSET, y_offset );

    int lenD = ani.size();

    // sort
    for (int i = 0; i < lenD; i++) {
      for (int j = (lenD-1); j >= (i+1); j--) {
        Keyframe k0 = ani.get(j-1);
        Keyframe k1 = ani.get(j);
        if (k1.time < k0.time) {
          ani.set(j, k0);
          ani.set(j-1, k1);
        }
      }
    }

    //for (int i = 0; i < lenD; i++) {
    //println(ani.get(i).time + ", " + ani.get(i).value);
    //}
  }


  Keyframe zeroKey(int _property) {
    for (int i = 0; i < ani.size(); i++) {
      if (ani.get(i).time == 0 && ani.get(i).value[_property] != null) {
        return ani.get(i);
      }
    }
    return null;
  }

  Keyframe prevKey(float _t, int _property) {
    for (int i = ani.size()-1; i >= 0; i--) {
      if (ani.get(i).time <= _t && ani.get(i).value[_property] != null) {
        return ani.get(i);
      }
    }
    return null;
  }

  Keyframe nextKey(float _t, int _property) {
    for (int i = 0; i < ani.size(); i++) {
      if (ani.get(i).time > _t && ani.get(i).value[_property] != null) {
        return ani.get(i);
      }
    }
    return null;
  }
}


