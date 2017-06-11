import { deepEqual } from 'assert'

import update from '../../src/utils/update'

describe('update', () => {

  it('should update object', () => {
    deepEqual({a: 1}, update(['a'], 1, {a: 2}))
  })

  it('should update array', () => {
    deepEqual([3, 2], update([0], 3, [1, 2]))
  })

  it('should accept key and update object', () => {
    deepEqual({a: 1}, update('a', 1, {a: 2}))
  })

  it('should accept an index and update array', () => {
    deepEqual([3, 2], update(0, 3, [1, 2]))
  })

  it('should return original data when passing empty path', () => {
    deepEqual([1, 2], update([], 3, [1, 2]))
  })

  it('should deeply update an object', () => {
    deepEqual({a: {b: 2}}, update(['a', 'b'], 2, {a: {b: 1}}))
  })

  it('should deeply update an array', () => {
    deepEqual([1, [1, 3]], update([1, 1], 3, [1, [1, 2]]))
  })

  it('should extend an object if key does not exist yet', () => {
    deepEqual({a: {b: 1, c: 2}}, update(['a', 'c'], 2, {a: {b: 1}}))
  })

  it('should extend an array if index does not exist yet', () => {
    deepEqual([1, [1, 2, 3]], update([1, 2], 3, [1, [1, 2]]))
  })

})
