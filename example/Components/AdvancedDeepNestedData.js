/* @flow */
import React from 'react'
import revalidation from '../../src/'
import helpers from '../helpers'
import createErrorMessage from './createErrorMessage'

const {
  isNotEmpty,
  isLengthGreaterThan,
  hasCapitalLetter,
  getValue,
} = helpers

const Form = ({ revalidation: { form, onChange, errors = {}, onSubmit }, onSubmit: submitCb }) =>
  (
    <div className='form'>
      <div className='formGroup'>
        <label>Name</label>
        <input
          type='text'
          value={form.name}
          onChange={e => onChange('name', getValue(e))}
        />
        <div className='errorPlaceholder'>{ createErrorMessage(errors.name) }</div>
      </div>
      <div className='formGroup'>
        <label>Password</label>
        <input
          type='password'
          value={form.settings.password}
          onChange={e => onChange(['settings', 'password'], getValue(e))}
        />
        <div className='errorPlaceholder'>{ createErrorMessage(errors.settings.password) }</div>
      </div>
      <div className='formGroup'>
        <label>Repeat Password</label>
        <input
          type='password'
          value={form.settings.repeatPassword}
          onChange={e => onChange(['settings', 'repeatPassword'], getValue(e))}
        />
        <div className='errorPlaceholder'>{ createErrorMessage(errors.settings.repeatPassword) }</div>
      </div>
      <div className='formGroup'>
        <label>Random</label>
        <input
          type='text'
          value={form.levelOne.levelTwo.random}
          onChange={e => onChange(['levelOne', 'levelTwo', 'random'], getValue(e))}
        />
        <div className='errorPlaceholder'>{ createErrorMessage(errors.levelOne.levelTwo.random) }</div>
      </div>
      <button onClick={() => onSubmit(submitCb)}>Submit</button>
    </div>
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
