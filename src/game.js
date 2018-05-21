import './style/game.scss'

/**
 * start with touch controlls
 * 1. touch events
 * 2. blob
 *  a) two points, current and before 
 *  b) create a circle that goes around the two
 *  c) current point should be the "large" part and the other not
 *  d) the further away before is the smaller its circle part is
 */
import { Event, TouchController as Controller } from './game/util/events'
import Game from './game/util/game'
import { Vector2 } from './game/geometry/Vector'
import Camera from './game/util/Camera'
import Map from './game/util/Map'


Game.init(update, render)
Event.init(Game.canvas)
Game.background = 81


const map = new Map()
const camera = new Camera(0, 0)
window.shake = function (duration = 10, magnitude = 4) {
  camera.Shake(duration, magnitude)
}
let pos = Vector2.toVector({x: Game.width / 2, y: Game.height / 2})
let oldpos = {x:pos.x,y:pos.y}
let moved = false
function update () {
  let joystick = Controller.joystick
  pos.x += joystick.x * 5 
  pos.y += joystick.y * 5
  

  camera.Follow(pos)
  let o = camera.Offset
  let drag = Controller.drag
  drag.distance /= 10

  // console.log(drag.distance)

  o.x = Math.cos(drag.angle) * drag.distance
  o.y = Math.sin(drag.angle) * drag.distance

  if (oldpos.x !== pos.x || oldpos.y !== pos.y) {
    moved = true
    oldpos.x = pos.x
    oldpos.y = pos.y 
  }
  if (moved) {
    o.x *= .8
    o.y *= .8

    if (Math.abs(o.x) < 1) o.x = 0
    if (Math.abs(o.y) < 1) o.y = 0

    if (o.x === 0 && o.y === 0)
      moved = false
  }

  camera.Offset = o
}
function render (ctx) {
  Controller.draw(ctx)
  camera.render(ctx, Controller.zoom)

  Game.fill = 255
  ctx.beginPath()
    ctx.fillRect(pos.x - 10, pos.y - 10, 20, 20)
  ctx.closePath()
  map.draw(ctx)
  camera.restore(ctx)
}

Game.loop()