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
    required = {},
    onSubmit,
    submitted,
    updateValue,
    validateValue,
    updateValueAndValidate,
  },
  onSubmit: submitCb
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
        onChange={e => onChange('name', getValue(e), null, ({valid, form}) => valid ? submitCb(form) : null )}
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
        onChange={e => onChange('random', getValue(e), null, ({valid, form}) => valid ? submitCb(form) : null )}
      />
      <div className='errorPlaceholder'>{ createErrorMessage(errors.random) }</div>
    </div>
  </div>
)

export default revalidation(Form)
