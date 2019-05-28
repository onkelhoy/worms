import { Lerp } from '../util/Helper'

const Vector = class {
  constructor (dims = []) {
    this.dimensions = dims
  }

  get mag () { // total, value, index
    return Math.sqrt(this.reduce((t, v, i) => t + v*v))
  }

  get size () {
    return this.dimensions.length
  }

  addFrom (v) {
    if (v.size !== this.size) throw Error('Not the same dimensions')
    this.map((a, i) => a + v.dimensions[i])
  }
  add (v) {
    if (v.size !== this.size) throw Error('Not the same dimensions')
    let vector = new Vector()
    this.map((val, i) => {
      vector.dimensions[i] = val + v.dimensions[i]
    })

    return this.returnWRTInheritence(vector)
  }
  subtract (v) {
    if (v.size !== this.size) throw Error('Not the same dimensions')
    let vector = new Vector()
    this.map((val, i) => {
      vector.dimensions[i] = val - v.dimensions[i]
    })

    return this.returnWRTInheritence(vector)
  }
  multiply (n) {
    let vector = new Vector()
    this.map((val, i) => {
      vector.dimensions[i] = val * n
    })

    return this.returnWRTInheritence(vector)
  }
  scale (n) {
    this.map(a => a * n)
  }
  
  returnWRTInheritence (v) {
    if (this instanceof Vector3) return Vector3.toVector3(v)
    if (this instanceof Vector2) return Vector2.toVector2(v)
    return v
  }

  map (fn) {
    for (let i = 0; i < this.size; i++) {
      let v = fn(this.dimensions[i], i)
      if (v !== null && v !== undefined) this.dimensions[i] = v // turn off for slight performance
    }
  }
  reduce (fn) {
    let total = 0
    let index = 0
    for (let d of this.dimensions) {
      total = fn(total, d, index++)
    }
    return total
  }
  get copy () {
    return this.returnWRTInheritence(new Vector(this.dimensions.slice()))
  }

  distance (v) {
    const norm = this.subtract(v)
    return norm.mag
  }
  dot (v) {
    if (v.size !== this.size) throw Error('Not the same dimensions')
    return this.reduce((total, value, index) => total + value * v.dimensions[index])
  }

  normalize () {
    let vector = this.copy
    const norm = vector.mag
    vector.map((v, i) => v / norm)

    return this.returnWRTInheritence(vector)
  }
  projection (v) {
    const numerator = this.dot(v)
    const denominator = this.dot(this)

    const c = numerator / denominator
    return this.multiply(c)
  }

  print () {
    console.log(this.dimensions)
  }
  /**
   * the vector from 
   * 
   * @param {Vector} v 
   * @param {Vector} u 
   * @param {number} time 
   */
  static Lerp (v, u, time) {
    if (v.size !== u.size) throw Error('Not the same dimensions')
    let vector = v.copy
    vector.map((v, i) => Lerp(v, u.dimensions[i], time))

    if (this instanceof Vector2) 
      return Vector2.toVector2(vector)
    if (this instanceof Vector3)
      return Vector3.toVector3(vector)

    return vector
  }
  static scalerReflection (x, a, b, withPoint) {
    // line segment defined by points(a, b)
    let norm = b.subtract(a), point = x.subtract(a)
    norm = norm.normalize()
    

    const proj = norm.projection(point)
    let distance = proj.distance(point)
    proj.addFrom(a)
      
    return {distance, point: proj}
  }
  /**
   * @param {vector} x actual point
   * @param {vector} a line start
   * @param {vector} b line end
   * 
   * @returns If the vector x is in between a & b
   */
  static inBetween (x, a, b) {
    let d1 = b.subtract(a)
    let d2 = x.subtract(a)
    let d3 = x.subtract(b)

    return d2.dot(d1)>0 && d3.dot(d1)<0
  }
}
const Vector2 = class extends Vector {
  constructor (x, y) {
    super([x, y])
  }

  // static methods
  /**
   * Create Vector2 from object that has x & y property
   * @param {Object} obj 
   */
  static toVector (obj) {
    Vector2.Check(obj)
    return new Vector2(obj.x, obj.y)
  }
  /**
   * Create Vector2 from existing Vector
   * @param {Vector} v 
   */
  static toVector2 (v) {
    if (v.hasOwnProperty('dimensions')) {
      if (v.dimensions.length < 2) throw Error('not enough dimensions for 2D')
      return new Vector2(v.dimensions[0], v.dimensions[1])
    }
    throw Error('dimensions not defined in object')
  }
  static isVector (obj) { return typeof obj.x === 'number' && typeof obj.y === 'number' }
  static AngleBetween (v, u) {
    const delta = Vector2.Delta(v, u) // takes care of checking!
    return Math.atan2(delta.y, delta.x)
  }
  static Check (obj) {
    if (!Vector2.isVector(obj)) 
      throw Error('x and y not defined in object: ' + JSON.stringify(obj))
    return
  }
  static Delta (v, u) {
    // Vector2.Check(v)
    // Vector2.Check(u)
    // both checked out fine!
    let x = v.x - u.x, y = v.y - u.y
    return { x, y, distance: Math.sqrt(x*x+y*y), angle: Math.atan2(y, x) }
  }

  // getters
  get x () { return this.dimensions[0] }
  get y () { return this.dimensions[1] }
  get Angle () { return Math.atan2(this.y, this.x) }

  // setters
  set x (value) { this.dimensions[0] = value }
  set y (value) { this.dimensions[1] = value }
  set Angle (value) { 
    const mag = this.mag
    this.x = Math.cos(value) * mag
    this.y = Math.sin(value) * mag 
  }
  set Mag (value) {
    let angle = this.Angle
    this.x = Math.cos(angle) * value
    this.y = Math.sin(angle) * value
  }
  set MoveTo (pos) {
    // Vector2.Check(pos)
    this.x = pos.x 
    this.y = pos.y
  } 
  
  Reset (x, y) {
    this.x = x 
    this.y = y
  }
  disp (decimal = 3) {
    let power = Math.pow(10, decimal)
    console.log({x: Math.round(this.x * power) / power, y: Math.round(this.y * power) / power})
  }

  render (ctx, radius = 1, color = 'cornflowerblue', mode = 'fill') {
    if (mode !== 'fill' && mode !== 'stroke') throw new Error('wrong mode specified')
     ctx.beginPath()
      ctx.arc(this.x, this.y, radius, 0, Math.PI * 2)
      ctx[mode+'Style'] = color
      ctx[mode]()
     ctx.closePath()
  }
}


const Vector3 = class extends Vector {
  constructor (x, y, z) {
    super([x, y, z])
  }
  
  static toVector (obj) {
    if (obj.hasOwnProperty('x') && obj.hasOwnProperty('y') && obj.hasOwnProperty('z')) {
      return new Vector3(obj.x, obj.y, obj.z)
    }
    throw Error('x and y not defined in object')
  }
  static toVector3 (v) {
    if (v.hasOwnProperty('dimensions')) {
      if (v.dimensions.length < 3) throw Error('not enough dimensions for 3D')
      return new Vector3(v.dimensions[0], v.dimensions[1], v.dimensions[2])
    }
    throw Error('dimensions not defined in object')
  }

  get x () { return this.dimensions[0] }
  get y () { return this.dimensions[1] }
  get z () { return this.dimensions[2] }

  set x (value) { this.dimensions[0] = value }
  set y (value) { this.dimensions[1] = value }
  set z (value) { this.dimensions[2] = value }

  disp () { console.log({x: this.x, y: this.y, z: this.z}) }
} 

export {
  Vector, Vector2, Vector3
}