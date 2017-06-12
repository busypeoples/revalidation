/* @flow */
import curry from './curry'

/**
 *
 * Curried function to access a object value
 *
 * @param {string} key the key name
 * @param {Object} obj the object to retrieve the value from
 * @returns {*}
 * @example
 *
 *    const getId = prop('id')
 *    getId({id: 2})
 */
function prop(key: string, obj: Object): any {
  return obj[key]
}

export default curry(prop)
