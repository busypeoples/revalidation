/* @flow */
import { UPDATE_FIELD, VALIDATE_FIELD } from '../constants'

/**
 * Delay the execution of any asynchronous validations
 * First update the state
 * then delay the validation according to the given delay value.
 *
 * @param {String} name field name
 * @returns {Function}
 */
export default function debounce(name: string) {
  let timeout
  return function f1(fn: Function, delay: number): Function {
    return function f2(e) {
      e.preventDefault()
      const value = e.target.value
      fn(name, value, UPDATE_FIELD)
      clearTimeout(timeout)
      timeout = setTimeout(() => fn(name, value, VALIDATE_FIELD), delay)
    }
  }
}

