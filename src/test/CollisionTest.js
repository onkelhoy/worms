import Collision from '../game/util/Collision'
import Line from '../game/geometry/Line'
import { GetCanvas } from '../game/util/Helper';
import { Vector2 } from '../game/geometry/Vector';
import Circle from '../game/geometry/Circle';

let lines = [] 
let main = null 
let circle = new Circle(0, 0, 50)

export default function () {
  main = GetCanvas(800, 600)
  
  lines.push(new Line( 50, 500, 200, 480))
  lines.push(new Line(200, 480, 360, 430))
  lines.push(new Line(360, 430, 540, 500))
  lines.push(new Line(540, 500, 800, 390))

  main.canvas.onmousemove = e => {
    circle.x = e.clientX
    circle.y = e.clientY
  }
  document.body.appendChild(main.canvas)
  update()
}


function update () {
  main.ctx.clearRect(0, 0, 800, 600)
  let color = 'black'
  for (let line of lines) {
    let d = Collision.CircleLine(circle, line)
    if (d) {
      main.ctx.beginPath()
        main.ctx.arc(d.point.x, d.point.y, 3, 0, Math.PI*2)
        main.ctx.fillStyle = 'rgba(30, 50, 180, 0.4)'
        main.ctx.fill()
      color = 'cornflowerblue'
      line.Render(main.ctx, color)
    } else line.Render(main.ctx)
  }

  circle.Render(main.ctx, color)

  requestAnimationFrame(update)
}