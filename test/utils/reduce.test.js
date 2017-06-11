import { equal } from 'assert'

import reduce from '../../src/utils/reduce'

describe('reduce', () => {

  describe('Array input', () => {

    it('should return 10 for reduce((xs, x) => xs + x, 0, [1, 2, 3, 4])',
      () => {
        equal(10, reduce((xs, x) => xs + x, 0, [1, 2, 3, 4]))
      }
    )

    it('should return `foo` for reduce((xs, x) => xs + x, ``, [`f`, `o`, `o`])',
      () => {
        equal('foo', reduce((xs, x) => xs + x, '', ['f', 'o', 'o']))
      }
    )

  })

  describe('Object input', () => {

    it('should return `ABC` for reduce((xs, x) => xs + x, `A`, {id: `B`, name: `C`})',
      () => {
        equal('ABC', reduce((xs, x) => xs + x, 'A', {id: 'B', name: 'C'}))
      }
    )

  })

})
