/* @flow */
import curry from './curry'
import reduce from './reduce'

/**
 * Merges two objects together according to the defined function
 * containing left and right value as well as the key.
 *
 * @param {Function} fn
 * @param {Object} left
 * @param {Object} right
 * @returns {Object}
 * @example
 *
 *    merge((k, l, r) => r, {id: 1, name: 'foo'}, {id: 2, other: 'bar'}) // {id: 2, name: 'foo', other: 'bar'}
 */
function merge(fn: Function, left: Object, right: Object): Object {

  const initial = reduce((o, v, k) => {
    o[k] = right.hasOwnProperty(k) ? fn(k, v, right[k]) : v
    return o
  }, {}, left)

  return reduce((o, v, k) => {
    if (!o.hasOwnProperty(k)) {
      o[k] = v
    }
    return o
  }, initial, right)
}

export default curry(merge)