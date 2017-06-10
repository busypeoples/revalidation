/* @flow */
import warning from './warning'

/**
 *
 * @param {function} fn callback
 * @param {*} init the initial value
 * @param {Object|Array} data the data to iterate on
 * @returns {T}
 */
export default function reduce<T>(
  fn: Function,
  init: T,
  data: Object | Array<any>
): T {
  if (Array.isArray(data)) {
    for (let i = 0, len = data.length; i < len; i++) {
      init = fn(init, data[i], i)
    }
    return init
  }
  if (typeof data === 'object') {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        init = fn(init, data[key], key)
      }
    }
    return init
  }
  if (process.env.NODE_ENV === 'development') {
    warning('Data has to be either an object or an array.')
  }
  return init
}
