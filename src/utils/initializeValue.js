import {
  always,
  ifElse,
  is,
  map,
  partial,
} from 'ramda'
/**
 * Maps an empty array to every item of the list and returns a map representing the items as keys
 * Also works with deep nested data.
 * 
 * @param val the value to initialize
 * @param {Object} obj the object to convert
 * @returns {Object}
 * @example
 *    
 *    initializeValue([], {'a': null 'b': null}) //=> {a: [], b: []}
 *
 *    initializeValue([], {'a': null, b: {c: {d: null}}}) //=> {'a': [], b: {c: {d: []}}}
 *
 */
export default function initializeValue(val, obj) {
  return map(ifElse(is(Object), partial(initializeValue, [val]), always(val)), obj)
}