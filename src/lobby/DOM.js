<<<<<<< HEAD
// D O C U M E N T
document.ontouchstart = documentClick

// C O N T R O L L S
let target = null 
const loader = document.querySelector('div.spinner')
let controlls_elm = document.querySelector('div.controlls')
for (let child of controlls_elm.children) {
  child.onclick = select
}

// I M P O R T S
import MapSetup from './mapSetup'
const setup = new MapSetup()
setup.init(loader)

// S T A R T  B T N
const startbtn_wrapper = document.querySelector('.startbtn')
startbtn_wrapper.querySelector('a').onclick = startGame

// C H A T
let chatBtn = document.querySelector('div.chatwrapper > div.button')
chatBtn.onclick = function () {
  if (target) target.classList.remove('selected')
  this.parentNode.classList.toggle('selected')
  target = this.parentNode
  target.chat = true
}

// T E X T U R E 
let texture_box = document.querySelector('.textures')
let texture_preview = texture_box.querySelector('.body > .header > .view')
clickInBox(texture_box, changeTexture)


// C O L O R S
let color_box = document.querySelector('.colors')
let color_preview = color_box.querySelector('.body > .header > .view')
clickInBox(color_box, changeColor)

// N O I S E
let noise_box = document.querySelector('.noise')
change(noise_box.querySelector('#threshold'), value => setup.NoiseThreshold = value)
change(noise_box.querySelector('#bnoise'), value => setup.NoiseResBack = value)
change(noise_box.querySelector('#noise'), value => setup.NoiseResolution = value)

// M A S K
let mask_box = document.querySelector('.mask')
let mask_preview = mask_box.querySelector('.body > .header > .view')
clickInBox(mask_box, changeMask)



// F U N C T I O N S
function change (slider, cb) {
  let span = slider.parentNode.querySelector('span')
  span.innerText = slider.value

  slider.oninput = function () {
    span.innerText = this.value
    cb(this.value)
  }
}
function select () {
  if (target) target.classList.remove('selected')
  this.classList.toggle('selected')
  target = this 
}
function clickInBox (target, fn) {
  let children = target.querySelector('.list').children
  for (let child of children)
    child.onclick = fn
}

function documentClick (e) {
  if (!target) return  
  let curr = e.target
  while (curr.parentNode !== document.body && curr.parentNode !== controlls_elm && curr !== target) {
    curr = curr.parentNode 
  }

  if (curr !== target) {
    // and now update the changes to map :)
    if (!target.chat && !curr.classList.contains('select')) setup.Generate(loader)

    target.classList.remove('selected')
    target = null 
  }
}

// other source
// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
  let hex = c.toString(16)
  return hex.length == 1 ? "0" + hex : hex
}
function rgbToHex(rgb) {
  return "#" + componentToHex(Number(rgb[0])) + componentToHex(Number(rgb[1])) + componentToHex(Number(rgb[2]))
} // thanks to Tim Down



// specific
function changeColor () {
  color_box.querySelector('.list > span.selected').classList.remove('selected')
  this.classList.add('selected')
  let rgb = getComputedStyle(this, null).getPropertyValue('background-color')
  rgb = rgb.match(/\d+/g)
  let color = rgbToHex(rgb)

  color_preview.style.backgroundColor = color
  setup.BorderColor = color
}
function changeTexture () {
  let texture = this.src
  
  texture_preview.src = texture
  setup.Texture = texture 
}
function changeMask () {
  let mask = this.src 
  mask_preview.src = mask 
  setup.Mask = mask
}
async function startGame () {
  const data = setup.Data
  data.collision = await setup.GeneratePolygons()

  socket.emit('start', data)
=======
// D O C U M E N T
document.ontouchstart = documentClick

// C O N T R O L L S
let target = null 
const loader = document.querySelector('div.spinner')
let controlls_elm = document.querySelector('div.controlls')
for (let child of controlls_elm.children) {
  child.onclick = select
}

// I M P O R T S
import MapSetup from './mapSetup'
const setup = new MapSetup()
setup.init(loader)

// S T A R T  B T N
const startbtn_wrapper = document.querySelector('.startbtn')
startbtn_wrapper.querySelector('a').onclick = startGame

// C H A T
let chatBtn = document.querySelector('div.chatwrapper > div.button')
chatBtn.onclick = function () {
  if (target) target.classList.remove('selected')
  this.parentNode.classList.toggle('selected')
  target = this.parentNode
  target.chat = true
}

// T E X T U R E 
let texture_box = document.querySelector('.textures')
let texture_preview = texture_box.querySelector('.body > .header > .view')
clickInBox(texture_box, changeTexture)


// C O L O R S
let color_box = document.querySelector('.colors')
let color_preview = color_box.querySelector('.body > .header > .view')
clickInBox(color_box, changeColor)

// N O I S E
let noise_box = document.querySelector('.noise')
change(noise_box.querySelector('#threshold'), value => setup.NoiseThreshold = value)
change(noise_box.querySelector('#bnoise'), value => setup.NoiseResBack = value)
change(noise_box.querySelector('#noise'), value => setup.NoiseResolution = value)

// M A S K
let mask_box = document.querySelector('.mask')
let mask_preview = mask_box.querySelector('.body > .header > .view')
clickInBox(mask_box, changeMask)



// F U N C T I O N S
function change (slider, cb) {
  let span = slider.parentNode.querySelector('span')
  span.innerText = slider.value

  slider.oninput = function () {
    span.innerText = this.value
    cb(this.value)
  }
}
function select () {
  if (target) target.classList.remove('selected')
  this.classList.toggle('selected')
  target = this 
}
function clickInBox (target, fn) {
  let children = target.querySelector('.list').children
  for (let child of children)
    child.onclick = fn
}

function documentClick (e) {
  if (!target) return  
  let curr = e.target
  while (curr.parentNode !== document.body && curr.parentNode !== controlls_elm && curr !== target) {
    curr = curr.parentNode 
  }

  if (curr !== target) {
    // and now update the changes to map :)
    if (!target.chat && !curr.classList.contains('select')) setup.Generate(loader)

    target.classList.remove('selected')
    target = null 
  }
}

// other source
// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
  let hex = c.toString(16)
  return hex.length == 1 ? "0" + hex : hex
}
function rgbToHex(rgb) {
  return "#" + componentToHex(Number(rgb[0])) + componentToHex(Number(rgb[1])) + componentToHex(Number(rgb[2]))
} // thanks to Tim Down



// specific
function changeColor () {
  color_box.querySelector('.list > span.selected').classList.remove('selected')
  this.classList.add('selected')
  let rgb = getComputedStyle(this, null).getPropertyValue('background-color')
  rgb = rgb.match(/\d+/g)
  let color = rgbToHex(rgb)

  color_preview.style.backgroundColor = color
  setup.BorderColor = color
}
function changeTexture () {
  let texture = this.src
  
  texture_preview.src = texture
  setup.Texture = texture 
}
function changeMask () {
  let mask = this.src 
  mask_preview.src = mask 
  setup.Mask = mask
}
async function startGame () {
  const data = setup.Data
  data.collision = await setup.GeneratePolygons()

  socket.emit('start', data)
>>>>>>> 92864930941ff5be66afca76a24276c5a16939b8
}