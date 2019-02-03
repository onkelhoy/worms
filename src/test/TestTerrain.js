import Map from '../game/util/Map'
import { LoadImage, GetCanvas, DownloadCanvas } from '../game/util/Helper'
import Generator from '../game/generator/PolygonGenerator'
import Tester from './Tester'

// PolygonGenerator.ChangeNonPixelColor = (shape, index) => shape.data[index] === 0

export default async function init () {
  console.log('Testing Polygon Generation')
  let t0 = performance.now()
  try {
    console.log(`TEST : terrain generation 10x`)
    let t00 = performance.now()
    let terrains = await TestingMapTerrainGeneration(10)
    let t01 = performance.now()

    console.log(`COMPLETED : terrain generation ${10-terrains.length}/${10} failed - ${t01-t00}ms\n`)

    console.log(`TEST : polygon generation ${terrains.length}x`)
    t00 = performance.now()
    let failed = await StressTestPolygonGeneration(terrains)
    t01 = performance.now()
    console.log(`COMPLETED : polygon generation ${failed}/${10} failed - ${t01-t00}ms\n`)
  }
  catch (e) {
    console.error(e)
  }

  let t1 = performance.now()
  console.log('Testing Terrain Generation Completed - overall time : ' + (t1 - t0) + 'ms')
}
async function StressTestPolygonGeneration(terrains) {
  let failed = 0
  for (let terrain of terrains) {
    try {
      let gen = new Generator(terrain.terrain_small, terrain.terrain.width, terrain.terrain.height)
      gen.FindPaths()
      let polygon = gen.paths

      console.log('generated polygons', polygon.length)
    }
    catch (e) {
      console.error(e)
      failed++
    }
  }

  return failed
}

async function TestingMapPolygonGenerationAndDrawingIt (terrain, shape) {
  let display_canvas = GetCanvas(terrain.width, terrain.height)
  let working_canvas = GetCanvas(shape.width, shape.height)

  display_canvas.ctx.drawImage(terrain, 0, 0)
  working_canvas.ctx.drawImage(shape, 0, 0)

  let shapeImageData = working_canvas.ctx.getImageData(0, 0, shape.width, shape.height)

  try {
    let gen = new Generator(shapeImageData, terrain.width, terrain.height)
    let polygons = await gen.FindPaths()

    let { canvas, ctx } = GetCanvas(terrain.width, terrain.height)

    for (let path of polygons) {
      ctx.beginPath()
      ctx.moveTo(path[0].x, path[0].y)
      for (let point of path) {
        ctx.lineTo(point.x, point.y)
        ctx.arc(point.x, point.y, 1, 0, Math.PI*2)
      }
      ctx.lineTo(path[0].x, path[0].y)

      ctx.stroke()
      ctx.closePath()
    }

    document.body.appendChild(display_canvas.canvas)
    document.body.appendChild(canvas)

    return polygons
  }
  catch (e) {
    console.error(e)
    return false 
  }
}
async function TestingMapTerrainGeneration (times) {
  return Tester.FailTest(Map.GenerateTerrain, times, Object, 2000, 1000)
}

async function GenerateTerrainAndDownload () {
  let {terrain, playerPosition, terrain_small} = await Map.GenerateTerrain(2000, 1000)

  let tc = GetCanvas(terrain.width, terrain.height)
  tc.ctx.drawImage(terrain, 0, 0)

  let sc = GetCanvas(terrain_small.width, terrain_small.height)
  sc.ctx.putImageData(terrain_small, 0, 0)

  DownloadCanvas(sc.canvas)
  DownloadCanvas(tc.canvas)
}