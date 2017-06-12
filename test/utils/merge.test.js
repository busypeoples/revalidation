import { deepEqual } from 'assert'

import merge from '../../src/utils/merge'

describe('utils/merge', () => {

  it('should merge two objects with same key according to the passed in function',
    () => {
      const result = merge((k, l, r) => r, {id: 1, name: 'foo'}, {id: 2, other: 'bar'})
      deepEqual({id: 2, name: 'foo', other: 'bar'}, result)
    }
  )

  it('should merge two objects with no overlapping keys',
    () => {
      const result = merge((k, l, r) => l, {id: 1}, {name: 'foo'})
      deepEqual({id: 1, name: 'foo'}, result)
    }
  )

})
