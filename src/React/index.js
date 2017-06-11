/* @flow */
import React from 'react'

import validate from '../'
import {
  curry,
  map,
  prop,
  update
} from '../utils/'

function ValidationHOC(
  initialState,
  validationRules,
  errorComponent,
  Component
) {

  return class extends React.Component {

    constructor(props) {
      super(props)
      this.state = initialState
      this.onChange = curry((name, value) =>
        this.setState(state => {
          const newState = update(['form', name], value, state)
          const errors = map(errorComponent, validate(prop('form', newState), validationRules))
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
          updateState={this.updateState}
        />
      )
    }
  }
}

export default curry(ValidationHOC)
