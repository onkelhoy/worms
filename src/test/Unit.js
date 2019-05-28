
function checkResult (r, e) {
  if (Object.is(r, e))
    return true // covers : same obj, numbers, string, undefined, null, NaN etc

  if (checkInstance(r, e, Function)) 
    return true // will not compare functions
  if (checkInstance(r, e, Array)) 
    if (r.length === e.length) { 
      for (let i=0; i<r.length; i++) {
        if (!checkResult(r[i], e[i]))
          return false
      }
      return true
    }
  
  if (checkInstance(r, e, Object))  {
    for (let key in r) {
      if (e.hasOwnProperty(key)) {
        if (!checkResult(r[key], e[key]))
          return false
      } else return false
    }
    return true 
  }
}

function checkInstance (result, expected, instance) {
  return result instanceof instance && expected instanceof instance
}

export default class UnitTester {
  static Run (_function, expected, ...args) {
    try {
      let result = _function.apply(null, args)
      return checkResult(result, expected)
    } 
    catch (e) {
      return e
    }
  }
}