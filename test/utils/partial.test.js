import { equal } from 'assert'

import partial from '../../src/utils/partial'

const fakeFn = (a, b, c) => a + b + c

describe('partial', () => {

  it('should return a function if not all arguments are supplied', () => {
    const partialFn = partial(fakeFn, 1)
    equal('function', typeof partialFn)
  })

  it ('should return result when all arguments are passed in', () => {
    const result = partial(fakeFn, 1, 2, 3)
    equal(6, result)
  })

  it('should apply function when all arguments are provided', () => {
    equal(6, partial(fakeFn)(1, 2, 3))
  })

})
