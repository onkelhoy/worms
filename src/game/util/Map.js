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
        ctx, width, height, lines, before) {
  if (!lines) lines = []
  
  let angle = Math.atan2(_x, _y)
  if (before) {
    let last = lines[lines.length-1]
    if (last.b) last = last.b 
    let dx = _x - last.x, dy = _y - last.y
    angle = Math.atan2(dy, dx)
    let dist = Math.sqrt(dx*dx+dy*dy)

    if (dist > distance && Math.abs(angle - before.angle) > maxAngle) {
      if (lines.length === 1 && lines[0].b === undefined)
        lines[0] = {a: {x:lines[0].x,y:lines[0].y}, b: {x:_x,y:_y}}
      else
        lines.push({a: {x:last.x,y:last.y}, b: {x:_x,y:_y}})
    }
  } else lines.push({x: _x, y: _y})

  before = {x: _y, y: _y, angle}

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

  return generatePolygon(distance, maxAngle, next.x, next.y, checks, ctx, width, height, lines, before)
} 
function GeneratePoints (shape, distance, maxAngle) {
  let canvas, ctx
  if (shape instanceof Image) {
    let d = getCanvas(shape.width, shape.height)
    canvas = d.canvas
    ctx = d.ctx
    ctx.drawImage(0, 0, canvas.width, canvas.height)
  } else if (shape instanceof Element) {
    canvas = shape
    ctx = canvas.getContext('2d')
  } else if (shape instanceof ImageData) {
    let d = getCanvas(shape.width, shape.height)
    canvas = d.canvas
    ctx = d.ctx
    ctx.putImageData(shape, 0, 0)
  }
  else throw new Error('shape must either be Image or Canvas DOM element')


  // now loop it
  let xsteps = shape.width
  let ysteps = shape.height

  let polygons = [], checks = []
  for (let y=0; y<ysteps; y++) {
  for (let x=0; x<xsteps; x++) {
  //   if (checks[y] && checks[y][x])
  //     continue // already checked this one 
    
    // THIS IS NOT GOOD!
    // LOAD ALL PIXELS AT ONCE : from there gather correct information ! 
    // let pixels = ctx.getImageData(x-1, y-1, 3, 3)
    
  //   // if (isEdge(pixels)) {
  //   //   let polygon = generatePolygon (
  //   //     distance, maxAngle, x, y, 
  //   //     checks, ctx, shape.width, shape.height
  //   //   )
  //   //   if (polygon.length > 2)
  //   //     polygons.push(polygon)
  //   // }
  }}
  return polygons
}


export default class Map {
  constructor (image, outline_points) {
    this.image = image
    this.outline = outline_points
  }

  /**
   * 
   * @param {Number} width 
   * @param {Number} height 
   * @param {Number} distance 
   * @param {Image} image 
   */
  static async GeneratePolygon (width, height, distance, image) {
    let polygons = await GeneratePoints(image, distance, 0)

    return polygons
  }

  /**
   * distance, maxAngle, mask, texture, characture {width,height,number}
   * border {color,thickness}
   * 
   * @param {Number} width 
   * @param {Number} height 
   * @param {Object} config 
   */
  static async GenerateTerrain (width, height, {
    mask = '/content/type-3.png', texture = '/content/ground.png', 
    characture = { width:50, height:80, number:8},
    border = { color:'#aa3300', thickness:8 }
  } = {}) {
    console.log('Generating map...')
    const tg_config = { terrainTypeImg: mask, width, height }
    const tg = await TerrainGenerator.fromImgUrl(tg_config)

    const terrainShape = tg.generate(Math.random())

    const tr_config = { groundImg: texture, charaWidth: characture.width,
      charaHeight: characture.height, nbCharas: characture.number,  
      borderWidth: border.thickness, borderColor: border.color }

    const tr = await TerrainRenderer.fromImgUrl(terrainShape.canvas, tr_config)
    const { playerPositions, canvas } = tr.drawTerrain(Math.random())

    // terrain : image
    let terrain = await LoadImage(canvas.toDataURL())
    // terrain : shape (vs is weird)
    let terrain_small = terrainShape.terr

    return { terrain, playerPositions, terrain_small }
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