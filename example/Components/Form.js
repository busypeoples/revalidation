import React from 'react'
import { compose } from 'ramda'

import helpers from '../helpers'

const { getValue } = helpers

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
        <div className='errorPlaceholder'>{ errors.name }</div>
      </div>
      <div className='formGroup'>
        <label>Password</label>
        <input
          type='password'
          value={form.password}
          onChange={compose(validate('password'), getValue)}
        />
        <div className='errorPlaceholder'>{ errors.password }</div>
      </div>
      <div className='formGroup'>
        <label>Repeat Password</label>
        <input
          type='password'
          value={form.repeatPassword}
          onChange={compose(validate('repeatPassword'), getValue)}
        />
        <div className='errorPlaceholder'>{ errors.repeatPassword }</div>
      </div>
      <div className='formGroup'>
        <label>Random</label>
        <input
          type='text'
          value={form.random}
          onChange={compose(validate('random'), getValue)}
        />
        <div className='errorPlaceholder'>{ errors.random }</div>
      </div>
      <button onClick={() => validateAll(onSubmit)}>Submit</button>
    </div>
  )

export default Form
