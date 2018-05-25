/**
 * 
 * @param {Target} value 
 * @param {Target_min} smin 
 * @param {Target_max} smax 
 * @param {New_min} emin 
 * @param {New_max} emax 
 */
const Map = function (value, smin, smax, emin, emax) {
  return emin + ((value - smin) / (smax - smin)) * (emax - emin)
}
/**
 * The value from a to b given t which is a range of [0, 1]
 * 
 * @param {number} a 
 * @param {number} b 
 * @param {number} t 
 */
const Lerp = function (a, b, t) { // could also use the Map function M(t,0,1,a,b)
  return a + (b - a) * t
}


/**
 * Loads an image from url with promise
 * 
 * @param {String} url
 * @returns {Promise} 
 */
const LoadImage = function (url) {
  let img = new Image()
  img.src = url

  return new Promise(function (resolve, reject) {
    img.onerror = reject 
    img.onload = () => resolve(img)
  })
}
/**
 * Iterates object to the point it mets a leaf node, leaf in this case is number,string,array
 * with key, value, path
 * 
 * @param {Object} o 
 * @param {function} cb
 */
const ObjectLeafs = function (o, cb) {
  ItrO(o, '', cb)
}
/**
 * helper function to iterate object
 * @param {Object} o 
 * @param {String} p 
 * @param {function} cb 
 */
function ItrO (o, p, cb) {
  for (let key in o) {
    if (o[key] instanceof Object && key[key.length-1] !== '-')
      ItrO(o[key], p+key, cb)
    else 
      cb(key.substr(0, key.length-1), o[key], p)
  }
}

class Random {
  /**
   * random value between [0, a]
   * if b is defined then between [a, b]
   * 
   * @param {number} a 
   * @param {optional} b 
   */
  static range (a, b = 0) {
    return Math.random() * Math.abs(a - b) + a
  }

  /**
   * returns an array of shape n x m
   * can also specify the range by a & b (optimal)
   * 
   * @param {number} n 
   * @param {optional} m 
   * @param {optimal range start} m 
   * @param {optional range end} m 
   */
  static randn (n, m = 1, a = 1, b = 0) {
    if (m < 2)
      return Random.randn1(n, a, b)

    let array = []
    for (let i=0; i<n; i++)  // n -> rows, m -> columns
      array.push(Random.randn1(m, a, b))
      
    return array
  }

  /**
   * Mostly serves as helper function (creates small overhead though)
   * but can be used as randn with one dimension 
   * 
   * @param {dimension} n 
   * @param {number} a 
   * @param {number} b 
   */
  static randn1 (n, a, b) {
    let array = []
    for (let i=0; i<n; i++) 
      array.push(Random.range(a, b))
    return array 
  }
}
const Gravity = .4
const Friction = .8
export {
  Map, Lerp, Random, Gravity, Friction,
  ObjectLeafs, LoadImage
}