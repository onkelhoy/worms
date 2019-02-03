import World from './game'
import TerrainGenerator from '../generator/TerrainGenerator'
import TerrainRenderer from '../generator/TerrainRenderer'
import { LoadImage, GetCanvas, DownloadCanvas } from './Helper'
import Generator from '../generator/PolygonGenerator';
import { QuadTree, Rectangle } from './QuadTree'

export default class Map {
  constructor (terrain, polygons) {
    this.terrain = terrain 
    this.polygons = polygons 
    this.GenerateQuadTree()
  }

  /**
   * Generates terrain + polygon outline & quadtree
   * 
   * @param {Number} width 
   * @param {Number} height 
   * @param {URL} mask 
   * @param {URL} texture 
   * @param {Number} character_width 
   * @param {Number} character_height 
   * @param {Number} character_number 
   * @param {String} border_color 
   * @param {Number} border_thickness 
   * @param {Number} distance 
   */
  async Generate (width, height, mask, texture, 
    character_width = 50, character_height = 80, character_number = 8, 
    border_color = '#555555', border_thickness = 10, distance = 10) {

      let config = { mask, texture, 
        character: {
          width: character_width,
          height: character_height,
          number: character_number
        },
        border: {
          color: border_color,
          thickness: border_thickness
        }
      }
      this.terrain = await Map.GenerateTerrain(width, height, config)
      let gen = new Generator(this.terrain.terrain_small, width, height, distance)
      gen.FindPaths()
      this.polygons = gen.paths

      console.log(this.polygons)
      
      this.GenerateQuadTree()
  }

  GenerateQuadTree (capacity = 7) {
    if (!this.terrain)
      return 
    
    this.quadtree = new QuadTree(new Rectangle(0, 0, this.terrain.terrain.width, this.terrain.terrain.height), capacity)
    for (let polygon of this.polygons)
      for (let line of polygon) 
        this.quadtree.insert(line)
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
    mask = '/content/terrain/mask/type-3.png', texture = '/content/terrain/texture/ground.png', 
    character = { width:50, height:80, number:8},
    border = { color:'#aa3300', thickness:8 }
  } = {}) {
    const tg_config = { terrainTypeImg: mask, width, height }
    const tg = await TerrainGenerator.fromImgUrl(tg_config)

    const terrainShape = tg.generate(Math.random())

    const tr_config = { groundImg: texture, charaWidth: character.width,
      charaHeight: character.height, nbCharas: character.number,  
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