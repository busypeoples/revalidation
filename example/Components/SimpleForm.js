/* eslint-disable no-unused-vars */
import React from 'react'
import { compose } from 'ramda'
import revalidation, { isValid } from '../../src/'

import helpers from '../helpers'
import createErrorMessage from './createErrorMessage'

const { getValue } = helpers

const Form = ({ reValidation: { form, updateValue, valid, errors = {}, validateAll }, onSubmit, disableButtonOption = false }) =>
  (
  <div className='form'>
    <div className='formGroup'>
      <label>Name</label>
      <input
        type='text'
        className={isValid(errors.name) ? '' : 'error'}
        value={form.name}
        onChange={compose(updateValue('name'), getValue)}
      />
      <div className='errorPlaceholder'>{ createErrorMessage(errors.name) }</div>
    </div>
    <div className='formGroup'>
      <label>Random</label>
      <input
        type='text'
        className={isValid(errors.random) ? '' : 'error'}
        value={form.random}
        onChange={compose(updateValue('random'), getValue)}
      />
      <div className='errorPlaceholder'>{ createErrorMessage(errors.random) }</div>
    </div>
    <button
      {...{ disabled: disableButtonOption && !valid ? 'disabled' : false }}
      className={disableButtonOption && !valid ? 'inactive' : 'active' }
      onClick={() => validateAll(onSubmit)}>Submit
    </button>
  </div>
  )

export default revalidation(Form)
