import GameObject from '../util/GameObject'
import { Vector2 } from '../geometry/Vector'
import { Random, boundary } from '../util/Helper'

window.xpos = null
export default class Camera extends GameObject {
  /**
   * smoothness is in range of [0, 1]
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Object} settings
   */
  constructor (x, y, {
    width = window.innerWidth, height = window.innerHeight
  } = {}) {
    super(x, y)

    this.w = width
    this.h = height
    this.renderDistance = Math.max(width, height)
    this.ratio = width / height // in case of dynamic window size changes
    this.smoothSpeed = 0
    this.desired = undefined
    this.offset = null
    this.oldscale = 1
    this.reset = false
    this.drag = {x:0,y:0}

    this.offset2 = {x:0, y:0}
    this.shake = {x: 0, y: 0, shaking: false}
  }

  // Getters & Setters
  get Offset () { return this.offset2 }
  get Viewport () {
    return { x: this.x, y: this.y, w: this.w, h: this.h }
  }
  set Offset (o) { this.offset2 = o }
  set Transform (pos) {
    this.x = pos.x
    this.y = pos.y
  }

  /**
   * screenOffset is often offset from corner to center
   * boundaryOffset is player offset to it's own center
   *
   * @param {Coordinate2D} position
   * @param {Object} settings
   */
  Follow (position, {
      screenOffset = {x: this.w/2, y: this.h/2},
      boundaryOffset = {x: 0, y: 0}, smoothSpeed = .1
    } = {}) {
    this.smoothSpeed = smoothSpeed
    this.desired = position
    this.offset = Vector2.toVector({ x: screenOffset.x - boundaryOffset.x, y: screenOffset.y - boundaryOffset.x })
  }

  Drag (drag) {
    if (drag === null) {
      this.offset2.x += this.drag.x
      this.offset2.y += this.drag.y

      this.drag = {x:0,y:0}
      return
    }
    this.drag.x = Math.cos(drag.angle) * drag.distance
    this.drag.y = Math.sin(drag.angle) * drag.distance
  }
  /**
   * Resets the offset to its original position
   */
  Reset () {
    this.reset = true
  }

  Shake (duration = 10, magnitude = 4) {
    this.shake.shaking = true
    this.shake.start = new Date().getTime()
    this.shake.duration = duration
    this.shake.magnitude = magnitude
  }

  render (ctx, scale = 1) {
    // we want to update the follow object first then camera!, so we put this here
    if (this.desired)
      this.Transform = Vector2.Lerp(this, this.desired.subtract(this.offset), this.smoothSpeed)

    if (this.shake.shaking) {
      this.shake.x = Random.range(-1, 1) * this.shake.magnitude
      this.shake.y = Random.range(-1, 1) * this.shake.magnitude

      let difference = new Date().getTime() - this.shake.start
      if (difference >= this.shake.duration) {
        this.shake.shaking = false
        this.shake.x = 0
        this.shake.y = 0
      } // else { console.log(difference, this.shake.duration);}
    }


    if (this.reset) {
      this.offset2.x *= .8
      this.offset2.y *= .8

      if (Math.abs(this.offset2.x) < 1) this.offset2.x = 0
      if (Math.abs(this.offset2.y) < 1) this.offset2.y = 0

      if (this.offset2.x === 0 && this.offset2.y === 0)
        this.reset = false
    }



    // need to fix when drag & zoom when we're at borders !!
    let sf = scale - 1 // scale -> [1, 2.5]
    let scalex = this.w*sf/(2*scale)
    let scaley = this.h*sf/(2*scale)
    let diffx = (this.offset2.x + this.drag.x) + scalex
    let diffy = (this.offset2.y + this.drag.y) + scaley
    // x boundary
    if (this.x < boundary.x - scalex)
      this.x = boundary.x - scalex
    if (this.x + diffx < boundary.x) {
      this.drag.x = 0
      this.offset2.x = -(this.x+scalex)
    }
    if (this.x + this.w > boundary.w + scalex)
      this.x = boundary.w - this.w + scalex
    if (this.x + diffx + this.w - scalex*2 > boundary.w) {
      this.offset2.x = boundary.w - this.x - this.w + scalex
      this.drag.x = 0
    }
    // y boundary
    if (this.y < boundary.y - scaley)
      this.y = boundary.y - scaley
    if (this.y + diffy < boundary.y) {
      this.drag.y = 0
      this.offset2.y = -(this.y+scaley)
    }
    if (this.y + this.h > boundary.h + scaley)
      this.y = boundary.h - this.h + scaley
    if (this.y + diffy + this.h - scaley*2 > boundary.h) {
      this.offset2.y = boundary.h - this.y - this.h + scaley
      this.drag.y = 0
    }
    this.coreRender(ctx, scale)
  }

  coreRender (ctx, scale) {
    let sf = scale - 1 // scale -> [1, 2.5]
    // ctx.beginPath()
    ctx.save()
    // ctx.translate(this.x - this.shake.x, this.y - this.shake.y)
    // ctx.translate(this.w*sf*10, 0)
    ctx.scale(scale, scale)
    ctx.translate(
      -this.x + this.shake.x - (this.offset2.x + this.drag.x) - this.w*sf/(2*scale),
      -this.y + this.shake.y - (this.offset2.y + this.drag.y) - this.h*sf/(2*scale)
    )

    this.oldscale = scale
  }
  restore (ctx) {
    ctx.restore()
  }
}
