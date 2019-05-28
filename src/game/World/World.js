import Camera from '../util/Camera'
import { TouchController as Controller } from '../util/events'
import Water from './Water'
import { LoadImage, boundary } from '../util/Helper'

let canvas, ctx, _loop
let upd, draw, pre, bc = 'white', cam
let water, wrapper, background, terrain

class Game {
  static init (terrainData, update, render, pre_render) {
    canvas = document.querySelector('#main')
    background = document.querySelector('#background')
    background.style['z-index'] = 8

    canvas.tabIndex = 10
    canvas.style['z-index'] = 10
    ctx = canvas.getContext('2d')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    upd = update
    draw = render
    pre = pre_render
    water = new Water('waterback', 'waterfront')
    wrapper = document.querySelector('.wrapper')
    // terrain = wrapper.querySelector('.terrain')
    // set boundary for camera
    cam = new Camera(0, 0, {width:canvas.width, height:canvas.height})
  }

  static start () {
    
  }

  static noLoop () {
    cancelAnimationFrame(_loop)
  }

  static loop () {
    cam.Drag(Controller.drag)
    upd()
    // ctx.fillStyle = bc
    ctx.clearRect(0,0,Game.width,Game.height)

    if (pre) pre(ctx)
    cam.render(ctx, Controller.zoom)
    ctx.drawImage(terrain.image, terrain.x, terrain.y)
    draw(ctx)
    cam.restore(ctx)

    water.render(cam, Controller.zoom)
    Controller.draw(ctx)
    _loop = requestAnimationFrame(Game.loop)
  }
  // getters
  static get width ()  { return canvas.width || window.innerWidth }
  static get height () { return canvas.height || window.innerHeight }
  static get canvas () { return canvas }
  static get Camera () { return cam }
  static get Wrapper () { return wrapper }

  // setters
  static set fill (color) { ctx.fillStyle = setColor(color) }
  static set stroke (color) { ctx.strokeStyle = setColor(color) }
  static set line (width) { ctx.lineWidth = width }
  static set background (url) {
    setBK(url)
  }
}

let bkposx = 0
async function setBK (url) {
  let image = await LoadImage(url)
  let x = - (boundary.w - canvas.width) / 2
  let y = - (boundary.h - canvas.height) / 2
  bkposx = x
  background.style.width = boundary.w + 'px'
  background.style.height = boundary.h + 'px'
  background.style.background = `url(${url})`
  background.style.position = 'absolute'
  background.style.left = x + 'px'
  background.style.top = y + 'px'
  background.style.backgroundSize = `${boundary.w}px ${boundary.h}px`
}
function setColor (color) {
  if (typeof color === 'number')
    return `rgb(${color},${color},${color})`
  else if (color instanceof Array) {
    let alpha = 1
    if (color.length === 2) alpha = color[1]
    return `rgba(${color[0]},${color[0]},${color[0]}, ${alpha})`
  }

  return color
}
// for development
window.noLoop = Game.noLoop
export default Game
