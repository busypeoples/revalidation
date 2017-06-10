import { equal } from 'assert'

import curry from '../../src/utils/curry'

const fakeFn = (a, b, c) => a + b + c

describe('curry', () => {

  it('should keep returning a function until all arguments are provided', () => {
    const curriedFn = curry(fakeFn)
    const curriedFn1 = curriedFn(1)
    equal('function', typeof curriedFn1)
  })

  it ('should enable to pass in arguments in multple calls', () => {
    equal(6, curry(fakeFn)(1)(2)(3))
  })

  it('should apply function when all arguments are provided', () => {
    equal(6, curry(fakeFn)(1, 2, 3))
  })

})
