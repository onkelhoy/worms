export default class FunctionTester {
  static async FailTest (_function, times, expected_type, args) {
    let ans = [] 
    for (let i=0; i<times; i++) {
      try {
        let ansr = await _function.apply(null, args)
        if (ansr instanceof expected_type)
          ans.push(ansr)
        else {
          console.error(typeof ansr)
        }
      }
      catch (e) {
        console.error(e)
      }
    }

    console.log(`${times - ans.length}/${times} failed`)
    return ans
  }
}