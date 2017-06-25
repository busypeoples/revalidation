/* @flow */
/* eslint-disable no-nested-ternary */
import Task from 'data.task'
import {
  assoc,
  concat,
  keys,
  map,
  mapObjIndexed,
  mergeDeepWith,
  path,
  prop,
  pathOr,
  reduce,
  sequence,
  values,
  zipObj,
} from 'ramda'

import isValid from '../utils/isValid'


import { UPDATE_FIELD, UPDATE_ALL, VALIDATE_FIELD, VALIDATE_ALL, VALIDATE_FIELD_ONLY } from '../constants'

import type { EnhancedProps, StateEffects } from './types'

/**
 * Converts a list of promises into a list of Tasks that when run will either return null or the error message
 *
 * @param rules
 * @param value
 * @param form
 * @returns {Function}
 */
const createLazyPromises = (rules: Array<Function>, value: any, form: Object): Array<Function> =>
  map(([promise, errorMsg]) => new Task((rej, res) => {
    promise(value, form).then(valid => res(valid ? null : errorMsg), rej)
  }), rules)

/**
 * @param {Array} promises expecting an array of error messages
 * @returns {Array} flattened error messages
 */
const flatErrorMsgs = reduce((xs, x) => x ? concat(xs, [x]) : xs, [])

/**
 *
 * @param {[Object, Array]} state a tuple containing
 * @param {Array} effects
 * @param {String} type
 * @param {Object} enhancedProps
 * @returns {[Object, Array]}
 */
export default function updateAsyncErrors(
  [state, effects]: StateEffects,
  type: string,
  {
    name = '',
    value,
    instantValidation,
    validateSingle,
    asyncRules,
  }: EnhancedProps // eslint-disable-line comma-dangle, indent
) {
  if (!asyncRules) return [state, effects]
  if (!instantValidation && type !== 'VALIDATE_ALL') return [state, effects]

  if ((type === UPDATE_FIELD || type === VALIDATE_FIELD || type === VALIDATE_FIELD_ONLY)
    && validateSingle
    && prop(name, asyncRules)
    && (isValid(pathOr([], ['error', name], state)))) {
    const updatedState = assoc('pending', true, state)
    const promises = createLazyPromises(asyncRules[name], value, prop('form', state))

    const runPromises = () => sequence(Task.of, values(promises))
      .map(result => {
        const asyncErrors = flatErrorMsgs(result)
        return (prevState) => ({
          ...prevState,
          pending: false,
          errors: assoc(name, concat(pathOr([], ['errors', name], prevState), asyncErrors), prop('errors', prevState)),
        })
      })

    return [updatedState, concat(effects, [runPromises])]
  }

  if (type === UPDATE_ALL || type === VALIDATE_ALL) {
    const updatedState = assoc('pending', true, state)
    const promises: Object = mapObjIndexed((rules, key) =>
      createLazyPromises(rules, path(['form', key], state)), asyncRules)

    const runPromises = () => sequence(Task.of, map(sequence(Task.of), values(promises)))
      .map(result => {
        const asyncErrors = map(flatErrorMsgs, zipObj(keys(promises), result))
        return (prevState) => ({
          ...prevState,
          pending: false,
          errors: mergeDeepWith(concat, prop('errors', prevState), asyncErrors),
        })
      })

    return [updatedState, concat(effects, [runPromises])]
  }

  return [state, effects]
}
