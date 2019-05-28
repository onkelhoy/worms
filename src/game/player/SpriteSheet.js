import { LoadImage } from "../util/Helper";


export default class {
  constructor (animations) {
    this.pointer = {x:0,y:0, before: 0}
    this.current = null 
    this.animations = {}

    for (let animation in animations) {
      let ani = animations[animation]
      this.animations[animation] = {
        name: animation,
        fps: tot(ani.fps, 240), // how quickly it changed
        offset: tot(ani.offset, {x:0, y:0}), // offset within picture
        padding: tot(ani.padding, 0), // some padding between pics 
        width: tot(ani.width, 0), // width of part of animation 
        height: tot(ani.height, 0), // height of part of animation (if 0 -> 100%)
        start: tot(ani.start, {x:0,y:0}),
        grid: ani.grid, // the grid (x,y) 
        count: tot(ani.count, ani.grid.x*ani.grid.y) // count of pictures
      }
    }
  }

  async Load (url) {
    this.sprite = await LoadImage(url)
    for (let a in this.animations) {
      if (this.animations[a].width === 0) {
        this.animations[a].width = this.sprite.width 
        this.animations[a].height = this.sprite.height 
      }
    }
  } 

  /**
   * 
   * @param {string} animation_name 
   */
  Animate (animation_name) {
    let ani = this.animations[animation_name]
    if (!ani)
      throw new Error('This animation does not exists: ' + animation_name)

    let d = new Date().getTime()
    if (this.current !== animation_name) {
      // reset it 
      this.current = animation_name
      this.pointer.x = ani.start.x 
      this.pointer.y = ani.start.y 
      this.pointer.before = d
    }
    else if (d - this.pointer.before > ani.fps) {
      this.pointer.before = d 
      this.pointer.x++
      if (this.pointer.x >= ani.grid.x) {
        this.pointer.x = 0
        this.pointer.y++

        if (this.pointer.y >= ani.grid.y) {
          this.pointer.x = ani.start.x 
          this.pointer.y = ani.start.y 
        }
      } //? > or >= ?
      else if (this.pointer.x + this.pointer.y * ani.grid.x >= ani.count) {
        this.pointer.x = ani.start.x 
        this.pointer.y = ani.start.y 
      }
    }
  }

  Draw (ctx, x, y) {
    if (!this.current)
      return

    let ani = this.animations[this.current]
    let w = ani.width / ani.grid.x 
    let h = ani.height / ani.grid.y 
    let px = (1+this.pointer.x) * ani.padding
    let py = (1+this.pointer.y) * ani.padding

    ctx.drawImage(
      this.sprite, 
      this.pointer.x*w + px, 
      this.pointer.y*h + py,
      w, h, x, y, w, h
    )
  }
}

// helper function 
function tot (t, or) {
  return t ? t : or  
}