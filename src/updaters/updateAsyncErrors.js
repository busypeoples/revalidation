/* @flow */
/* eslint-disable no-nested-ternary */
import {
  assoc,
  concat,
  keys,
  map,
  mapObjIndexed,
  mergeDeepWith,
  path,
  prop,
  reduce,
  values,
  zipObj,
} from 'ramda'

import isValid from '../utils/isValid'

import { UPDATE_FIELD, UPDATE_ALL, VALIDATE_FIELD, VALIDATE_ALL } from '../constants'

import type { EnhancedProps, StateEffects } from './types'

const createLazyPromises = (rules: Array<Function>, value: any): Array<Function> =>
  map(([promise, errorMsg]) => () => promise(value).then(valid => valid ? null : errorMsg), rules)

/**
 *
 * @param {Array} promises a collection of lazy promises
 * @results {Array} the array containing all resolved promises
 */
const runLazyPromises = promises => Promise.all(map(promise => promise(), promises))

/**
 * @param {Array} promises expecting an array of error messages
 * @returns {Array} flattened error messges
 */
const flatErrorMsgs = reduce((xs, x) => x ? xs.concat(x) : xs, [])

export default function updateAsyncErrors([state, effects]: StateEffects, type: string, { name = '', value, validateSingle, asyncRules }: EnhancedProps) {
  if (!asyncRules) return [state, effects]

  if ((type === UPDATE_FIELD || type === VALIDATE_FIELD)
    && validateSingle
    && prop(name, asyncRules)
    && (isValid(state.errors[name] || []))) {
    const updatedState = assoc('pending', true, state)
    const promises = createLazyPromises(asyncRules[name], value)
    const runPromises = () => runLazyPromises(promises).then(result => {
      const asyncErrors = flatErrorMsgs(result)
      return (prevState) => ({
        ...prevState,
        pending: false,
        errors: assoc(name, concat(prevState.errors[name] || [], asyncErrors), prevState.errors),
      })
    })

    return [updatedState, [...effects, runPromises]]
  }

  if (type === UPDATE_ALL || type === VALIDATE_ALL) {
    const updatedState = assoc('pending', true, state)
    const promises: Object = mapObjIndexed((rules, key) => createLazyPromises(rules, path(['form', key], state)), asyncRules)
    const runPromises = () => Promise.all(map(result => runLazyPromises(result), values(promises)))
      .then(zipObj(keys(promises)))
      .then(result => {
        const asyncErrors = map(flatErrorMsgs, result)
        return (prevState) => ({
          ...prevState,
          pending: false,
          errors: mergeDeepWith(concat, prevState.errors, asyncErrors),
        })
      })

    return [updatedState, effects.concat(runPromises)]
  }

  return [state, effects]
}
