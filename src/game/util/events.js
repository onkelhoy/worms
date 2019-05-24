import { Vector2 as Vector } from '../geometry/Vector'
let touches = {joystick: null, button: null, zoom: {startTime: new Date().getTime(), value: 1, start: 0, list: []}}
let knob = {small: 25, big: 45}
let Game = {width: 0, height: 0}

class Event {
  /**
   * initialize the events on canvas
   * @param {DOM} canvas 
   */
  static init (GAME) {
    document.body.addEventListener('touchstart', handleStart, false)
    document.body.addEventListener('touchend', handleEnd, false)
    document.body.addEventListener('touchmove', handleMove, false)
    document.body.addEventListener('touchcancel', handleEnd)

    Game = GAME
  }
  static get Touches () {
    return touches
  }
}

function handleStart (e) {
  for (let i=0; i<e.changedTouches.length; i++) {
    let touch = e.changedTouches[i]
    touch.start = {}
    touch.x = touch.start.x = touch.clientX
    touch.startTime = new Date().getTime()
    touch.y = touch.start.y = touch.clientY // for zoom that uses Vector.delta
    // check if touch is joystick (bottom left)
    if (touches.joystick === null && touch.clientX <= Game.width / 3 && touch.clientY >= Game.height / 2) 
      touches.joystick = touch
    else if (touch.clientY < Game.height / 2 && touches.zoom.list.length < 2) {
      touches.zoom.list.push(touch)
      if (touches.zoom.list.length === 2) 
        touches.zoom.start = Vector.Delta(touches.zoom.list[1], touches.zoom.list[0]).distance
    }
    else if (touches.button === null) 
      touches.button = touch
  }

} 
function handleEnd (e) {
  e.preventDefault()
  for (let i=0; i<e.changedTouches.length; i++) {
    let touch = e.changedTouches[i]
    if (touches.joystick && touch.identifier === touches.joystick.identifier)
      touches.joystick = null
    else if (touches.button && touch.identifier === touches.button.identifier)
      touches.button = null
    else 
      for (let j=0; j<touches.zoom.list.length; j++)
        if (touches.zoom.list[j].identifier === touch.identifier) {
          if (touches.zoom.list.length === 2) {
            touches.zoom.value = TouchController.zoom
            touches.zoom.startTime = new Date().getTime()
          }
          touches.zoom.list.splice(j, 1)
          j--
        }
  }
}
function handleMove (e) {
  e.preventDefault()
  for (let i=0; i<e.changedTouches.length; i++) {
    let touch = e.changedTouches[i]
    if (touches.joystick && touch.identifier === touches.joystick.identifier)
      copy(touches.joystick, touch)
    else if (touches.button && touch.identifier === touches.button.identifier)
      copy(touches.button, touch)
    else 
      for (let j=0; j<touches.zoom.list.length; j++)
        if (touches.zoom.list[j].identifier === touch.identifier) 
          copy(touches.zoom.list[j], touch)
  }
}
function copy (t, v) {
  t.x = v.clientX
  t.y = v.clientY
}


// zoom controlls on top part of screen
// joystick on bottom left part 
// shoot btn on bottom right part 
class TouchController {
  static set Big (v) { knob.big = v }
  static set Small (v) { knob.small = v }
  
  /**
   * Returns x & y values of the joystick
   * @returns {Object}
   */
  static get joystick () {
    if (!touches.joystick)
      return {x:0, y:0}

    let d = Vector.Delta(touches.joystick, touches.joystick.start)
    let max = knob.big + knob.small/3
    if (d.distance > max)
        d.distance = max

    return {
      x: Math.cos(d.angle) * d.distance / max, // -1 to 1
      y: Math.sin(d.angle) * d.distance / max // -1 to 1
    }
  }
  /**
   * Returns a single number representing the current zoom
   * @returns {Number}
   */
  static get zoom () {
    if (touches.zoom.list.length !== 2) 
      return touches.zoom.value
    
    let d = Vector.Delta(touches.zoom.list[1], touches.zoom.list[0])
    let v = touches.zoom.value * d.distance / touches.zoom.start
    if (v < .6) v = .6
    if (v > 2.5) v = 2.5 
    return v
  }
  static get drag () {
    if (touches.zoom.list.length !== 1)
      return null
    if (new Date().getTime() - touches.zoom.startTime < 500)
      return null
    
    return Vector.Delta(touches.zoom.list[0].start, touches.zoom.list[0])
  }
  /**
   * Returns single number representing how long the client has pressed.
   * If client is not pressing it returns null
   * @returns {Number|null}
   */
  static get press () {
    if (!touches.button)
      return null
    
    let now = new Date().getTime()
    return (now - touches.button.startTime) / 1000 // mayby have a limit of 1.5s ? 
  }
  static draw (ctx) {
    // only circles
    Game.line = 1.8
    if (touches.joystick) {
      let d = Vector.Delta(touches.joystick, touches.joystick.start)
      if (d.distance > knob.big + knob.small/3)
        d.distance = knob.big + knob.small/3

      TouchController.drawknob(ctx, 
        touches.joystick.start.x, 
        touches.joystick.start.y, 
        knob.big
      )
      TouchController.drawknob(ctx, 
        touches.joystick.start.x + Math.cos(d.angle)*d.distance, 
        touches.joystick.start.y + Math.sin(d.angle)*d.distance, 
        knob.small
      )
    }  
    
    if (touches.button) {
      // Game.line = 1 + TouchController.press * 3
      TouchController.drawknob(ctx,
        touches.button.x,
        touches.button.y,
        knob.small // + TouchController.press * 3
      )
    }

    if (touches.zoom.list.length > 0) {
      for (let zoom of touches.zoom.list) 
        TouchController.drawknob(ctx, zoom.x, zoom.y, knob.small)
    }
  }
  static drawknob (ctx, x, y, radius) {
    Game.stroke = 200
    Game.fill = [255, .1]
    ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI*2)
      ctx.stroke()
      ctx.fill()
    ctx.closePath()
  }
}

module.exports = { Event, TouchController }