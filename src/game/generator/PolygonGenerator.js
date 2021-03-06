import { Map } from '../util/Helper'
import { Line } from '../util/QuadTree'
import Globbals from '../util/Globals'

const NON_PIXEL = 0 

const DISTANCE = (a, b) =>
  Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2))

const ANGLE = (a, b) => 
  Math.atan2(a.y-b.y, a.x-b.y)

const SamePoint = (a, b) => 
  a.x === b.x && a.y === b.y 


let counter = 0

export default class Generator {
  /**
   * From the given shape, the paths will be found
   * 
   * @param {ImageData} shape 
   * @param {Number} width 
   * @param {Number} height 
   * @param {Number} distance 
   */
  constructor (shape, width, height, distance = 10) {
    this.shape = shape 
    this.width = width 
    this.height = height 
    this.distance = distance

    this.checks = []
    this.paths = []
    this.k = 0
  }

  FindPaths () {
    for (let y=0; y<this.shape.height; y++) {
    for (let x=0; x<this.shape.width; x++) {
      // first getting the index of the 1D rgba array list 
      let index = (x + y * this.shape.width) * 4 // index : position * rgba colours 
      
      // first check if row exists
      if (this.checks[y] === undefined)
        this.checks[y] = []
      else if (this.checks[y][x]) // then check if it already is checked or not 
        continue 
  
      // mark it
      this.checks[y][x] = true 
      // check if edge 
      if (this.CheckEdge(x, y)) {
        let path = this.FollowPath({x, y})
        if (path.length > 1)
          this.paths.push(path)
      }
    }}
  }

  FollowPath (start) {
    let stack = [] 
    let path = []
    let next = {x: start.x, y: start.y}
    
    let before = null 

    stack.push(next)
    let calc = this.CALC(next)

    path.push(new Line(calc.x, calc.y, -1, -1))

    while((next = stack.pop())) {
      // mark it as check 
      if (counter === 2) console.log('next', next)

      if (this.checks[next.y] === undefined)
        this.checks[next.y] = [] 
      
      // check checked 
      if (!SamePoint(next, start) && this.checks[next.y][next.x])
        continue

      this.checks[next.y][next.x] = true 
      
      // calculate if it should be added : depending on angle + distance
      let angle = Math.atan2(next.y, next.x)
      if (before) {
        let calc = this.CALC(next)
        let prev = path[path.length-1]
        angle = ANGLE(calc, prev.a)

        // no angle since quadtree will not work good then 
        let dist = DISTANCE(calc, prev.a)       // dont want too long lines later for explotions 
        if (dist > this.distance && (Math.abs(angle - before.angle) > 0 || dist > this.distance*2)) {
          prev.b.x = calc.x 
          prev.b.y = calc.y
          path.push(new Line(calc.x, calc.y, -1, -1))
        }
      }

      before = {x: next.x, y: next.y, angle}
      
      // calculate the next points 
      for (let y=next.y-1; y<next.y+2; y++) {
      for (let x=next.x-1; x<next.x+2; x++) {
        // check if reached end 
        if (path.length > 2 && x === start.x && y === start.y) {
          path[path.length-1].b.x = path[0].a.x 
          path[path.length-1].b.y = path[0].a.y
          return path // path is completed
        }
          
        // check for out of boundary and checked 
        if (x < 0 || x >= this.shape.width || y < 0 || y >= this.shape.height)
          continue
        if (this.checks[y] && this.checks[y][x])
          continue

        // not any of above : if edge add to stack
        if (this.CheckEdge(x, y))
          stack.push({x, y})
      }}
    }

    return [] // throw new Error(`Cant connect path [${path.length}]`) 
  }

  CALC (o) {
    let map = Globbals.MAPOFFSET
    return { 
      x: Map(o.x, 0, this.shape.width, 0, this.width) + map.x, 
      y: Map(o.y, 0, this.shape.height, 0, this.height) + map.y
    }
  }
  CheckEdge (_x, _y) {
    let index = (_x + _y * this.shape.width) * 4
    if (this.shape.data[index] === NON_PIXEL) 
      return false
    
    // it is the correct colour, now check if any neighbor is black or if boundary
    for (let y=_y-1; y<_y+2; y++) {
    for (let x=_x-1; x<_x+2; x++) {
      // check if out of bounds : then ok
      if (x < 0 || x >= this.shape.width || y < 0 || y >= this.shape.height)
          return true 

      let pix = (x + y * this.shape.width) * 4
      if (_x !== x && _y !== y && this.shape.data[pix] === NON_PIXEL)
        return true 
    }}

    return false 
  }
}
