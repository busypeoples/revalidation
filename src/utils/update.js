/* @flow */
import curry from './curry'
import reduce from './reduce'

/**
 *
 * @param {string} key the property to be updated
 * @param {*} val the new value to be applied
 * @param {Array|Object} obj the list or object to update on
 * @returns {Array|Object} returns an updated object or list
 * @example
 *
 *    set(1, 3, [1, 2]) // [1, 3]
 *    set('id', 2, {id: 1}) // {id: 2}
 */
function set(key: string|number, val: any, obj: Object|Array<any>): Object|Array<any> {
  const cloned = reduce((o, v, k) => {
    o[k] = v
    return o
  }, Array.isArray(obj) ? [] : {}, obj)
  cloned[key] = val
  return cloned
}

/**
 *
 * @param {Array} path The path to find the value to be updated
 * @param {*} val the new value to be applied
 * @param {Array|Object} obj the list or object to update on
 * @returns {Array|Object} returns an updated object or list
 * @example
 *
 *    update(0, 3, [1, 2]) // [3, 2]
 *    update([1, 2], 3, [1, [1, 2]]) // [1, [1, 2, 3]]
 *    update(['a', 'b'], 2, {a: {b: 1}}) // {a: {b: 2}}
 *
 */
function update(path: Array<string|number>|number|string, val: any, obj: Object|Array<any>): Object|Array<any> {
  if (typeof path === 'string' || typeof path === 'number') {
    return set(path, val, obj)
  }
  if (!Array.isArray(path) || path.length < 1) {
    return obj
  }

  const [idx, ...rest] = path
  if (path.length > 1) {
    const next = (obj && obj.hasOwnProperty(idx)) ? obj[idx] : (typeof idx === 'number') ? [] : {}
    val = update(rest, val, next)
  }

  return set(idx, val, obj)

}

export default curry(update)