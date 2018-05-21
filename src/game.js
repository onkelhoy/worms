import './style/game.scss'

import { Event, TouchController as Controller } from './game/util/events'
import World from './game/util/game'
import { Vector2 } from './game/geometry/Vector'
import Map from './game/util/Map'


World.init(update, render)
Event.init(World)
World.background = 81

const map = new Map()
let pos = Vector2.toVector({x: World.width / 2, y: World.height / 2})
let oldpos = {x:pos.x,y:pos.y}


function update () {
  let joystick = Controller.joystick
  pos.x += joystick.x * 5 
  pos.y += joystick.y * 5

  World.Camera.Follow(pos)
  
  if (oldpos.x !== pos.x || oldpos.y !== pos.y) {
    oldpos.x = pos.x
    oldpos.y = pos.y 

    World.Camera.Reset()
  }
}
function render (ctx) {
  World.fill = 255
  ctx.beginPath()
    ctx.fillRect(pos.x - 10, pos.y - 10, 20, 20)
  ctx.closePath()
  map.draw(ctx)
}

World.loop()