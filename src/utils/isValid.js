/* @flow */
import {
  filter,
  isEmpty,
} from 'ramda'

/**
 * check if object keys contain any string, function, non empty array or object values.
 *
 * @param obj the object to validate
 * @returns {boolean}
 */
export default function isValid(obj: Object|Array<any> = {}): boolean {
  return isEmpty(filter(i => i &&
    (typeof i === 'string' ||
    typeof i === 'function' ||
    (typeof i === 'object' && !isEmpty(i))), obj // eslint-disable-line comma-dangle
  ))
}
