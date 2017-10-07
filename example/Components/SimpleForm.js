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
  onSubmit: submitCb,
  disableButtonOption = false
}) =>
(
  <form className='form' noValidate onSubmit={(e) => { e.preventDefault(); onSubmit(({valid, form}) => valid ? submitCb(form) : null ) }}>
    <div className='formGroup'>
      <label htmlFor='name'>Name</label>
      <input        
        id='name'
        name='name'
        type='text'
        autoFocus
        required={required.name}
        aria-required={required.name ? 'true' : null}
        aria-errormessage='name-error'
        aria-invalid={isValid(errors.name) ? null : 'true'}
        value={form.name}
        onChange={updateValueAndValidate}
      />
      <div 
        id='name-error'
        className='errorPlaceholder'
        aria-live='assertive' 
        aria-atomic='true'
        aria-relevant='additions text'>
          <a href='#name'>{ createErrorMessage(errors.name) }</a>
      </div>
    </div>
    <div className='formGroup'>
      <label htmlFor='random'>Random</label>
      <input
        id='random'
        name='random'
        type='text'        
        required={required.random}
        aria-required={required.random ? 'true' : null}
        aria-errormessage='random-error'
        aria-invalid={isValid(errors.random) ? null : 'true'}                
        onBlur={validateValue}
        value={form.random}
        onChange={updateValue}
      />
      <div 
        id='random-error' 
        className='errorPlaceholder'
        aria-live='assertive' 
        aria-atomic='true'
        aria-relevant='additions text'>
          <a href='#random'>{ createErrorMessage(errors.random) }</a>
      </div>
    </div>
    <div className='formGroup'>
      <label htmlFor='comment'>Comment</label>
      <input
        id='comment'
        name='comment'
        type='text'
        required={required.comment}
        aria-required={required.comment ? 'true' : null}
        aria-errormessage='comment-error'
        aria-invalid={isValid(errors.comment) ? null : 'true'}                
        onBlur={validateValue}
        value={form.comment}
        onChange={updateValue}
      />
      <div 
        id='comment-error' 
        className='errorPlaceholder'
        aria-live='assertive' 
        aria-atomic='true'
        aria-relevant='additions text'>
          <a href='#comment'>{ createErrorMessage(errors.comment) }</a>
      </div>
    </div>
    <button
      {...{ 'aria-disabled': disableButtonOption && !valid ? 'true' : null }}      
      aria-describedby={['name-error', 'random-error', 'comment-error'].join(' ')}
      onClick={() => onSubmit(({valid, form}) => valid ? submitCb(form) : null )}
    >
      Submit
    </button>
  </form>
)

export default revalidation(Form)
