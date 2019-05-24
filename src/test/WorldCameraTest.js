
import { Event, TouchController as Controller } from '../game/util/events'
import World from '../game/World/World'
import Player from '../game/player/Player'
import Map from '../game/World/Map'
import { boundary, GetCanvas } from '../game/util/Helper'
import { Circle } from '../game/util/QuadTree'
import Globals from '../game/util/Globals';
import { Vector2 } from '../game/geometry/Vector';


let map, player
let key = {
  left: false,
  right: false,
  space: false,
  up: false,
  down: false, 
  s: false,
  a: false,
  explode: false  
}

let explode = null, mouse = {x:0,y:0}
let oldpos = {x:0,y:0}
window.zoom = 1 
window.print = false 

export default async function () {
  map = new Map()
  await map.Generate(boundary.w, boundary.h, '/content/mask/1.png', 
    '/content/texture/ground (9).jpg', '#333333')

  player = new Player(boundary.w/2, 0)

  World.init(update, render, preRender)
  Event.init(World)
  document.body.onkeydown = e => {
    key.left = false 
    key.right = false
    key.up = false 
    key.down = false 
    key.a = false 
    key.s = false 
    key.space = false 

    keypress(e)
  }
  document.body.onkeyup = keypress
  World.background = '/content/backgrounds/mountains.svg'

  World.Start()

  document.body.onmouseup = e => {
    if (explode)
      return 

    explode = {x:e.clientX, y:e.clientY}
  }
  document.body.onmousemove = e => {
    mouse.x = e.x + World.Camera.x * window.zoom // + Globals.MAPOFFSET.x * (-1 + window.zoom)
    mouse.y = e.y + World.Camera.y * window.zoom //+ Globals.MAPOFFSET.y * (-1 + window.zoom)
  }

  window.shake = function (a, b) {
    World.Camera.Shake(a, b)
  }
}

let released = false 
function keypress (e) {
  switch (e.code) {
    case 'ArrowLeft':
      key.left = !key.left
      break;

    case 'ArrowRight':
      key.right = !key.right
      break;

    case 'KeyS':
      key.s = !key.s
      break;

    case 'KeyA':
      key.a = !key.a
      break;

    case 'ArrowUp':
      key.up = !key.up
      break;

    case 'ArrowDown':
      key.down = !key.down
      break;
    
    case 'Space':
      key.space = !key.space 
      if (!key.space)
        released = true 
      break
  }
}

function update () {
  let joystick = Controller.joystick
  // player.vel.x += joystick.x * 5
  // pos.y += joystick.y * 5
  let boundary = new Circle(player.x, player.y, player.Radius*2)
  let lines = map.quadtree.query(boundary)


  // player.Move(joystick.x, joystick.y)
  player.vel.x = joystick.x*5
  player.vel.y = joystick.y*5

  if (key.left) {
    player.x += -5
  }
  if (key.right) {
    player.x += 5
  }
  if (key.up) {
    player.y += -5
  }
  if (key.down) {
    player.y += 5
  }


  if (key.s) {
    window.zoom += 0.01
  }
  if (key.a) {
    window.zoom -= 0.01
  }

  if (window.zoom <= .6) window.zoom = .6
  if (window.zoom >= 2.5) window.zoom = 2.5 

  // player.addFrom(player.vel)
  // player.Collision(lines)

  if (key.space && released) {
    released = false 
    player.Jump()
  }

  World.Camera.Follow(player)
  if (oldpos.x !== player.x || oldpos.y !== player.y) {
    oldpos.x = player.x
    oldpos.y = player.y 

    World.Camera.Reset()
  }
}

function preRender (ctx) {
  // //ctx.putImageData(map.terrain, 10, 10) //-World.Camera.x, 280-World.Camera.y)

  // // mapcanvas.canvas.style.left = (-World.Camera.x + Globals.MAPOFFSET.x) + 'px'
  // // mapcanvas.canvas.style.top = (-World.Camera.y + Globals.MAPOFFSET.y) + 'px'
  // let sf = window.scale - 1 // scale -> [1, 2.5]
  
  // let px = Globals.MAPOFFSET.x - World.Camera.x + World.Camera.shake.x - World.Camera.drag.x - World.Camera.width * sf/(2*window.scale)// - (World.Camera.offset2.x + World.Camera.drag.x) - World.Camera.width * sf/(2*window.scale)
  // let py = Globals.MAPOFFSET.y - World.Camera.y + World.Camera.shake.y - World.Camera.drag.y - World.Camera.height * sf/(2*window.scale)// - (World.Camera.offset2.y + World.Camera.drag.y) - World.Camera.height * sf/(2*window.scale)
  // mapcanvas.canvas.style.transform = `translate(${px}px, ${py}px) scale(${window.zoom})`

  // // mapcanvas.ctx.beginPath()
  // // mapcanvas.ctx.arc(mouse.x, mouse.y, 40, 0, Math.PI*2)
  // // mapcanvas.ctx.fillStyle = 'rgba(255, 255, 0, .1)'
  // // mapcanvas.ctx.fill()
  // // hello

  map.Draw(World.Camera, window.zoom)
  
  if (Controller.press && explode) {
    map.Explode({x: player.x, y: player.y}, player.Radius)
    World.Camera.Shake(200, 10)
    explode = false 
  }

  if (!Controller.press)
    explode = true  
}

function render (ctx) {
  // ctx.drawImage(map.image, 0, 0)
  player.Render(ctx)
}