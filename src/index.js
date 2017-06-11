/* @flow */
import React from 'react'
import {
  curry,
  compose,
  Either,
  map,
  merge,
  prop,
  sequence,
  update
} from './utils/'

const { Right, Left } = Either

const makePredicate = ([predFn, e]) => a => predFn(a) ? Right(a) : Left(e)
const runPredicates = ([input, validations]) =>
  map(predFn => predFn(input), map(makePredicate, validations))

const validate = map(compose(sequence(Either.of), runPredicates))
const makeValidationObject = merge((k, l, r) => [l, r])
const getErrors = compose(validate, makeValidationObject)


const ValidationHOC = (initialState = {errors: []}, validationRules = [], errorComponent) => Component =>
  class extends React.Component {

    constructor(props) {
      super(props)
      this.state = initialState
      this.onChange = curry((name, value) =>
        this.setState(state => {
          const newState = update(['form', name], value, state)
          const errors = map(errorComponent, getErrors(prop('form', newState), validationRules))
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
