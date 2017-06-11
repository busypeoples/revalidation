/* @flow */
import React from 'react'

import validate from '../'

import {
  curry,
  map,
  prop,
  update
} from '../utils/'


const ValidationHOC = (initialState = {errors: []}, validationRules = [], errorComponent) => Component =>
  class extends React.Component {

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
      return (
        <Component
          {...this.props}
          form={prop('form', this.state)}
          errors={prop('errors', this.state)}
          onChange={this.onChange}
          updateState={this.updateState}
        />
      )
    }
}

export default ValidationHOC
