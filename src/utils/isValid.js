/* @flow */
import {
  filter,
  is,
  isEmpty,
} from 'ramda'

/* eslint-disable no-mixed-operators, indent */

const isObject = a => (is(Object, a) && !is(Array, a) && !is(Function, a))

/**
 * check if object keys contain any string, function, non empty array or object values.
 *
 * @param obj the object to validate
 * @returns {boolean}
 */
export default function isValid(obj:Object|Array<any> = {}):boolean {
  const a = filter(i => i &&
    isObject(i)
      ? !isValid(i)
      : (typeof i === 'string' ||
         typeof i === 'function' ||
         (is(Array, i) && !isEmpty(i)))
    , obj // eslint-disable-line comma-dangle
  )

  return isEmpty(a) // eslint-disable-line comma-dangle
}
