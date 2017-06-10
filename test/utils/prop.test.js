import { equal } from 'assert'

import prop from '../../src/utils/prop'

describe('prop', () => {

  it('should return 1 for prop id and object {id: 1}', () => {
    equal(1, prop('id', {id: 1}))
  })

  it('should return a function expecting an object when provided with only the prop', () => {
    const getId = prop('id')
    equal(2, getId({id: 2}))
  })

})
