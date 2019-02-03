import { Rectangle, Circle, QuadTree } from '../game/util/QuadTree'
import Map from '../game/util/Map'
import { GetCanvas } from '../game/util/Helper';


let map = null 
let mouse = {x: 0, y: 0}
let main

export default async function init () {
  map = new Map()
  await map.Generate(
    2000, 1000, '/content/terrain/mask/MapBase_center_1.png', 
    '/content/terrain/texture/ground.png')

  let background = GetCanvas(2000, 1000)
  background.ctx.drawImage(map.terrain.terrain, 0, 0)

  console.log(map)
  for (let polygon of map.polygons) {
    background.ctx.beginPath()
    background.ctx.moveTo(polygon[0].x, polygon[0].y)
    for (let line of polygon) {
      background.ctx.lineTo(line.a.x, line.a.y)
      background.ctx.arc(line.a.x, line.a.y, 1, 0, Math.PI*2)
    }
    background.ctx.lineTo(polygon[0].a.x, polygon[0].a.y)
    background.ctx.stroke()
    background.ctx.closePath()
  }



  main = GetCanvas(2000, 1000)
  main.canvas.onmousemove = e => {
    mouse.x = e.clientX 
    mouse.y = e.clientY
  }

  document.body.appendChild(background.canvas)
  document.body.appendChild(main.canvas)
  updateCTX()
}

function updateCTX () {
  main.ctx.clearRect(0, 0, 2000, 1000)

  main.ctx.beginPath()
  main.ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI*2)
  main.ctx.fillStyle = 'rgba(255,255,0, .25)'
  main.ctx.fill()
  main.ctx.closePath()

  let boundary = new Circle(mouse.x, mouse.y, 80)
  let lines = map.quadtree.query(boundary)

  for (let line of lines) {
    main.ctx.beginPath()
    main.ctx.moveTo(line.a.x, line.a.y)
    main.ctx.arc(line.a.x, line.a.y, 2, 0, Math.PI*2)
    main.ctx.arc(line.b.x, line.b.y, 2, 0, Math.PI*2)
    main.ctx.lineTo(line.b.x, line.b.y)
    main.ctx.strokeStyle = 'rgb(255, 255, 0)'
    main.ctx.lineWidth = 2
    main.ctx.stroke()
  }

  requestAnimationFrame(updateCTX)
}