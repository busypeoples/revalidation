/* @flow */
/* eslint-disable no-nested-ternary */
import {
  always,
  assocPath,
  cond,
  contains,
  merge,
  path,
  prop,
  T,
} from 'ramda'

import validate from '../validate'
import type { EnhancedProps } from './types'
import { VALIDATE_FIELD, VALIDATE_ALL } from '../constants'

/**
 *
 * @param {[Object, Array]} state a tuple containing
 * @param {Array} effects
 * @param {Array} type
 * @param {Object} enhancedProps
 * @returns {[Object, Array]}
 */
export default function updateSyncErrors (state: Object, type: Array<string>, enhancedProps: EnhancedProps) {
  const { name = [], rules } = enhancedProps
  const errors = validate(rules, prop('form', state))

  /* eslint-disable no-shadow */
  const updateState = cond([
    [
      type => contains(VALIDATE_FIELD, type) && name,
      () => {
        // reset any asyncErrors as the field value has been updated
        const cleanedState = path(['asyncErrors', name], state) ? assocPath(['asyncErrors', name], [], state) : state
        return assocPath(['errors', ...name], path([...name], errors), cleanedState)
      },
    ],
    [
      contains(VALIDATE_ALL),
      always(merge(state, { errors, submitted: true })),
    ],
    [T, always(state)],
  ])

  return updateState(type)
}
