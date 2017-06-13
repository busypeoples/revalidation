import React from 'react'
import { compose } from 'ramda'

import Revalidation from '../src/'
import helpers from './helpers'

const {
  getValue,
  isNotEmpty,
  isLengthGreaterThan,
  hasCapitalLetter,
  } = helpers

// default ErrorComponent
const ErrorComponent = ({errorMsg}) => <div className='error'>{errorMsg[0]}</div>

const Form = ({ reValidation : {form, validate, valid, errors = {}, validateAll}, onSubmit }) =>
  (
      <div className='form'>
        <div className='formGroup'>
          <label>Name</label>
          <input
            type='text'
            value={form.name}
            onChange={compose(validate('name'), getValue)}
          />
          { errors.name }
        </div>
        <div className='formGroup'>
          <label>Password</label>
          <input
            type='text'
            value={form.password}
            onChange={compose(validate('password'), getValue)}
          />
          { errors.password }
        </div>
        <div className='formGroup'>
          <label>Repeat Password</label>
          <input
            type='text'
            value={form.repeatPassword}
            onChange={compose(validate('repeatPassword'), getValue)}
          />
          { errors.repeatPassword }
        </div>
        <div className='formGroup'>
          <label>Random</label>
          <input
            type='text'
            value={form.random}
            onChange={compose(validate('random'), getValue)}
          />
          { errors.random }
        </div>
        <button onClick={() => validateAll(onSubmit)}>Submit</button>
      </div>
    )

const isEqual = compareKey => (a, all) => a === all[compareKey]

// Messages

const minimumMsg = (field, len) => `Minimum ${field} length of ${len} is required.`
const capitalLetterMag = field => `${field} should contain at least one uppercase letter.`
const equalMsg = (field1, field2) => `${field2} should be equal with ${field1}`


const passwordValidationRule =  [
  [ isLengthGreaterThan(5), minimumMsg('Password', 6) ],
  [ hasCapitalLetter, capitalLetterMag('Password') ],
]

const repeatPasswordValidationRule =  [
  [ isLengthGreaterThan(5), minimumMsg('RepeatedPassword', 6) ],
  [ hasCapitalLetter, capitalLetterMag('RepeatedPassword') ],
  [ isEqual('password'), equalMsg('Password', 'RepeatPassword') ]
]

const validationRules = {
  name: [
    [isNotEmpty, 'Name should not be  empty.']
  ],
  random: [
    [ isLengthGreaterThan(7), 'Minimum Random length of 8 is required.' ],
    [ hasCapitalLetter, 'Random should contain at least one uppercase letter.' ],
  ],
  password: passwordValidationRule,
  repeatPassword: repeatPasswordValidationRule,

}

const initialState = {}

const enhanced = Revalidation(
  initialState,
  validationRules,
  ErrorComponent,
  {validateSingle: false}
)

export default enhanced(Form)
