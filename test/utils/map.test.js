import { deepEqual } from 'assert'

import map from '../../src/utils/map'

const multiply = a => a * a

describe('map', () => {

  it('should apply a function on collection items', () => {
    const collection = [1, 2, 3]
    deepEqual([1, 4, 9], map(multiply, collection))
  })

  it('should apply a function on all object properties', () => {
    const obj = {a: 1, b: 2, c: 3}
    deepEqual({a: 1, b: 4, c: 9}, map(multiply, obj))
  })

  it('should apply the function when an object is array is passed in', () => {
    const obj = {a: 1, b: 2, c: 3}
    const mapFn = map(multiply)
    deepEqual({a: 1, b: 4, c: 9}, mapFn(obj))
  })

})
