let canvas, ctx, _loop
let upd, draw, bc = 'white'

class Game {
  static init (update, render) {
    canvas = document.querySelector('canvas')
    canvas.tabIndex = 1
    ctx = canvas.getContext('2d')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    upd = update
    draw = render
  }

  static noLoop () {
    cancelAnimationFrame(_loop)
  }

  static loop () {
    upd()
    ctx.fillStyle = bc
    ctx.fillRect(0,0,Game.width,Game.height)
    draw(ctx)

    _loop = requestAnimationFrame(Game.loop)
  }
  // getters
  static get width ()  { return canvas.width }
  static get height () { return canvas.height }
  static get canvas () { return canvas }

  // setters
  static set fill (color) { ctx.fillStyle = setColor(color) }
  static set stroke (color) { ctx.strokeStyle = setColor(color) }
  static set line (width) { ctx.lineWidth = width }
  static set background (color) { bc = setColor(color) } 
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