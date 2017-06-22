import React from 'react'
import Revalidation, { isValid } from '../../src/'
import { compose, head } from 'ramda'

import helpers from '../helpers'
import createErrorMessage from './createErrorMessage'

const {
  getValue,
  isNotEmpty,
  isLengthGreaterThan,
  hasCapitalLetter,
  } = helpers

const Form = ({ reValidation : {form, validate, valid, errors = {}, validateAll}, onSubmit, disableButtonOption = false }) =>
  (
    <div className='form'>
      <div className='formGroup'>
        <label>Name</label>
        <input
          type='text'
          className={isValid(errors.name) ? '' : 'error'}
          value={form.name}
          onChange={compose(validate('name'), getValue)}
        />
        <div className='errorPlaceholder'>{ createErrorMessage(errors.name) }</div>
      </div>
      <div className='formGroup'>
        <label>Random</label>
        <input
          type='text'
          className={isValid(errors.random) ? '' : 'error'}
          value={form.random}
          onChange={compose(validate('random'), getValue)}
        />
        <div className='errorPlaceholder'>{ createErrorMessage(errors.random) }</div>
      </div>
      <button
        {...{disabled: disableButtonOption && !valid ? 'disabled' : false}}
        className={disableButtonOption && !valid? 'inactive' : 'active' }
        onClick={() => validateAll(onSubmit)}>Submit
      </button>
    </div>
  )

const validationRules = {
  name: [
    [isNotEmpty, 'Name should not be  empty.']
  ],
  random: [
    [isLengthGreaterThan(7), 'Minimum Random length of 8 is required.'],
    [hasCapitalLetter, 'Random should contain at least one uppercase letter.'],
  ]
}

const initialState = {}

const enhanced = Revalidation(
  initialState,
  validationRules,
  {validateSingle: true}
)

export default enhanced(Form)
