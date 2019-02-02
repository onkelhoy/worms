let NON_PIXEL = function (shape, index) {
  return shape.data[index] === 0 &&
    shape.data[index+1] === 0 &&
    shape.data[index+2] === 0
}
let DISTANCE = function (x0, y0, x1, y1) {
  return Math.sqrt(Math.pow(x0-x1, 2) + Math.pow(y0-y1,2))
}


/**
 * From the given shape a polygon outline is generated
 * it picks a point, checks if it is an edge or not & its not visited already
 * and goes on with this until the distance from start to now is >= distance
 * @param {ImageData} shape 
 * @param {Number} distance 
 */
function GeneratePolygonShapes (shape, distance = 10) {
  
  let checks = []

  for (let y=0; y<shape.height; y++) {
  for (let x=0; x<shape.width; x++) {
    // first getting the index of the 1D rgba array list 
    let index = (x + y * shape.width) * 4 // index : position * rgba colours 
    
    // first check if row exists
    if (checks[y] === undefined)
      checks[y] = []
    else if (checks[y][x]) // then check if it already is checked or not 
      continue 

    // mark it
    checks[y][x] = true 
    // check if edge 
    if (CheckEdge(x, y, shape))
      FollowPath(x, y, shape, distance, checks)
  }}
}
/**
 * x & y represents the previous edge
 * sx & sy represents the starting point and when xy and sx,sy are the same 
 * the goal is reached
 * 
 * @param {Number} x 
 * @param {Number} y
 * @param {ImageData} shape 
 * @param {Number} distance 
 * @param {Directory} checks 
 * @param {Number} sx 
 * @param {Number} sy
 * @param {Array} points 
 * 
 * @returns {Array} points  
 */
function FollowPath (x, y, shape, distance, checks, sx = x, sy = y, points = []) {
  // we start everything by checking it!
  if (checks[y] === undefined)
    checks[y] = []
  // and then check it
  checks[y][x] = true 

  // check if xy and sx,sy are the same : points has to exists first 
  if (points.length > 0 && x === sx && y === sy) 
    return points // the goal is reached 

  // check if distance from previous point and x,y are >= distance 
  if (points.length > 0) {
    let prev = points[points.length-1]
    if (DISTANCE(prev.x, prev.y, x, y) >= distance) 
      points.push({x, y})
  }

  // calculating the next point 
  for (let ny=-1; ny<2; ny++) {
  for (let nx=-1; nx<2; nx++) {
    // check first if its not checked
    if (checks[y] && !checks[y][x] && CheckEdge(nx, ny, shape)) 
      return FollowPath(nx, ny, shape, distance, checks, sx, sy, points)
  }}

  throw new GeneratingPolygonError('Cant calculate next point : no more edges')
}

/**
 * Gets the surrounding pixels based on a pixel xy-coordinate
 * @param {Number} x 
 * @param {Number} y
 * @param {ImageData} shape 
 */
function GetSurroundingPixels (x, y, shape) {
  let surrounding = [
    [0, 0, 0], 
    [0, 0, 0], 
    [0, 0, 0]]

  for (let col=0; col<surrounding.length; col++) {
  for (let row=0; row<surrounding[col].length; row++) {
    let col_value = col - 1
    let row_value = row - 1

    surrounding[col][row] = ((x + col_value) + (y + row_value) * shape.width) * 4
  }}

  // negative values are out of boundaries
  return surroundings
}

/**
 * Checks whether xy coord is edge or not : if xy is color and any other is not
 * boundary is negative so if xy has such it is an edge
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {ImageData} shape 
 * @returns {bool}
 */
function CheckEdge (x, y, shape) {
  let index = (x + y * shape.width) * 4
  if (NON_PIXEL(shape, index))
    return false
  
  // and now loop it : negatives are boundaries = is edge (also value > data)
  for (let col=0; col<3; col++) {
  for (let row=0; row<3; row++) {
    let pix = (x+row-1 + (y+col-1)*shape.width) * 4
    if (pix < 0 || pix > shape.data.length || shape.data[pix] === NON_PIXEL)
      return true 
  }}
}

class GeneratingPolygonError extends Error {
  constructor (...args) {
    super(args)
    Error.captureStackTrace(this, GeneratePolygonShape)
  }
}

// and the export 
export default {
  ChangeDistanceAlgorithm: function (_distance) {
    DISTANCE = _distance
  },
  ChangeNonPixelColor: function (color) {
    NON_PIXEL = color 
  },

  GeneratePolygonShapes,
  GeneratingPolygonError
}
