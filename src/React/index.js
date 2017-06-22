/* @flow */
import React from 'react'
import {
  assoc,
  assocPath,
  curry,
  merge,
  prop,
} from 'ramda'
import spected from 'spected'

import isValid from '../utils/isValid'

function Revalidation(
  initialState: Object,
  validationRules: Object,
  options: Object,
  Component: any // eslint-disable-line no-unused-vars, comma-dangle
): any {
  return class extends React.Component {
    state: {
      form: Object,
      errors: Object,
    }

    defaultProps: {
      form: Object,
    }

    validateSingle: boolean
    instantValidation: boolean
    validate: Function
    validateAll: Function

    static defaultProps = {
      form: {},
    }

    constructor(props) {
      super(props)
      const { validateSingle = false, instantValidation = false } = options
      const { form } = props
      this.validateSingle = validateSingle
      this.instantValidation = instantValidation
      this.state = { form: merge(initialState, form), errors: {} }
      this.validate = curry(this.validate.bind(this))
      this.validateAll = this.validateAll.bind(this)
    }

    componentWillReceiveProps({ form }) {
      this.setState(({ form: formState, errors }) => {
        const updatedForm = merge(formState, form)
        const updateErrors = this.instantValidation ? spected(validationRules, updatedForm) : errors
        return {
          form: updatedForm,
          errors: updateErrors,
        }
      })
    }

    validate(name: string, value: any): Function {
      this.setState(state => {
        const updatedState = assocPath(['form', name], value, state)
        const errors = spected(validationRules, prop('form', updatedState))
        if (this.validateSingle) {
          return assocPath(['errors', name], errors[name], updatedState)
        }
        return assoc('errors', errors, updatedState)
      })
    }

    validateAll(cb: Function, data: Object): void {
      this.setState(state => {
        const updateErrors = spected(validationRules, prop('form', state))
        return assoc('errors', updateErrors, state)
      }, () => { if (isValid(this.state.errors) && cb) cb(data || this.state.form) })
    }

    render() {
      const { form, errors } = this.state
      const valid = isValid(spected(validationRules, form))

      const reValidation = {
        form,
        errors,
        valid,
        validate: this.validate,
        validateAll: this.validateAll,
      }

      return (
        <Component
          {...this.props}
          reValidation={reValidation}
        />
      )
    }
  }
}

export default curry(Revalidation)
