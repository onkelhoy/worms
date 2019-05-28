import World from './game'
import TerrainGenerator from '../generator/TerrainGenerator'
import TerrainRenderer from '../generator/TerrainRenderer'
import { LoadImage } from './Helper'




function getCanvas (width, height) {

  let canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  let ctx = canvas.getContext('2d')

  return { canvas, ctx }
}
function download (canvas) {
  let a = document.createElement('a')
  a.setAttribute('download', 'MapGen.png') 
  
  a.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
  a.click()
}
function isSolid (pixel, start = 0) {
  return pixel[start] !== 0 && pixel[start+3] !== 0
}
function isEdge (pixels) {
  let cindex = (pixels.width + 1) * 4
  // let center = pixels.data.slice(cindex, cindex+4) 
  if (pixels.data[cindex] === 0) return false
  

  for (let y=0; y<pixels.height; y++) {
  for (let x=0; x<pixels.width; x++) {
    if (y === 1 && x === 1)
      continue
    
    let index = (pixels.width * y + x) * 4
    // let pixel = pixels.data.slice(index, index+4)

    if (pixels.data[index] === 0)
      return true
  }}
  return false
}

function generatePolygon (distance, maxAngle, _x, _y, checks, 
        ctx, width, height, scalex, scaley, lines, before) {
  if (!lines) lines = []
  
  let point = {x:_x*scalex,y:_y*scaley}
  let angle = Math.atan2(point.x, point.y)
  if (before) {
    let last = lines[lines.length-1]
    if (last.b) last = last.b 
    let dx = point.x - last.x, dy = point.y - last.y
    angle = Math.atan2(dy, dx)
    let dist = Math.sqrt(dx*dx+dy*dy)

    if (dist > distance && Math.abs(angle - before.angle) > maxAngle) {
      if (lines.length === 1 && lines[0].b === undefined)
        lines[0] = {a: {x:lines[0].x,y:lines[0].y}, b: point}
      else
        lines.push({a: {x:last.x,y:last.y}, b: point})
    }
  } else lines.push(point)

  before = point
  before.angle = angle

  if (!checks[_y]) checks[_y] = [] 
  checks[_y][_x] = true
  

  let next = null
  for (let y=_y-1; y<=_y+1; y++) {
  for (let x=_x-1; x<=_x+1; x++) {
    if (lines.length > 2 && x === lines[0].a.x && y === lines[0].a.y) {
      lines[lines.length-1].b = {x:lines[0].a.x, y:lines[0].a.y}
      return lines
    }
      
    if (x < 0 || x >= width || y < 0 || y >= height) continue
    if (checks[y] && checks[y][x]) continue
    
    const pixels = ctx.getImageData(x-1, y-1, 3, 3)
    if (isEdge(pixels)) {
      const cost = Math.abs(_x - x) + Math.abs(_y - y)

      if (next === null || cost < next.cost) 
        next = {x, y, cost}
    }
  }}

  if (next === null) 
    return lines

  return generatePolygon (
    distance, maxAngle, next.x, next.y, checks, ctx, 
    width, height, scalex, scaley, lines, before)
} 
async function GenerateGroups (width, height, shape, distance, maxAngle) {
  let canvas, ctx
  if (shape instanceof Image) {
    let d = getCanvas(shape.width, shape.height)
    canvas = d.canvas
    ctx = d.ctx
    ctx.drawImage(shape, 0, 0)
  } else if (shape instanceof Element) {
    canvas = shape
    ctx = canvas.getContext('2d')
  } else if (shape instanceof ImageData) {
    let d = getCanvas(shape.width, shape.height)
    d.ctx.putImageData(shape, 0, 0) // needs to padd since we count with borders

    // not the most elegant solution
    let img = await LoadImage(d.canvas.toDataURL())
    return GenerateGroups(width, height, img, distance, maxAngle)
  } else throw new Error('shape must either be Image, ImageData or Canvas DOM element')


  // return 'bajs'
  let scalex = width / canvas.width
  let scaley = height / canvas.height
  // now loop it
  let xsteps = canvas.width
  let ysteps = canvas.height

  let groups = [], checks = []
  for (let y=0; y<ysteps; y++) {
  for (let x=0; x<xsteps; x++) {
    if (checks[y] && checks[y][x])
      continue // already checked this one 
    
    let pixels = ctx.getImageData(x-1, y-1, 3, 3)
    
    if (isEdge(pixels)) {
      let polygon = generatePolygon (
        distance, maxAngle, x, y, checks, ctx, 
        canvas.width, canvas.height, scalex, scaley
      )
      if (polygon.length > 2)
        groups.push(polygon)
    }
  }}
  return groups
}


export default class Map {
  constructor (image, outline_points) {
    this.image = image
    this.outline = outline_points
  }

  /**
   * distance, maxAngle, mask, texture, characture {width,height,number}
   * border {color,thickness}
   * 
   * @param {Number} width 
   * @param {Number} height 
   * @param {Object} config 
   */
  static async Generate (width, height, {
    mask = '/content/type-3.png', texture = '/content/ground.png', 
    characture = { width:50, height:80, number:8 },
    border = { color:'#aa3300', thickness:8 }
  } = {}) {
    const tg_config = { terrainTypeImg: mask, width, height }
    const tg = await TerrainGenerator.fromImgUrl(tg_config)

    const terrainShape = tg.generate(Math.random())

    const tr_config = { groundImg: texture, charaWidth: characture.width,
      charaHeight: characture.height, nbCharas: characture.number,  
      borderWidth: border.thickness, borderColor: border.color }

    const tr = await TerrainRenderer.fromImgUrl(terrainShape.canvas, tr_config)
    const { playerPositions, canvas } = tr.drawTerrain(Math.random())

    let k = 0, polygon_groups
    while (k < 3) {
      k++
      try {
        polygon_groups = await GenerateGroups (
          width, height, terrainShape.terr, distance, maxAngle)
        break
      } catch (e) {
        console.log('FUCK OFF') // dont forget to remove this henry !!
        console.error(e)
      }
    }
    let terrain = await LoadImage(canvas.toDataURL())
    // let terrain_calc = await 

    //console.log(polygon_groups)
    // let bajs = getCanvas(width, height)
    // bajs.ctx.strokeStyle = 'white'
    // for (let polygon of polygon_groups) {
    //   bajs.ctx.beginPath()
    //     bajs.ctx.lineTo(polygon[0].a.x, polygon[0].a.y)
    //     for (let line of polygon) {
    //       bajs.ctx.lineTo(line.b.x, line.b.y)
    //     }
    //     bajs.ctx.stroke()
    //   bajs.ctx.closePath()


    //   for (let line of polygon) {
    //     bajs.ctx.beginPath()
    //     bajs.ctx.arc(line.a.x, line.a.y, 1, 0, Math.PI*2)
    //     bajs.ctx.stroke()
    //     bajs.ctx.closePath()
    //   }
    // }
    // download(bajs.canvas)
    // download(canvas)

    return {polygon_groups, terrain, playerPositions}
  }

  draw (ctx) {
    //  statics
    // have background image
    // have background water (?)
    // have foreground (actual terrain)

    //  dynamics
    // have players (and all the movable stuff)
    // have front water (?)
  }
}