import Circle from "../geometry/Circle";
import { Vector2 } from "../geometry/Vector";
import Collision from '../util/Collision'
import Globals from "../util/Globals";

export default class RigidBody extends Circle {
  constructor (x, y, spritesheet) {
    super(x, y, 40)

    this.vel = new Vector2(0, 0)
    this.previous_position = new Vector2(x, y)
    this.falling = true 
  }

  // should rephrase this to MoveX or something : there's a MoveTo in vector 
  Move (x, y) {
    this.previous_position = this.copy
    this.vel.x = x 
  }

  Collision (lines) {
    // start by setting falling to true : if collision it will be false
    this.falling = true 

    // we want to add gravity before : less jitter when walking (still not 100% yet!)
    this.vel.y += Globals.GRAVITY

    // some max gravity so we dont fall through map
    if (this.vel.y >= 15)
      this.vel.y = 15 

    // we add velocity here : to position 
    this.addFrom(this.vel)

    // checking the lines for collision 
    for (let line of lines) {
      let d = Collision.CircleLine(this, line)
      if (d) {
        // calculating how much we need to push back body 
        let vector = d.point.subtract(this)
        vector.Mag = vector.mag - this.Radius
        this.addFrom(vector)

        // check against the point and not line angle : 
            // single point collision of lines cause weird collision
        let angle = Vector2.AngleBetween(this, d.point)

        //? we could remove abs then we get info about roof and floor 
        if (Math.abs(Math.cos(angle)) < .8) { // we're against a wall 
          this.vel.y = 0
          this.falling = false 
        }
      }
    }
    
    // we dont want to apply stability if falling : looks weird when jumping (freezing) 
    if (this.falling)
      return 

    // stability control : less jitter (still not 100% yet!)
    let prevDist = Vector2.Distance(this, this.previous_position)
    if (prevDist < 1) {
      this.x = this.previous_position.x 
      this.y = this.previous_position.y 
    }
  }

  Render (ctx) {
    super.Render(ctx)
  }
}