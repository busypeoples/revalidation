/* @flow */
import curry from './curry'
import map from './map'
import reduce from './reduce'


// very naive implementation
// just enough for what the library should do.
// either optimize or fallback to importing the Ramda sequence implementation.

/**
 *
 * @param {Array} fns functions to be run
 * @param {Array|Object} t Either the traversable to run all functions on or implements an ap method
 * @returns {T}
 *
 * @example
 *
 *    ap([x => x + 1, x => x * 2], [1, 2, 3])) // [ 2, 3, 4, 2, 4, 6 ]
 *
 */
const ap = curry(function(fns, t) {
  return typeof fns.ap === 'function'
    ? fns.ap(t)
    : reduce(
        function(acc, f) {
          return acc.concat(map(f, t))
        },
        [],
        fns
      )
})

/**
 *
 * @param {Function} of
 * @param {Array} traversable
 * @returns {T}
 *
 * @example
 *
 *    sequence(Either.of, [Right(10), Right(11)]) // Right([10, 11])
 *    sequence(Either.of, [Right(10), Left()]) // Left()
 *
 */
function sequence(of, traversable) {
  return reduce(
    function(acc, x) {
      return ap(map(a => b => a.concat([b]), acc), x)
    },
    of([]),
    traversable
  )
}

export default curry(sequence)
