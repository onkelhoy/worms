import GameObject from "../util/GameObject";
import { Vector2 } from "./Vector";

export default class Line extends GameObject {
  constructor (x1, y1, x2, y2) {
    super(x1, y1)

    this.b = new Vector2(x2, y2)
  }

  get a () {
    return this 
  }

  set a (vector) {
    Vector2.Check(vector)
    this.x = vector.x 
    this.y = vector.y
  }

  Render (ctx, color = 'black') {
    this.renderShape(ctx, color, 'stroke', draw => {
      draw.moveTo(this.x, this.y)
      draw.lineTo(this.b.x, this.b.y)
      draw.arc(this.x, this.y, 2, 0, Math.PI*2)
      draw.arc(this.b.x, this.b.y, 2, 0, Math.PI*2)
    })
  } 
}