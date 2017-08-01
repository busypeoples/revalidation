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

import type { EnhancedProps } from './types'
import { UPDATE_FIELD, UPDATE_ALL } from '../constants'

/**
 * @param {Object} state
 * @param {Array} type
 * @param {Object} enhancedProps
 * @returns {[Object, Array]}
 */
export default function updateFormValues(state: Object, type: Array<string>, enhancedProps: EnhancedProps) {
  const { name = [], value } = enhancedProps

  const updateState = cond([
    [contains(UPDATE_FIELD), always(assocPath(['form', ...name], value, state))],
    [contains(UPDATE_ALL), always(assoc('form', value, state))],
    [T, always(state)],
  ])

  return updateState(type)
}
