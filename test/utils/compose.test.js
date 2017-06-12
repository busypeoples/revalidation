import { equal } from 'assert'

import compose from '../../src/utils/compose'

const multiply = (a) => a * a
const add = (a, b) => a + b
const composedFn = compose(multiply, add)

describe('utils/compose', () => {

  it('should return a funcion', () => {
    equal('function', typeof composedFn)
  })

  it('should apply all functions from right to left when provided with arguments', () => {
    equal(25, composedFn(2, 3))
  })

})
