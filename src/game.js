import './style/game.scss'

import { Event, TouchController as Controller } from './game/util/events'
import World from './game/World/World'
import { Vector2 } from './game/geometry/Vector'
import Map from './game/World/Map'
import { LoadImage } from './game/util/Helper'




const map = new Map()
let pos = Vector2.toVector({x: 400, y: 300})
let oldpos = {x:pos.x,y:pos.y}
let pos2 = new Vector2(20, -300)



let c = false, img

window.gen = Map.Generate

async function intialize (terrainData) {
  World.init(terrainData, update, render)
  Event.init(World)
  World.background = '/content/backgrounds/forest.svg'
  window.shake = (dur, mag) => {
    World.Camera.Shake(dur, mag)
  }

  load(['/content/mask/1.png'])
}
async function load (images) {
  //return await World.LoadImage(path)

  console.log('helo')
  images = images.map(v => LoadImage(v))
  images = await Promise.all(images)
  console.log(LoadImage)


  img = images[0]
  World.loop()
}



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
