/* @flow */
import React from 'react'
import R from 'ramda'

import Revalidation from '../lib/'

// default ErrorComponent
const ErrorComponent = ({errorMsg}) => <div className='error'>{errorMsg}</div>

// helper
const getValue = R.path(['target', 'value'])

// validations
const isNotEmpty = a => a.trim().length > 0
const hasCapitalLetter = a => /[A-Z]/.test(a)
const isGreaterThan = R.curry((len, a) => (a > len))
const isLengthGreaterThan = len => R.compose(isGreaterThan(len), R.prop('length'))

const StatelessFunction = ({ form, onChange, onSubmit, errors = {} }) =>
  <div className='form'>
    <div className='formGroup'>
      <label>Name</label>
      <input
        type='text'
        value={form.name}
        onChange={R.compose(onChange('name'), getValue)}
      />
      { errors.name }
    </div>
    <div className='formGroup'>
      <label>Random</label>
      <input
        type='text'
        value={form.random}
        onChange={R.compose(onChange('random'), getValue)}
      />
      { errors.random }
    </div>
    <button onClick={() => onSubmit(form)}>Submit</button>
  </div>

const validationRules = {
  name: [
    [isNotEmpty, 'Name should not be  empty.']
  ],
  random: [
    [ isLengthGreaterThan(7), 'Minimum Random length of 8 is required.' ],
    [ hasCapitalLetter, 'Random should contain at least one uppercase letter.' ],
  ]
}
const initialState = {form: {name: '', random: ''}}

const enhanced = Revalidation(
  initialState,
  validationRules,
  ErrorComponent
)

export default enhanced(StatelessFunction)
