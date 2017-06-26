/* @flow */
/* eslint-disable no-nested-ternary, no-unneeded-ternary */
import React, { createElement } from 'react'
import {
  always,
  curry,
  ifElse,
  is,
  isEmpty,
  keys,
  map,
  partial,
  prop,
  propOr,
  reduce,
  zipObj,
} from 'ramda'
import hoistNonReactStatics from 'hoist-non-react-statics'
import validate from './validate'
import isValid from './utils/isValid'
import debounce from './helpers/debounce'
import updateFormValues from './updaters/updateFormValues'
import updateSyncErrors from './updaters/updateSyncErrors'
import updateAsyncErrors from './updaters/updateAsyncErrors'

import { UPDATE_FIELD, UPDATE_ALL, VALIDATE_FIELD, VALIDATE_ALL } from './constants'

/**
 * Calculates the new state to be set depending on the actions triggered via the form.
 *
 * Can be an entry point for externally changing the state in future versions, by defining own update functions that
 * change the next state depending on certain user actions. For now this is only an internal implementation.
 *
 * @param {Array} updateFns all update functions that need to change to the current state
 * @param {Object} state the actual state
 * @param {String} type defines which action should be handled via the update functions
 * @param {Object} enhancedProps containing the props as well as additional information like field name or value if available
 * @returns {Object} return the new state that needs to be set.
 */
const runUpdates = (updateFns, state, type, enhancedProps) => reduce((updatedState, updateFn) =>
  updateFn(updatedState, type, enhancedProps), [state, []], updateFns)

/**
 * Maps an empty array to every item of the list and returns a map representing the items as keys
 * Also works with deep nested data.
 *
 * @param {Array} obj the to object to convert
 * @returns {Array}
 * @example
 *
 *    initializeErrors({'a': null 'b': null}) //=> {a: [], b: []}
 *
 *    initializeErrors: [{'a': null, b: {c: {d: null}}}] //=> {'a': [], b: {c: {d: []}}}
 *
 */
const initializeErrors = obj => map(ifElse(is(Object), partial(initializeErrors, []), always([])), obj)

/**
 * revalidation expects a React Component and returns a React Component containing additional functions and props
 * for managing local component state as well validating that state, wrapping the originally provided Component.
 */
function revalidation(
  Component:any // eslint-disable-line comma-dangle
):any {
  class HigherOrderFormComponent extends React.Component {
    state:{
      form: Object,
      errors: Object,
      pending: boolean,
    }

    props:{
      initialState: Object,
      rules: Object,
      asyncRules?: Object,
      validateSingle?: boolean,
      instantValidation?: boolean,
      updateForm?: Object
    }

    static defaultProps = {
      initialState: {},
      validateSingle: true,
      instantValidation: true,
    }

    updateFns: Array<Function> = [updateFormValues, updateSyncErrors, updateAsyncErrors]

    constructor(props) {
      super(props)

      const form = propOr([], 'initialState', props)
      const initErrors = initializeErrors(form)

      this.state = {
        form,
        errors: initErrors,
        asyncErrors: initErrors,
        pending: false,
        debounceFns: HigherOrderFormComponent.createDebounceFunctions(prop('initialState', props)),
      }
    }

    componentWillReceiveProps({ updateForm }) {
      if (updateForm) {
        this.updateState(updateForm)
      }
    }

    static createDebounceFunctions(form: Array<Object>) {
      return zipObj(keys(form), map(debounce, keys(form)))
    }

    validateAll = (cb: Function, data: Object):void => {
      let effects = []
      let updatedState = []
      this.setState(
        (state, props) => {
          [updatedState, effects] = runUpdates(this.updateFns, state, [VALIDATE_ALL], { ...props })
          return updatedState
        },
        () => {
          if (isEmpty(effects)) {
            if (isValid(this.state.errors) && cb) cb(data || this.state.form)
          } else {
            map(f => f().fork(() => {}, x => this.setState(x, () => {
              if (isValid(this.state.errors) && isValid(this.state.asyncErrors) && cb) cb(data || this.state.form)
            })), effects)
          }
        } // eslint-disable-line comma-dangle
      )
    }

    updateState = (newState: Object) => {
      let effects = []
      let updatedState = []
      const getType = ({ instantValidation }) =>
        instantValidation ? [UPDATE_ALL, VALIDATE_ALL] : [UPDATE_ALL]

      this.setState(
        (state, props) => {
          [updatedState, effects] = runUpdates(this.updateFns, state, getType(props), { ...props, value: newState })
          return updatedState
        },
        () => map(f => f().fork(() => {}, result => this.setState(result)), effects) // eslint-disable-line comma-dangle
      )
    }

    updateValue = curry((name:string|Array<string|number>, value:any, type: Array<string> = null):void => {
      let effects = []
      let updatedState = []
      const getType = ({ instantValidation, validateSingle }) =>
        instantValidation
          ? validateSingle
            ? [UPDATE_FIELD, VALIDATE_FIELD]
            : [UPDATE_FIELD, VALIDATE_ALL]
          : [UPDATE_FIELD]

      const fieldName = typeof name === 'string' ? [name] : name

      this.setState(
        (state, props) => {
          [updatedState, effects] = runUpdates(this.updateFns, state, type ? type : getType(props), { ...props, name: fieldName, value })
          return updatedState
        },
        () => map(f => f().fork(() => {}, result => this.setState(result)), effects) // eslint-disable-line comma-dangle
      )
    })

    render() {
      const { form, errors, asyncErrors, pending, debounceFns } = this.state
      /* eslint-disable no-unused-vars */
      const { rules, asyncRules, initialState, updateForm, validateSingle, instantValidation, ...rest } = this.props
      const valid = isValid(validate(rules, form)) && isValid(errors)

      const revalidationProp = {
        form,
        errors,
        asyncErrors,
        pending,
        valid,
        debounce: debounceFns,
        updateState: this.updateState,
        updateValue: this.updateValue,
        validateAll: this.validateAll,
        settings: { instantValidation, validateSingle },
      }

      return createElement(Component, {
        ...rest,
        revalidation: revalidationProp,
      })
    }
  }

  HigherOrderFormComponent.displayName = `Revalidation_(${Component.displayName || Component.name || 'Component'})`
  return hoistNonReactStatics(HigherOrderFormComponent, Component)
}

export default revalidation
