/* eslint-disable no-unused-vars */
import React from 'react'
import { compose } from 'ramda'

import revalidation from '../../src/'
import helpers from '../helpers'
import createErrorMessage from './createErrorMessage'

const { getValue } = helpers

const Form = ({ revalidation: { form, onChange, errors = {}, onSubmit }, onSubmit: submitCb }) =>
  (
  <div className='form'>
    <div className='formGroup'>
      <label>Name</label>
      <input
        type='text'
        value={form.name}
        onChange={compose(onChange('name'), getValue)}
      />
      <div className='errorPlaceholder'>{ createErrorMessage(errors.name) }</div>
    </div>
    <div className='formGroup'>
      <label>Password</label>
      <input
        type='password'
        value={form.password}
        onChange={compose(onChange('password'), getValue)}
      />
      <div className='errorPlaceholder'>{ createErrorMessage(errors.password) }</div>
    </div>
    <div className='formGroup'>
      <label>Repeat Password</label>
      <input
        type='password'
        value={form.repeatPassword}
        onChange={compose(onChange('repeatPassword'), getValue)}
      />
      <div className='errorPlaceholder'>{ createErrorMessage(errors.repeatPassword) }</div>
    </div>
    <div className='formGroup'>
      <label>Random</label>
      <input
        type='text'
        value={form.random}
        onChange={compose(onChange('random'), getValue)}
      />
      <div className='errorPlaceholder'>{ createErrorMessage(errors.random) }</div>
    </div>
    <button onClick={() => onSubmit(submitCb)}>Submit</button>
  </div>
  )

export default revalidation(Form)
