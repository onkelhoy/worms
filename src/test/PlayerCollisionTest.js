import Collision from '../game/util/Collision'
import Line from '../game/geometry/Line'
import { GetCanvas } from '../game/util/Helper';
import Player from '../game/player/Player';


let lines = [] 
let main = null 
let player = new Player(300, 100)
let key = {
  left: false,
  right: false,
  space: false  
}

export default function () {
  main = GetCanvas(800, 600)
  
  lines.push(new Line(200, 100, 200, 480))
  lines.push(new Line(200, 200, 700, 200))
  lines.push(new Line(200, 480, 360, 430))
  lines.push(new Line(360, 430, 540, 500))
  lines.push(new Line(540, 500, 800, 390))

  main.canvas.tabIndex = 1
  main.canvas.onkeydown = e => {
    key.left = false 
    key.right = false
    key.space = false 

    keypress(e)
  }
  main.canvas.onkeyup = keypress
  main.canvas.onmousemove = e => {
    // player.MoveTo(e.clientX, e.clientY)
  }
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
  main.ctx.clearRect(0, 0, 800, 600)
  let color = 'black'
  for (let line of lines) {
    line.Render(main.ctx)
  }

  player.Move(key.left ? -4 : key.right ? 4 : 0, 0)
  player.Collision(lines)

  if (key.space && released) {
    released = false 
    player.Jump()
  }

  player.Render(main.ctx)
  requestAnimationFrame(update)
}