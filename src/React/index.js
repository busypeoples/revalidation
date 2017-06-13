/* @flow */
import React from 'react'

import isValid from '../utils/isValid'
import createErrorComponent from './createErrorComponent'
import createValidation from '../createValidation'
import {
  assoc,
  assocPath,
  curry,
  prop
} from 'ramda'

// default ErrorComponent
const DefaultErrorComponent = ({errorMsg}) => <div className='error'>{errorMsg}</div>

function Revalidation(
  initialState,
  validationRules,
  errorComponent,
  Component
) {

  const validate = createValidation(createErrorComponent(errorComponent || DefaultErrorComponent))

  return class extends React.Component {

    state: {
      form: Object,
      errors: Array<any>,
    }

    onChange: Function

    constructor(props) {
      super(props)
      this.state = {form: props.form || initialState, errors: {}}
      this.onChange = this.onChange.bind(this)
    }

    onChange(name) {
      return value => this.setState(state => {
        const updatedState = assocPath(['form', name], value, state)
        const errors = validate(prop('form', updatedState), validationRules)
        return assoc('errors', errors, updatedState)
      })
    }

    validate(form) {
      this.setState(state => ({ ...state, ...this.validation(form)}))
    }

    render() {
      const {form, errors} = this.state
      const valid = isValid(validate(form, validationRules))

      return (
        <Component
          {...this.props}
          form={form}
          errors={errors}
          valid={valid}
          validate={this.onChange}
        />
      )
    }
  }
}

export default curry(Revalidation)
