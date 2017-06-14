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
const DefaultErrorComponent = ({errorMsgs}) => <div className='error'>{errorMsgs}</div>

function Revalidation(
  initialState,
  validationRules,
  errorComponent,
  options,
  Component,
) {

  const validate = createValidation(createErrorComponent(errorComponent || DefaultErrorComponent))

  const RevalidationHOC = class extends React.Component {

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
      this.state = {form: merge(initialState, props.form), errors: {}}
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

    validateAll(cb, data) {
        this.setState(state => {
          const errors = validate(prop('form', state), validationRules)
          return assoc('errors', errors, state)
        }, () => { if (isValid(this.state.errors)) cb(data || this.state.form)} )
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

  RevalidationHOC.defaultProps = {
    form: {},
  }

  return RevalidationHOC
}

export default curry(Revalidation)
