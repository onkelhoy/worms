import RigidBody from "./RigidBody";

export default class Player extends RigidBody {
  /**
   * 
   * @param {Number} x 
   * @param {Number} y 
   * @param {URL} clothing 
   */
  constructor (x, y, clothing) {
    super(x, y)

    this.jumpStatus = 0

    // load spritesheet image 
    // add clothing (this could be sent via parameter)
  }


  Jump () {
    if (this.falling && this.jumpStatus !== 1) 
      return 

    if (!this.falling)
      this.jumpStatus = 0

    if (this.jumpStatus === 1 && Math.abs(this.vel.y) < 5) 
      return 

    console.log('jump')
    
    // this.y -= 10 * (1 - this.jumpStatus)
    this.vel.y = -10 
    this.jumpStatus++
    if (this.jumpStatus > 1) 
      this.jumpStatus = 0
  }
}