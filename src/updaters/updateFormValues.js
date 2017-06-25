/* @flow */
/* eslint-disable no-nested-ternary */
import {
  always,
  assoc,
  assocPath,
  cond,
  contains,
  T,
} from 'ramda'

import type { EnhancedProps, StateEffects } from './types'
import { UPDATE_FIELD, UPDATE_ALL } from '../constants'

/**
 *
 * @param {[Object, Array]} state a tuple containing
 * @param {Array} effects
 * @param {Array} type
 * @param {Object} enhancedProps
 * @returns {[Object, Array]}
 */
export default function updateFormValues([state, effects]: StateEffects, type: Array<string>, enhancedProps: EnhancedProps) {
  const { name = '', value } = enhancedProps

  const updateState = cond([
    [contains(UPDATE_FIELD), always([assocPath(['form', name], value, state), effects])],
    [contains(UPDATE_ALL), always([assoc('form', value, state), effects])],
    [T, always([state, effects])],
  ])

  return updateState(type)
}
