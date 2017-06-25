/* @flow */

import { pathOr } from 'ramda'

/**
 * Calls preventDefault on an event and returns the value.
 *
 * @param e
 * @returns {*}
 */
export default function getValue(e) {
  e.preventDefault()
  return pathOr(null, ['target', 'value'], e)
}
