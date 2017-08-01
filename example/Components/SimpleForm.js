/* eslint-disable no-unused-vars */
import React from 'react'
import { compose } from 'ramda'
import revalidation, { isValid } from '../../src/'

import helpers from '../helpers'
import createErrorMessage from './createErrorMessage'

const { getValue } = helpers

const Form = ({
  revalidation: {
    form,
    onChange,
    validate,
    valid,
    run,
    errors = {},
    onSubmit,
    submitted,
    updateValue,
    validateValue,
    updateValueAndValidate,
  },
  onSubmit: submitCb,
  disableButtonOption = false
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
      {...{ disabled: disableButtonOption && !valid ? 'disabled' : false }}
      className={disableButtonOption && !valid ? 'inactive' : 'active' }
      onClick={() => onSubmit(({valid, form}) => valid ? submitCb(form) : null )}
    >
      Submit
    </button>
  </div>
)

export default revalidation(Form)
