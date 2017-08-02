/* eslint-disable no-unused-vars */
import React from 'react'
import { compose } from 'ramda'
import revalidation, { isValid } from '../../src/'

import helpers from '../helpers'
import createErrorMessage from './createErrorMessage'
import { basicValidationRules } from '../validationRules'

const { getValue } = helpers

const Form = ({
  revalidation: {
    asyncErrors,
    form,
    onChange,
    validate,
    valid,
    run,
    errors = {},
    onSubmit,
    updateAsyncErrors,
    submitted,
    updateValue,
    validateValue,
    updateValueAndValidate,
  },
  onSubmit: submitCb,
  pendingSubmit,
}) =>
(
  <div className='form'>
    <div className='formGroup'>
      <label>Name</label>
      <input
        type='text'
        className={isValid(errors.name) ? '' : 'error'}
        name='name'
        value={form.name}
        onChange={updateValueAndValidate}
      />
      <div className='errorPlaceholder'>{ createErrorMessage(errors.name) }</div>
      <div className='errorPlaceholder'>{ createErrorMessage(asyncErrors.name) }</div>
    </div>
    <div className='formGroup'>
      <label>Random</label>
      <input
        type='text'
        className={isValid(errors.random) ? '' : 'error'}
        name='random'
        onBlur={validateValue}
        value={form.random}
        onChange={updateValue}
      />
      <div className='errorPlaceholder'>{ createErrorMessage(errors.random) }</div>
    </div>
    <button
      onClick={() => onSubmit(({form, valid}) => valid ? submitCb(form, updateAsyncErrors) : console.log('something went wrong!'))}>Submit
    </button>
    <hr />
    <pre>
      submitted? {JSON.stringify(submitted, null, 4)}<br />
      valid? {JSON.stringify(valid, null, 4)}<br />
      pending? {JSON.stringify(pendingSubmit, null, 4)}
    </pre>
  </div>
)

const EnhancedForm = revalidation(Form)

class SetAsyncErrorsExample extends React.Component {
  constructor(props) {
    super(props)
    this.state = { form: { name: '', random: '' }, pendingSubmit: false, asyncErrors:{} }
  }

  onSubmit = (formValues, updateAsyncErrors) => {
    const message = `Just updated: ${JSON.stringify(formValues, null, 4)}`
    // something went wrong...
    this.setState(state => ({ pendingSubmit: true }))
    setTimeout(() => {
      updateAsyncErrors({ name: ['Username is not available'] })
      this.setState(state => ({ pendingSubmit: false, message }))
    }, 1000)
  }

  render() {
    const { asyncErrors, form, message, pendingSubmit } = this.state
    return (
      <div>
        <div>
          <pre>{message}</pre>
        </div>
        <EnhancedForm
          onSubmit={this.onSubmit}
          initialState={form}
          rules={basicValidationRules}
          asyncErrors={asyncErrors}
          pendingSubmit={pendingSubmit}
          validateSingle={true}
          validateOnChange={({submitted}) => submitted}
        />
      </div>
    )
  }
}

export default SetAsyncErrorsExample
