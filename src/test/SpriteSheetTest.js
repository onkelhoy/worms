import { GetCanvas } from "../game/util/Helper";
import SpriteSheet from "../game/player/SpriteSheet";

let key = {
  left: false,
  right: false,
  top: false,
  bottom: false 
}
let main, spritesheet 
export default async function () {
  main = GetCanvas('#main', window.innerWidth, window.innerHeight)
  
  
  document.body.onkeydown = e => {
    key.left = false 
    key.right = false
    key.up = false 
    key.down = false 
    key.a = false 
    key.s = false 
    key.space = false 

    keypress(e)
  }
  document.body.onkeyup = keypress

  spritesheet = new SpriteSheet({
    walk: {
      grid: {x: 6, y: 3},
      start: {x:0, y:1},
      count: 16,
      fps: 400
    }
  })

  console.log(spritesheet.animations)

  await spritesheet.Load('/content/numbers.png')

  update() 
}

let released = false 
function keypress (e) {
  switch (e.code) {
    case 'ArrowLeft':
      key.left = !key.left
      break;

    case 'ArrowRight':
      key.right = !key.right
      break;

    case 'KeyS':
      key.s = !key.s
      break;

    case 'KeyA':
      key.a = !key.a
      break;

    case 'ArrowUp':
      key.up = !key.up
      break;

    case 'ArrowDown':
      key.down = !key.down
      break;
    
    case 'Space':
      key.space = !key.space 
      if (!key.space)
        released = true 
      break
  }
}

function update () {
  main.ctx.clearRect(0,0,main.canvas.width, main.canvas.height)

  spritesheet.Animate('walk')
  spritesheet.Draw(main.ctx, 100, 100)

  requestAnimationFrame(update)
}
