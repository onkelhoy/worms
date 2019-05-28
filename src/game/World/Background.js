import { LoadImage } from '../util/Helper'

class Background {
  constructor (url) {
    this.image = null
    this.elm = document.querySelector('#background')
    this.init(url)
  }

  async init (url) {
    this.image = await LoadImage(url)
  }

  move (x, y, world_boundary) {

  }
}
