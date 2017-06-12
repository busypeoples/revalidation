/* @flow */
import React from 'react'

import createErrorComponent from './createErrorComponent'
import createValidation from '../'
import {
  curry,
  map,
  prop,
  update
} from '../utils/'

// default ErrorComponent
const DefaultErrorComponent = ({errorMsg}) => <div className='error'>{errorMsg}</div>

function ValidationHOC(
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
      this.state = initialState
      this.onChange = curry((name, value) =>
        this.setState(state => {
          const newState = update(['form', name], value, state)
          const errors = validate(prop('form', newState), validationRules)
          return update('errors', errors, newState)
        })
      )
    }

    render() {
      const {form, errors} = this.state

      return (
        <Component
          {...this.props}
          form={form}
          errors={errors}
          onChange={this.onChange}
        />
      )
    }
  }
}

export default curry(ValidationHOC)
