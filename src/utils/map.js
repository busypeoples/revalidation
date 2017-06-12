/* @flow */
import reduce from './reduce'
import curry from './curry'

/**
 * @param {Function} fn function to apply on list or object
 * @param functor list or object to map over
 * @returns {*}
 * @example
 *
 *    const multiply = a => a * a
 *    const collection = [1, 2, 3]
 *    map(multiply, collection) // [1, 4, 9]
 *
 *    const obj = {a: 1, b: 2, c: 3}
 *    const mapFn = map(multiply)
 *    mapFn(obj) // {a: 1, b: 4, c: 9}
 */
function map(fn: Function, functor: Array<any>|Object): Array<any>|Object  {
  if (typeof functor.map === 'function') {
    return functor.map(fn)
  }

  if (typeof functor === 'object') {
    return reduce((total, prop, key) => {
      total[key] = fn(prop)
      return total
    },
    Array.isArray(functor) ? [] : {},
    functor
  )}

  return functor
}

export default curry(map)
