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

  sub(v: Vec2D) {
    return new Vec2D(this.x - v.x, this.y - v.y);
  }

  scale(a: number) {
    return new Vec2D(this.x * a, this.y * a);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  magnitudeSq() {
    return this.x * this.x + this.y * this.y;
  }

  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vec2D(0, 0);
    return this.scale(1 / mag);
  }

  dot(v: Vec2D) {
    return this.x * v.x + this.y * v.y;
  }

  distanceTo(v: Vec2D) {
    return this.sub(v).magnitude();
  }

  rotate(angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vec2D(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
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

  clone() {
    return new Vec2D(this.x, this.y);
  }
}
