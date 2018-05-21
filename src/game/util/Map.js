// import Noise from './Noise'

export default class Map {
  constructor () {
    this.x = []
    this.y = []
    for (let i=0; i<100; i++) {
      this.x.push(-400 + i*80)
      this.y.push(-1000 + i*80)
    }
  }

  draw (ctx) {
    for (let i=0; i<this.x.length; i++) {
      ctx.beginPath()
        ctx.fillStyle = 'white'
        ctx.fillRect(this.x[i], 300, 25, 25)
        ctx.fillRect(400, this.y[i], 25, 25)
      ctx.closePath()
    }
  }
}