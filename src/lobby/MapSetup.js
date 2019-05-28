import { GetDOM, boundary, GetCanvas, LoadImage } from '../game/util/Helper'
import Water from '../game/World/Water'
import Map from '../game/World/Map'
import Camera from '../game/World/Camera'

export default class MapSetup {
  constructor () {
    // setup the background 
    this.background = GetDOM('#background')
    this.main = GetCanvas('#main')
    this.water = new Water('waterback', 'waterfront')
    
    this.cam = new Camera(0, 0, {
      width:  this.main.canvas.width, 
      height: this.main.canvas.height
    })
    
    this.main.canvas.tabIndex = 10
    this.main.canvas.style['z-index'] = 10
    this.cam.y = boundary.h
    this.cam.x = boundary.w / 2 - this.main.canvas.width / 2
    this.map = {}
    this.width = 1080
    this.height = 720
    this.renderWater = this.renderWater.bind(this)

    this.data = {
      mask: '/content/mask/1.png', texture: '/content/texture/ground (8).jpg',
      characture: { width:50, height:80, number:8 },
      border: { color:'#aa3300', thickness:8 }, noiseResolution: 35,
      noiseResolutionBlack: 18, noiseThreshold: 20.0, seed: Math.random()
    }

    this.loadBK('/content/backgrounds/mountains.svg')
  }

  async init (loader) {
    await this.Generate(loader)
    this.renderWater()
  }
  async Generate (loader) {
    loader.style.display = 'block'
    this.map = await Map.Generate(this.width, this.height, this.data)

    this.map.x = (boundary.w - this.map.terrain.width) / 2
    this.map.y = boundary.h - this.map.terrain.height
    this.render(loader)
  }
  async GeneratePolygons () {
    return await Map.GeneratePolygons(this.width, this.height, this.map.terrain)
  }
  async loadBK (url) {
    let img = await LoadImage(url)
    img.width = Math.max(img.width, boundary.w)
    img.height = Math.max(img.height, boundary.h)

    let x = -Math.abs(img.width - boundary.w) / 2 
    let y = -Math.abs(img.height - boundary.h) / 2
    let ratio = window.innerWidth / img.width 
    
    img.style.position = 'absolute'
    img.style.top =  '-70px'
    img.style.left = x + 'px'

    // for now..
    img.style.width = ratio * img.width + 'px'
    img.style.height = (ratio * img.height + 100) + 'px'

    this.background.innerHTML = ''
    this.background.appendChild(img)
  }

  set Width (width) { this.width = width }
  set Height (height) {this.height = height }
  set Mask (maskUrl) { this.data.mask = maskUrl }
  set Texture (textureUrl) { this.data.texture = textureUrl }
  set BorderColor (color) { this.data.border.color = color }
  set BorderThickness (thickness) { this.data.border.thickness = thickness }
  set NumberOfCharactures (num) { this.data.characture.number = num }
  set NoiseResBack (res) { this.data.noiseResolutionBlack = res }
  set NoiseThreshold (threshold) { this.data.noiseThreshold = threshold }
  set NoiseResolution (res) { this.data.noiseResolution = res }
  set Background (url) { this.loadBK(url) }

  get Data () {
    return this.data
  }




  render (loader) {
    this.main.ctx.clearRect(0, 0, this.main.canvas.width, this.main.canvas.height)
    this.cam.render(this.main.ctx, .5)
    
    this.main.ctx.drawImage(
      this.map.terrain, this.map.x, this.map.y
    )

    this.cam.restore(this.main.ctx)
    loader.style.display = 'none'
  }

  renderWater () {
    this.water.render(this.cam, .5)
    requestAnimationFrame(this.renderWater)
  }
}