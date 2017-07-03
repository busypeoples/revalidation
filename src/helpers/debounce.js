/* @flow */

/**
 * Delay the execution of any asynchronous validations
 * First update the state
 * then delay the validation according to the given delay value.
 *
 * @param {String} name field name
 * @param {Function} onChange the internal update function
 * @param {Function} runAsync an internal function that take async functions and calls them with the value and state.
 * @returns {Function}
 */
export default function debounce(name: string, onChange: Function, runAsync: Function) {
  let timeout
  /**
   * @param {Function} fn the asynchronous function to be called
   * @param {Number} delay delaying running the asynchronous function in ms.
   * @param {Array} types possible types to override the onChnage defaults [UPDATE_FIELD, VALIDATE_FIELD]
   * @returns {Function}
   */
  return function f1(fn: Function, delay: number, types: Array<string> = null): Function {
    return function f2(e) {
      e.preventDefault()
      const value = e.target.value
      onChange(name, value, types)
      clearTimeout(timeout)
      timeout = setTimeout(() => runAsync(fn, name, value), delay)
    }
  }
}
