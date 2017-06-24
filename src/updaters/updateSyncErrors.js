/* @flow */
/* eslint-disable no-nested-ternary */
import {
  always,
  assoc,
  assocPath,
  cond,
  prop,
  T,
} from 'ramda'

import validate from '../validate'

import { UPDATE_FIELD, UPDATE_ALL, VALIDATE_FIELD, VALIDATE_ALL } from '../constants'

import type { EnhancedProps, StateEffects } from './types'

/**
 *
 * @param state
 * @param effects
 * @param type
 * @param name
 * @param rules
 * @param validateSingle
 * @returns {*[]}
 */
export default function updateSyncErrors ([state, effects]: StateEffects, type: string, { name = '', rules, validateSingle }: EnhancedProps) {
  const errors = validate(rules, prop('form', state))

  /* eslint-disable no-shadow */
  const updateState = cond([
    [
      type => (((type === UPDATE_FIELD && validateSingle) || type === VALIDATE_FIELD) && name !== ''),
      always([assocPath(['errors', name], errors[name], state), effects])
    ],
    [
      type => (type === UPDATE_ALL || type === VALIDATE_ALL),
      always([assoc('errors', errors, state), effects])
    ],
    [T, always([state, effects])],
  ])

  return updateState(type)
}
