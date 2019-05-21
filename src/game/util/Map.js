import TerrainGenerator from '../generator/TerrainGenerator'
import TerrainRenderer from '../generator/TerrainRenderer'
import Line from '../geometry/Line'
import Generator from '../generator/PolygonGenerator';
import { QuadTree, Rectangle, Circle } from './QuadTree'
import { Vector, Vector2 } from '../geometry/Vector';
import Collision from './Collision';

export default class Map {
  /**
   * 
   * @param {ImageData} terrain 
   * @param {Array} playerPositions 
   * @param {Array} polygons 
   * @param {Object} border 
   */
  constructor (terrain, playerPositions, polygons, border) {
    this.terrain = terrain 
    this.playerPositions = playerPositions
    this.polygons = polygons
    this.border = border 


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

      this.border = {
        color: border_color,
        thickness: border_thickness
      }
      let config = { mask, texture, 
        character: {
          width: character_width,
          height: character_height,
          number: character_number
        },
        border: this.border
      }
      let terrainInfo = await Map.GenerateTerrain(width, height, config)
      this.shape = terrainInfo.shape 
      this.terrain = terrainInfo.terrain
      this.playerPositions = terrainInfo.playerPositions

      let gen = new Generator(this.shape, width, height, distance)
      gen.FindPaths()
      this.polygons = gen.paths
      
      this.GenerateQuadTree()

      console.log('Map fully generated', this.terrain)
  }

  GenerateQuadTree (capacity = 7) {
    if (!this.terrain)
      return 
    
    this.quadtree = new QuadTree(new Rectangle(0, 0, this.terrain.width, this.terrain.height), capacity)
    for (let p=0; p<this.polygons.length; p++) {
      for (let i=0; i<this.polygons[p].length; i++) { 
        let line = this.polygons[p][i]
        this.quadtree.insert({a: Vector2.toVector(line.a), b: Vector2.toVector(line.b), p, i})
      }
    }
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
    const { playerPositions, terrain } = tr.drawTerrain(Math.random())

    // terrain : shape (vs is weird)
    let shape = terrainShape.terr

    return { terrain, playerPositions, shape }
  }

  /**
   * 
   * @param {Point} coordinate 
   * @param {Number|Point} force 
   * @param {*} background 
   */
  Explode (coordinate, force, background) {
    let radius = 0
<<<<<<< HEAD
    
=======
>>>>>>> 32eb3481bd9daa2e4c88332ada991eb65160669a
    if (force instanceof Object)
      radius = Vector.Distance(coordinate, force) * 2 + force.default // a default force value {x,y,default}
    else radius = force * 2
    let circleLines = []

    // calculate the cicle lines first 
    let number = Math.floor(Math.PI*2*radius / 10)
    let stepAngle = (Math.PI*2)/number // save some calc energy!
    for (let i=0; i<number; i++) {
      
      circleLines.push({ a: {
        x: Math.floor(coordinate.x + Math.cos(i * stepAngle) * radius),
        y: Math.floor(coordinate.y + Math.sin(i * stepAngle) * radius)
      }, b: i > 0 ? {x: circleLines[i-1].a.x, y: circleLines[i-1].a.y} : null})
    }

    // connnect last 
    circleLines[0].b = {x: circleLines[number-1].a.x, y: circleLines[number-1].a.y}

    // filter out the outsides
    let circleLines_ends = []
    circleLines = circleLines.filter(line => {
      let aIndex = (line.a.x + line.a.y * this.terrain.width) * 4
      let bIndex = (line.b.x + line.b.y * this.terrain.width) * 4

      let alphaA = this.terrain.data[aIndex+3] === 0 
      let alphaB = this.terrain.data[bIndex+3] === 0

      let outside = (aIndex < 0 || aIndex === this.terrain.data.length) && (bIndex < 0 || bIndex === this.terrain.data.length)

      // finding the ends : ones that has one inside
      if ((alphaA || alphaB) && !(alphaA && alphaB))
        circleLines_ends.push(line)

      return !alphaA && !outside && !alphaB
    })

    // getting the target lines
    let targetLines = this.quadtree.query(new Circle(coordinate.x, coordinate.y, radius+10))

    // placing the border
    background.ctx.beginPath()
      background.ctx.arc(coordinate.x, coordinate.y, radius+this.border.thickness, 0, Math.PI*2)
      background.ctx.fillStyle = this.border.color
      background.ctx.fill()

    // placing the markup for hole
    background.ctx.beginPath()
      background.ctx.arc(coordinate.x, coordinate.y, radius, 0, Math.PI*2)
      background.ctx.fillStyle = 'rgba(240, 50, 230)'
      background.ctx.fill()

    // removing the pixels based on orginal imageData : terrain
    let _x = coordinate.x-radius-this.border.thickness,
        _y = coordinate.y-radius-this.border.thickness,
        r = radius*2+2*this.border.thickness
        
    let newImgData = background.ctx.getImageData(0, 0, background.canvas.width, background.canvas.height) // partion image data
    
    for (let y=0; y<r; y++) {
    for (let x=0; x<r; x++) {
      // console.log(x+_x, y+_y)
      let i = (x+_x + (_y+y)*newImgData.width)*4
      // dont go over the borders
      if (i < 0 || i > newImgData.data.length - 1) 
        continue

      // if the color is magenta (remove it)
      if (newImgData.data[i] === 240 && newImgData.data[i+1] === 50 && newImgData.data[i+2] === 230) {
        newImgData.data[i+3] = 0
      }
      // compare againts orginal
      if (this.terrain.data[i+3] === 0) {
        newImgData.data[i+3] = 0
      }
    }}

    background.ctx.putImageData(newImgData, 0, 0)
    this.terrain = newImgData

    // terrain is now updated 

    let filtered = {
      remove: [],
      selected: []
    }

    for (let line of targetLines) {
      if (Vector2.Distance(line.a, coordinate) < radius && Vector2.Distance(line.b, coordinate) < radius)
        filtered.remove.push(line)
      else filtered.selected.push(line)
    }
    
    filtered.remove.sort((a, b) => a.p - b.p + b.i - a.i)
    for (let remove of filtered.remove)
      this.polygons[remove.p].splice(remove.i, 1) // safe removal

    // checking the ends if collision and connects the dots 
    for (let cline of circleLines_ends) {
    for (let line of filtered.selected) {
      
      let c = Collision.LineLineIntersection(cline, line)
      if (c) {
        let aIndex = (cline.a.x + cline.a.y * this.terrain.width) * 4
        let bIndex = (cline.b.x + cline.b.y * this.terrain.width) * 4

        let a2Index = (line.a.x + line.a.y * this.terrain.width) * 4
        let b2Index = (line.b.x + line.b.y * this.terrain.width) * 4

        // circle lines 
        if (this.terrain.data[aIndex+3] === 0) {
          cline.a.x = c.x 
          cline.a.y = c.y 
        }
        
        if (this.terrain.data[bIndex+3] === 0) {
          cline.b.x = c.x 
          cline.b.y = c.y 
        }

        // terrain lines 
        if (this.terrain.data[a2Index+3] === 0) {
          line.a.x = c.x 
          line.a.y = c.y 
        }
        
        if (this.terrain.data[b2Index+3] === 0) {
          line.b.x = c.x 
          line.b.y = c.y 
        }
      }
    }}

    for (let line of circleLines) 
      this.polygons[this.polygons.length-1].push(line)

    background.ctx.strokeStyle = 'black'
    background.ctx.lineWidth = 1

    this.GenerateQuadTree()
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