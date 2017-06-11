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

const ValidationHOC = (initialState, validationRules, ErrorComponent) => Component =>
  class extends React.Component {

    constructor(props) {
      super(props)
      this.state = initialState
      this.updateState = this.updateState.bind(this)
    }

    updateState(state) {
      this.setState(state)
    }

    render() {
      const onChange = curry((name, value) =>
        this.updateState(state => {
          const newState = update(['form', name], value, state)
          const errors = map(ErrorComponent, getErrors(prop('form', newState), validationRules))
          return update('errors', errors, newState)
        })
      )
      return (
        <Component
          {...this.props}
          form={prop('form', this.state)}
          errors={prop('errors', this.state)}
          onChange={onChange}
          updateState={this.updateState}
        />
      )
    }
}

export default ValidationHOC
