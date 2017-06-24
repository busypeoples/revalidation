/* @flow */
/* eslint-disable no-nested-ternary */
import React, { createElement } from 'react'
import {
  curry,
  isEmpty,
  map,
  reduce,
} from 'ramda'
import hoistNonReactStatics from 'hoist-non-react-statics'
import validate from './validate'
import isValid from './utils/isValid'
import updateFormValues from './updaters/updateFormValues'
import updateSyncErrors from './updaters/updateSyncErrors'
import updateAsyncErrors from './updaters/updateAsyncErrors'

import { UPDATE_FIELD, UPDATE_ALL, VALIDATE_ALL } from './constants'

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
      initialState?: Object,
      state: Object,
      rules: Object,
      validateSingle?: boolean,
      instantValidation?: boolean,
    }

    static defaultProps = {
      initialState: {},
      validateSingle: true,
      instantValidation: false,
    }

    updateFns: Array<Function> = [updateFormValues, updateSyncErrors, updateAsyncErrors]

    constructor(props) {
      super(props)
      this.state = { form: props.initialState, errors: {}, pending: false }
    }

    validateAll = (cb: Function, data: Object):void => {
      let effects = []
      let updatedState = []
      this.setState(
        (state, props) => {
          [updatedState, effects] = runUpdates(this.updateFns, state, VALIDATE_ALL, { ...props })
          return updatedState
        },
        () => {
          if (isEmpty(effects)) {
            if (isValid(this.state.errors) && cb) cb(data || this.state.form)
          } else {
            map(f => f().then(x => this.setState(x, () => {
              if (isValid(this.state.errors) && cb) cb(data || this.state.form)
            })), effects)
          }
        } // eslint-disable-line comma-dangle
      )
    }

    updateState = (newState: Object) => {
      let effects = []
      let updatedState = []
      this.setState(
        (state, props) => {
          [updatedState, effects] = runUpdates(this.updateFns, state, UPDATE_ALL, { ...props, value: newState })
          return updatedState
        },
        () => map(f => f().then(x => this.setState(x)), effects) // eslint-disable-line comma-dangle
      )
    }

    updateValue = curry((name:string, value:any):void => {
      let effects = []
      let updatedState = []
      this.setState(
        (state, props) => {
          [updatedState, effects] = runUpdates(this.updateFns, state, UPDATE_FIELD, { ...props, name, value })
          return updatedState
        },
        () => map(f => f().then(result => this.setState(result)), effects) // eslint-disable-line comma-dangle
      )
    })

    render() {
      const { form, errors, pending } = this.state
      const valid = isValid(validate(this.props.rules, form)) && isValid(errors)

      const reValidation = {
        form,
        errors,
        pending,
        valid,
        updateState: this.updateState,
        updateValue: this.updateValue,
        validateAll: this.validateAll,
      }

      return createElement(Component, {
        ...this.props,
        reValidation,
      })
    }
  }

  HigherOrderFormComponent.displayName = `Revalidation_(${Component.displayName || Component.name || 'Component'})`
  return hoistNonReactStatics(HigherOrderFormComponent, Component)
}

export default revalidation
