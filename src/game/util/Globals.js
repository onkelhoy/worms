let gravity = .4
let mapx = 0, mapy = 0

export default class Globals {
  static get GRAVITY () {
    return gravity
  }

  static get MAPOFFSET () {
    return {x:mapx, y: mapy}
  }

  static setMAPOFFSET (x, y) {
    mapx = x 
    mapy = y
  }
}