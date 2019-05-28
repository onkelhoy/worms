import { boundary, GetCanvas } from '../util/Helper'

export default class Water {
  constructor (back, front) {
    this.back = new SingleWater(back, 'rgba(15,94,156,.65)', boundary, 0.018)
    this.front = new SingleWater(front, 'rgba(35,137,218,.5)', boundary, 0.021)
    this.back.canvas.style['z-index'] = 9
    this.front.canvas.style['z-index'] = 11

    this.back.SeaLevel = 120
    this.level = 100
  }

  get SeaLevel () { return this.level }
  set SeaLevel (level) {
    this.level = 100
    this.back.SeaLevel = level + 20
    this.front.SeaLevel = level
  }

  render (cam, zoom) {
    this.back.render(cam, zoom)
    this.front.render(cam, zoom)
  }
}

class SingleWater {
  /**
   * Boundary is the whole world
   *
   * @param {String} water_id
   * @param {String} color
   * @param {Rectangle} boundary
   */
  constructor (water_id, color, boundary, speed) {
    let { canvas, ctx } = GetCanvas('#'+water_id)
    this.canvas = canvas
    this.ctx = ctx
    this.ctx.fillStyle = color

    this.level = 100
    this.speed = speed
    this.b = boundary
    this.left = Math.random()
    this.right = this.left * 14.3
    // while (true) {
    //   this.right = this.left * 3
    //   if (Math.abs(this.left - this.right) > 0.35)
    //     break
    // }
  }

  set SeaLevel (value) { this.level = value }

  update () {
    this.left += this.speed
    this.right += this.speed
  }

  render (cam, zoom) {
    this.update()

    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
    cam.coreRender(this.ctx, zoom)

    this.ctx.beginPath()
    this.ctx.moveTo(this.b.x, this.b.y+this.b.h)
    this.ctx.lineTo(this.b.x+this.b.w, this.b.y+this.b.h)
    this.ctx.lineTo(this.b.x+this.b.w, this.b.y+this.b.h - this.level + Math.sin(this.right) * 10)
    this.ctx.lineTo(this.b.x, this.b.y+this.b.h - this.level + Math.sin(this.left) * 10)
    this.ctx.lineTo(this.b.x, this.b.y+this.b.h)
    this.ctx.fill()
    this.ctx.closePath()

    cam.restore(this.ctx)
  }
}
