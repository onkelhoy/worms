import './style/game.scss'

import { Event, TouchController as Controller } from './game/util/events'
import World from './game/util/game'
import { Vector2 } from './game/geometry/Vector'
import Map from './game/util/Map'




const map = new Map()
let pos = Vector2.toVector({x: 400, y: 300})
let oldpos = {x:pos.x,y:pos.y}
let pos2 = new Vector2(20, -300)



let c = false, img
window.change = function () {
  c = !c
}

function intialize () {
  World.init(update, render)
  Event.init(World)
  World.background = 81

  
  load(['MapBase_center_1.png'])
}
async function load (images) {
  //return await World.LoadImage(path)

  images = images.map(v => World.LoadImage('/content/' + v))
  images = await Promise.all(images)

  img = images[0]

  World.loop()
}

window.gen = Map.Generate /*function (options) {
  // options.mask = img
  Map.Generate(options)
}*/




function update () {
  let joystick = Controller.joystick
  pos.x += joystick.x * 5 
  pos.y += joystick.y * 5

  if (c) 
    World.Camera.Follow(pos2)
  else
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

intialize()