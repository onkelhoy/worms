import { Circle } from '../game/util/QuadTree'
import Map from '../game/util/Map';
import { GetCanvas } from '../game/util/Helper';
import Player from '../game/player/Player';

let map = null 
let player = null 
let mouse = {x: 0, y: 0}
let key = {
  left: false,
  right: false,
  space: false  
}
let main

export default async function init () {
  map = new Map()
  player = new Player(500, 0)

  let w = window.innerWidth - 10
  let h = window.innerHeight - 10
  console.log(w, h)

  await map.Generate(
    800, 600, '/content/terrain/mask/MapBase_two_2.png', 
    '/content/terrain/texture/ground.png')

  let background = GetCanvas(800, 600)
  background.ctx.putImageData(map.terrain, 0, 0)

  main = GetCanvas(800, 600)
  main.canvas.onmousemove = e => {
    mouse.x = e.clientX 
    mouse.y = e.clientY
  }
  main.canvas.onmouseup = e => {
    console.log('explode', mouse)
    map.Explode(mouse, 40, background)
  }

  document.body.appendChild(background.canvas)
  document.body.appendChild(main.canvas)
  main.canvas.tabIndex = 1
  main.canvas.onkeydown = e => {
    key.left = false 
    key.right = false
    key.space = false 

    keypress(e)
  }
  main.canvas.onkeyup = keypress
  
  document.body.appendChild(main.canvas)
  update()
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
    
    case 'Space':
      key.space = !key.space 
      if (!key.space)
        released = true 
      break
  }
}

function update () {
  main.ctx.clearRect(0, 0, 2000, 1000)
  
  let boundary = new Circle(player.x, player.y, player.Radius*2)
  let lines = map.quadtree.query(boundary)


  player.Move(key.left ? -4 : key.right ? 4 : 0, 0)
  player.Collision(lines)

  if (key.space && released) {
    released = false 
    player.Jump()
  }
  player.Render(main.ctx)


  requestAnimationFrame(update)
}