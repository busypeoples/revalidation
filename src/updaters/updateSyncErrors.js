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

import { UPDATE_FIELD, UPDATE_ALL, VALIDATE_FIELD, VALIDATE_ALL, VALIDATE_FIELD_ONLY } from '../constants'

import type { EnhancedProps, StateEffects } from './types'


/**
 *
 * @param {[Object, Array]} state a tuple containing
 * @param {Array} effects
 * @param {String} type
 * @param {Object} enhancedProps
 * @returns {[Object, Array]}
 */
export default function updateSyncErrors ([state, effects]: StateEffects, type: string, enhancedProps: EnhancedProps) {
  const { name = '', rules, instantValidation, validateSingle } = enhancedProps
  if (!instantValidation && type !== 'VALIDATE_ALL') return [state, effects]
  const errors = validate(rules, prop('form', state))

  /* eslint-disable no-shadow */
  const updateState = cond([
    [
      type => (((type === UPDATE_FIELD && validateSingle) || type === VALIDATE_FIELD || type === VALIDATE_FIELD_ONLY) && name !== ''),
      always([assocPath(['errors', name], errors[name], state), effects]),
    ],
    [
      type => (type === UPDATE_ALL || type === VALIDATE_ALL),
      always([assoc('errors', errors, state), effects]),
    ],
    [T, always([state, effects])],
  ])

  return updateState(type)
}
