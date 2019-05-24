import { LoadImage, GetCanvas, boundary } from './Helper'
import { Vector2 } from '../geometry/Vector';

export default class Background {
  /**
   * 
   * @param {string} element_selector 
   * @param {ImageData} imageData 
   * @param {Object} offset 
   */
  constructor (element_selector, imageData) {
    this.main = GetCanvas(element_selector, imageData.width, imageData.height)
    if (imageData instanceof ImageData)
      this.main.ctx.putImageData(imageData, 0, 0)
    else 
      this.main.ctx.drawImage(imageData, 0, 0)

    this.camOffset = new Vector2(0,0)
  }

  set Z (v) {
    this.main.canvas.style['z-index'] = v
  }

  Draw (cam, scale) {
    let sf = scale - 1

    let x = -cam.x+cam.shake.x - (cam.offset2.x + cam.drag.x) //+ boundary.w*sf/(scale)
    let y = -cam.y+cam.shake.y - (cam.offset2.y + cam.drag.y) //+ boundary.h*sf/(scale)

    //TODO Must fix scaling !

    this.main.canvas.style.transform = `
      scale(${scale})
      translate(
        ${x}px, 
        ${y}px
      )`
  }
}
