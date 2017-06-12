import { equal, deepEqual } from 'assert'

import createValidation from '../src/createValidation'
import {
  compose,
  curry,
  partial,
  prop,
} from 'ramda'

const identity = r => r

// configure a transformation that simply returns the original value
const transform = r => r.fold(identity, () => true)
const Validate = createValidation(transform)

// Predicates

const isNotEmpty = a => a.trim().length > 0
const hasCapitalLetter = a => /[A-Z]/.test(a)
const isGreaterThan = curry((len, a) => (a > len))
const isLengthGreaterThan = len => compose(isGreaterThan(len), prop('length'))
const isEqual = compareKey => (a, all) => a === all[compareKey]

// Messages

const notEmptyMsg = field => `${field} should not be empty.`
const minimumMsg = field => `Minimum ${field} length of 3 is required.`
const capitalLetterMag = field => `${field} should contain at least one uppercase letter.`
const equalMsg = (field1, field2) => `${field2} should be equal with ${field1}`

// Rules

const nameValidationRule = [[isNotEmpty, notEmptyMsg('Name')]]

const randomValidationRule =  [
  [ isLengthGreaterThan(2), minimumMsg('Random') ],
  [ hasCapitalLetter, capitalLetterMag('Random') ],
]

const passwordValidationRule =  [
  [ isLengthGreaterThan(5), minimumMsg('Password') ],
  [ hasCapitalLetter, capitalLetterMag('Password') ],
]

const repeatPasswordValidationRule =  [
  [ isLengthGreaterThan(5), minimumMsg('RepeatedPassword') ],
  [ hasCapitalLetter, capitalLetterMag('RepeatedPassword') ],
  [ isEqual('password'), equalMsg('Password', 'RepeatPassword') ]
]

describe('Validator', () => {

  it('should return an error when invalid', () => {
    const validationRules = {
      name: nameValidationRule,
    }
    const result = Validate({ name: ''}, validationRules)
    deepEqual({name: notEmptyMsg('Name')}, result)
  })

  it('should return true for field when valid', () => {
    const validationRules = {
      name: nameValidationRule,
    }
    const result = Validate({ name: 'foo'}, validationRules)
    deepEqual({name: true}, result)
  })

  it('should handle multiple validations and return the correct errors', () => {
    const validationRules = {
      name: nameValidationRule,
      random: randomValidationRule,
    }
    const result = Validate({ name: 'foo', random:'A'}, validationRules)
    deepEqual({name: true, random: minimumMsg('Random')}, result)
  })

  it('should handle multiple validations and return true for all fields when valid', () => {
    const validationRules = {
      name: nameValidationRule,
      random: randomValidationRule,
    }
    const result = Validate({ name: 'foo', random:'Abcd'}, validationRules)
    deepEqual({name: true, random: true}, result)
  })

  it('should enable to validate to true if two form field values are equal', () => {
    const validationRules = {
      password: passwordValidationRule,
      repeatPassword: repeatPasswordValidationRule,
    }
    const result = Validate({ password: 'fooBar', repeatPassword:'fooBar'}, validationRules)
    deepEqual({password: true, repeatPassword: true}, result)
  })

  it('should enable to validate to falsy if two form field values are not equal', () => {
    const validationRules = {
      password: passwordValidationRule,
      repeatPassword: repeatPasswordValidationRule,
    }
    const result = Validate({ password: 'fooBar', repeatPassword:'fooBarBaz'}, validationRules)
    deepEqual({password: true, repeatPassword: equalMsg('Password', 'RepeatPassword')}, result)
  })

})

