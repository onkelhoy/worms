import UnitTester from './Unit'
import FunctionTester from './Function'

// should test everything
export default class Tester {
  static UnitTest (_function, expected_results, ...args) {
    return UnitTester.Run(_function, expected_results, args)
  }

  static TimeMessure (_function, time_limit, ...args) {
    let t0 = performance.now()
    _function.apply(args)
    let t1 = performance.now()

    let time = t1 - t0 
    return time <= time_limit
  }

  static async FailTest (_function, times, expected_results, ...args) {
    console.log(args)
    return await FunctionTester.FailTest(_function, times, expected_results, args)
  }
}