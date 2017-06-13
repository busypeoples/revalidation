/* @flow */
import React from 'react'

import isValid from '../utils/isValid'
import createErrorComponent from './createErrorComponent'
import createValidation from '../createValidation'
import {
  assoc,
  assocPath,
  curry,
  merge,
  path,
  prop
} from 'ramda'

// default ErrorComponent
const DefaultErrorComponent = ({errorMsg}) => <div className='error'>{errorMsg}</div>

function Revalidation(
  initialState,
  validationRules,
  errorComponent,
  options,
  Component,
) {

  const validate = createValidation(createErrorComponent(errorComponent || DefaultErrorComponent))

  return class extends React.Component {

    state: {
      form: Object,
      errors: Array<any>,
    }

    onChange: Function
    validate: Function
    validateAll: Function

    constructor(props) {
      super(props)
      this.validateSingle = options ? options.validateSingle : false
      this.state = {form: props.form || initialState, errors: {}}
      this.validate = this.validate.bind(this)
      this.validateAll = this.validateAll.bind(this)
    }

    validate(name) {
      return value => this.setState(state => {
        const updatedState = assocPath(['form', name], value, state)
        const errors = validate(prop('form', updatedState), validationRules)
        if (this.validateSingle) {
          return assocPath(['errors', name], errors[name], updatedState)
        }
        return assoc('errors', errors, updatedState)
      })
    }

    validateAll(cb, form) {
        this.setState(state => {
          const errors = validate(prop('form', state), validationRules)
          return assoc('errors', errors, state)
        }, () => {if (isValid(this.state.errors)) cb(form || this.state.form)} )
    }

    render() {
      const {form, errors} = this.state
      const valid = isValid(validate(form, validationRules))

      const reValidation = {
        form,
        errors,
        valid,
        validate: this.validate,
        validateAll: this.validateAll
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
