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
export default function isValid(obj: Object) {
  return isEmpty(filter(i =>
    (typeof i === 'string' ||
     typeof i === 'function' ||
     typeof i === 'object'), obj
  ))
}