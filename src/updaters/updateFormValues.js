/* @flow */
/* eslint-disable no-nested-ternary */
import {
  always,
  assoc,
  assocPath,
  cond,
  equals,
  T,
} from 'ramda'

import { UPDATE_FIELD, UPDATE_ALL, UPDATE_FIELD_ONLY } from '../constants'

import type { EnhancedProps, StateEffects } from './types'

/**
 *
 * @param {[Object, Array]} state a tuple containing
 * @param {Array} effects
 * @param {String} type
 * @param {Object} enhancedProps
 * @returns {[Object, Array]}
 */
export default function updateFormValues([state, effects]: StateEffects, type: string, enhancedProps: EnhancedProps) {
  const { name = '', value } = enhancedProps

  const updateState = cond([
    [equals(UPDATE_FIELD), always([assocPath(['form', name], value, state), effects])],
    [equals(UPDATE_FIELD_ONLY), always([assocPath(['form', name], value, state), effects])],
    [equals(UPDATE_ALL), always([assoc('form', value, state), effects])],
    [T, always([state, effects])],
  ])

  return updateState(type)
}
