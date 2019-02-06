import MinChain from '../util/NodeChain'
import { Vector2, Vector } from '../geometry/Vector'

export default class Collision {
  static AABB (a, b) {
    // rectangle mot rectangle collision AABB
    return a.x < b.x + b.w && 
      a.x + a.w > b.x &&
      a.y < b.y + b.h && 
      a.y + a.h > b.y
  }

  static AABBpoint (p, b) {
    return Collision.AABB({x: p.x, y: p.y, w: 1, h: 1}, b)
  }

  static CircleCircle (a, b) {
    let dis = Collision.PointPointDistance(a, b)
    return dis < a.r + b.r
  }
  
  static CirclePoint (c, p) {
    let dis = Collision.PointPointDistance(c, p)
    return dis < c.r
  }

  static PointPointDistance (a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
  }
  /**
   * Returns point if collison else null 
   * @param {Line} l1 
   * @param {Line} l2
   * @param {Vector2}   
   */
  static LineLineIntersection (l1, l2) {
    let b = {
      x: l2.a.x - l2.b.x,
      y: l2.a.y - l2.b.y,
      xy: l2.a.x*l2.b.y - l2.a.y*l2.b.x
    }
    let a = {
      x: l1.a.x - l1.b.x,
      y: l1.a.y - l1.b.y,
      xy: l1.a.x*l1.b.y - l1.a.y*l1.b.x 
    }

    let denominator = a.x * b.y - a.y * b.x 

    let p = new Vector2(
      (a.xy * b.x - a.x * b.xy) / denominator, 
      (a.xy * b.y - a.y * b.xy) / denominator
    )

    
    if (Vector.inBetween(p, Vector2.toVector(l1.a), Vector2.toVector(l1.b)) && Vector.inBetween(p, Vector2.toVector(l2.a), Vector2.toVector(l2.b)))
      return p 
    
    return null 
  }

  static PointLineDistance (p, a, b) { // line => {a: {x,y}, b: {x,y}}
    let numerator = Math.abs((b.y - a.y)*p.x - (b.x - a.x)*p.y + b.x*a.y - b.y*a.x)
    let denominator = Collision.PointPointDistance(b, a)

    return numerator / denominator
  }

  static CircleLineDistance (c, a, b) {
    return Collision.PointLineDistance(c, a, b) < c.r
  }

  static CircleLine (c, l) {
    // check with line segment : first as it gives best point
    let d = Vector.scalerReflection(c, l.a, l.b)
    if (Collision.CirclePoint(c, d.point) && Vector.inBetween(d.point, l.a, l.b)) 
      return d

    
    // check with A
    let distance = Collision.PointPointDistance(c, l.a)
    if (distance < c.r)
      return {point: l.a, distance}

    // check with B
    distance = Collision.PointPointDistance(c, l.b)
    if (distance < c.r)
      return {point: l.b, distance}

    return false 
  }

  /**
   * Returns point of intersection and distance from circle center to point 
   * @param {Circle} c 
   * @param {Rectangle} b 
   */
  static CircleBoxCollision (c, b) {
    // first we simple check AABB collision
    if (Collision.AABB({x:c.x-c.r,y:c.y-c.r,w:c.r*2,h:c.r*2}, b)) {
      let corners = {
        tl: {x: b.x, y: b.y},
        tr: {x: b.x+b.w, y: b.y},
        bl: {x: b.x, y: b.y+b.h},
        br: {x: b.x+b.w, y: b.y+b.h}
      }

      // now check the corners (and get the three closest one on the way)
      let minList = new MinChain(null, (n1, n2) => n1.value.dis - n2.value.dis)
      for (let i in corners) {
        let dis = Collision.PointPointDistance(c, corners[i])
        if (dis < c.r) {
          
          return {point: Vector2.toVector(corners[i]), distance: dis}
        } 

        minList.insert({dis, index: i})
      }
      
      // get the three closest corners
      let closest = minList.mink(3) 
      for (let i = 0; i < closest.length; i++) {
        let last = i + 1
        if (last === closest.length) last = 0

        let a = Vector2.toVector(corners[closest[i].index])
        let b = Vector2.toVector(corners[closest[last].index])
        const reflect = Vector2.scalerReflection(c, a, b, true)
        
        reflect.point = Vector2.toVector2(reflect.point)

        if (reflect.distance < c.r && Vector2.inBetween(c, a, b)) {
          return reflect
        }
      }
    }
    
    return false
  }
}