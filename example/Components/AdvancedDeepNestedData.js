/* @flow */
import React from 'react'
import revalidation, { isValid } from '../../src/'
import helpers from '../helpers'
import createErrorMessage from './createErrorMessage'

const {
  isNotEmpty,
  isLengthGreaterThan,
  hasCapitalLetter,
  getValue,
} = helpers

const Form = ({ revalidation: { form, onChange, errors = {}, required = {}, onSubmit }, onSubmit: submitCb }) =>
  (
    <form className='form' noValidate onSubmit={(e) => { e.preventDefault(); onSubmit(({valid, form}) => valid ? submitCb(form) : null ) }}>
      <div className='formGroup'>
        <label htmlFor='name'>Name</label>
        <input
          id='name'
          type='text'
          value={form.name}
          autoFocus
          required={required.name}
          aria-required={required.name ? 'true' : null}
          aria-errormessage='name-error'
          aria-invalid={isValid(errors.name) ? null : 'true'}
          onChange={e => onChange('name', getValue(e))}
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
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          type='password'          
          value={form.settings.password}
          required={required.settings.password}
          aria-required={required.settings.password ? 'true' : null}
          aria-errormessage='password-error'
          aria-invalid={isValid(errors.settings.password) ? null : 'true'}
          onChange={e => onChange(['settings', 'password'], getValue(e))}
        />
        <div 
          id='password-error' 
          className='errorPlaceholder'
          aria-live='assertive' 
          aria-atomic='true'
          aria-relevant='additions text'>
            <a href='#password'>{ createErrorMessage(errors.settings.password) }</a>
        </div>
      </div>
      <div className='formGroup'>
        <label htmlFor='repeatPassword'>Repeat Password</label>
        <input
          id='repeatPassword'
          type='password'          
          value={form.settings.repeatPassword}
          required={required.settings.repeatPassword}
          aria-required={required.settings.repeatPassword ? 'true' : null}
          aria-errormessage='repeatPassword-error'
          aria-invalid={isValid(errors.settings.repeatPassword) ? null : 'true'}
          onChange={e => onChange(['settings', 'repeatPassword'], getValue(e))}
        />
        <div 
          id='password-error' 
          className='errorPlaceholder'
          aria-live='assertive' 
          aria-atomic='true'
          aria-relevant='additions text'>
            <a href='#repeatPassword'>{ createErrorMessage(errors.settings.repeatPassword) }</a>
        </div>
      </div>
      <div className='formGroup'>
        <label>Random</label>
        <input
          id='random'
          type='text'
          value={form.levelOne.levelTwo.random}
          required={required.levelOne.levelTwo.random}
          aria-required={required.levelOne.levelTwo.random ? 'true' : null}
          aria-errormessage='random-error'
          aria-invalid={isValid(errors.levelOne.levelTwo.random) ? null : 'true'}
          onChange={e => onChange(['levelOne', 'levelTwo', 'random'], getValue(e))}
        />
        <div 
          id='random-error' 
          className='errorPlaceholder'
          aria-live='assertive' 
          aria-atomic='true'
          aria-relevant='additions text'>
            <a href='#random'>{ createErrorMessage(errors.levelOne.levelTwo.random) }</a>
        </div>        
      </div>
      <button onClick={() => onSubmit(({valid, form}) => valid ? submitCb(form) : null )}>Submit</button>
    </form>
  )

const NestedForm = revalidation(Form)

// validation function

const isEqual = compareKey => (a, all) => a === all[compareKey]

// Messages

const minimumMsg = (field, len) => `Minimum ${field} length of ${len} is required.`
const capitalLetterMag = field => `${field} should contain at least one uppercase letter.`
const equalMsg = (field1, field2) => `${field2} should be equal with ${field1}`


const passwordValidationRule = [
  [isLengthGreaterThan(5), minimumMsg('Password', 6)],
  [hasCapitalLetter, capitalLetterMag('Password')],
]

const repeatPasswordValidationRule = [
  [isLengthGreaterThan(5), minimumMsg('RepeatedPassword', 6)],
  [hasCapitalLetter, capitalLetterMag('RepeatedPassword')],
  [isEqual('password'), equalMsg('Password', 'RepeatPassword')],
]

const nestedValidationRules = {
  name: [
    [isNotEmpty, 'Name should not be  empty.'],
  ],
  settings: {
    password: passwordValidationRule,
    repeatPassword: repeatPasswordValidationRule,
  },
  levelOne: {
    levelTwo: {
      random: [
        [isLengthGreaterThan(7), 'Minimum Random length of 8 is required.'],
        [hasCapitalLetter, 'Random should contain at least one uppercase letter.'],
      ],
    },
  },
}

export default class AdvancedDeepNestedData extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      model: {
        name: '',
        settings: {
          password: '',
          repeatPassword: '',
        },
        levelOne: {
          levelTwo: {
            random: '',
          }
        },
        someOtherValue: 'Not Used',
        someOtherNestedStructure: {
          otherNested: 'Not Used Either'
        }
      }
    }
  }

  render() {
    return (
      <NestedForm
        onSubmit={this.props.onSubmit}
        initialState={this.state.model}
        rules={nestedValidationRules}
        updateForm={this.props.updateForm}
        validateSingle={true}
        validateOnChange={true}
      />
    )
  }
}
