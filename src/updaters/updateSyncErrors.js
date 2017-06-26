/* @flow */
/* eslint-disable no-nested-ternary */
import {
  always,
  assoc,
  assocPath,
  cond,
  contains,
  or,
  prop,
  T,
} from 'ramda'

import validate from '../validate'
import type { EnhancedProps, StateEffects } from './types'
import { VALIDATE_FIELD, VALIDATE_FIELD_SYNC, VALIDATE_ALL } from '../constants'

/**
 *
 * @param {[Object, Array]} state a tuple containing
 * @param {Array} effects
 * @param {Array} type
 * @param {Object} enhancedProps
 * @returns {[Object, Array]}
 */
export default function updateSyncErrors ([state, effects]: StateEffects, type: Array<string>, enhancedProps: EnhancedProps) {
  const { name, rules } = enhancedProps
  const errors = validate(rules, prop('form', state))

  /* eslint-disable no-shadow */
  const updateState = cond([
    [
      type => or(contains(VALIDATE_FIELD, type), (contains(VALIDATE_FIELD_SYNC, type))) && name,
      always([assocPath(['errors', name], errors[name], state), effects]),
    ],
    [
      contains(VALIDATE_ALL),
      always([assoc('errors', errors, state), effects]),
    ],
    [T, always([state, effects])],
  ])

  return updateState(type)
}
