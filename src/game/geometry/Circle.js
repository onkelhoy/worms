import GameObject from "../util/GameObject";

export default class Circle extends GameObject {
  constructor (x, y, r) {
    super(x, y)

    this.r = r 
  }

  get Radius () { return this.r }

  Render (ctx, color = 'black') {
    this.renderShape(ctx, color, 'stroke', draw => 
      draw.arc(this.x, this.y, this.r, 0, Math.PI*2))
  }
}