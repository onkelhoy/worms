import Map from './game/util/Map'
import { LoadImage } from './game/util/Helper'
import Tester from './test/Tester'

const map = new Map()


async function init () {
  let answers = await TestingMapTerrainGeneration()
  
  if (answers.length > 0) {
    let polygons = await TestingMapPolygonGeneration(answers[0].terrain_small)
    console.log(polygons)
  }

  console.log('Tests done')
}
async function TestingMapPolygonGeneration (shape) {
  try {
    let polygon = await Map.GeneratePolygon(2000, 1000, 10, shape)
    return polygon
  }
  catch (e) {
    console.error(e)
    return false 
  }
}
async function TestingMapTerrainGeneration () {
  return Tester.FailTest(Map.GenerateTerrain, 1, Object, 2000, 1000)
}



console.log('Starting Test')
init()