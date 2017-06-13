/* @flow */
import {
  filter,
  isEmpty,
} from 'ramda'

/**
 * check if object keys contain any string, function or object values.
 *
 * @param obj the object to validate
 * @returns {boolean}
 */
export default function isValid(obj: Object): boolean {
  return isEmpty(filter(i => i &&
    (typeof i === 'string' ||
    typeof i === 'function' ||
    typeof i === 'object'), obj
  ))
}