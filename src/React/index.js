/* @flow */
import React from 'react'
import {
  assoc,
  assocPath,
  curry,
  merge,
  prop,
} from 'ramda'

import isValid from '../utils/isValid'
import createErrorComponent from './createErrorComponent'
import createValidation from '../createValidation'

// default ErrorComponent
const DefaultErrorComponent = ({ errorMsgs }) => <div className='error'>{ errorMsgs }</div>

type ReactComponent<A> = (props: A) => ?React$Element<any> | Class<React$Component<any, A, any>>

function Revalidation(
  initialState: Object,
  validationRules: Object,
  errorComponent: Function,
  options: Object,
  Component: any // eslint-disable-line no-unused-vars, comma-dangle
): Class<React$Component<any, *, any>> {
  const validate = createValidation(createErrorComponent(errorComponent || DefaultErrorComponent))

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
    onChange: Function
    validate: Function
    validateAll: Function

    static defaultProps = {
      form: {}
    }

    constructor(props) {
      super(props)
      const { validateSingle = false, instantValidation = false } = options
      this.validateSingle = validateSingle
      this.instantValidation = instantValidation
      this.state = { form: merge(initialState, props.form), errors: {} }
      this.validate = this.validate.bind(this)
      this.validateAll = this.validateAll.bind(this)
    }

    componentWillReceiveProps({ form }) {
      this.setState(({ form: formState, errors }) => {
        const updatedForm = merge(formState, form)
        const updateErrors = this.instantValidation ? validate(updatedForm, validationRules) : errors
        return {
          form: updatedForm,
          errors: updateErrors,
        }
      })
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

    validateAll(cb: Function, data: Object) {
      const { form, errors } = this.state
      this.setState(state => {
        const updateErrors = validate(prop('form', state), validationRules)
        return assoc('errors', updateErrors, state)
      }, () => { if (isValid(errors) && cb) cb(data || form) })
    }

    render() {
      const { form, errors } = this.state
      const valid = isValid(validate(form, validationRules))

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
