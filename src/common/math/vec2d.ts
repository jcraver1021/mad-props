export class Vec2D {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(v: Vec2D) {
    return new Vec2D(this.x + v.x, this.y + v.y);
  }

  scale(a: number) {
    return new Vec2D(this.x * a, this.y * a);
  }

  rotateLeft() {
    return new Vec2D(-this.y, this.x);
  }

  rotateRight() {
    return new Vec2D(this.y, -this.x);
  }

  invert() {
    return new Vec2D(-this.x, -this.y);
  }
}
