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
const validate = createValidation(transform)

// Predicates

const isNotEmpty = a => a.trim().length > 0
const hasCapitalLetter = a => /[A-Z]/.test(a)
const isGreaterThan = curry((len, a) => (a > len))
const isLengthGreaterThan = len => compose(isGreaterThan(len), prop('length'))
const isEqual = compareKey => (a, all) => a === all[compareKey]

// Messages

const notEmptyMsg = field => `${field} should not be empty.`
const minimumMsg = (field, len) => `Minimum ${field} length of ${len} is required.`
const capitalLetterMag = field => `${field} should contain at least one uppercase letter.`
const equalMsg = (field1, field2) => `${field2} should be equal with ${field1}`

// Rules

const nameValidationRule = [[isNotEmpty, notEmptyMsg('Name')]]

const randomValidationRule =  [
  [ isLengthGreaterThan(2), minimumMsg('Random', 3) ],
  [ hasCapitalLetter, capitalLetterMag('Random') ],
]

const passwordValidationRule =  [
  [ isLengthGreaterThan(5), minimumMsg('Password', 6) ],
  [ hasCapitalLetter, capitalLetterMag('Password') ],
]

const repeatPasswordValidationRule =  [
  [ isLengthGreaterThan(5), minimumMsg('RepeatedPassword', 6) ],
  [ hasCapitalLetter, capitalLetterMag('RepeatedPassword') ],
  [ isEqual('password'), equalMsg('Password', 'RepeatPassword') ]
]

describe('Validator', () => {

  it('should return an error when invalid', () => {
    const validationRules = {
      name: nameValidationRule,
    }
    const result = validate({name: ''}, validationRules)
    deepEqual({name: notEmptyMsg('Name')}, result)
  })

  it('should return true for field when valid', () => {
    const validationRules = {
      name: nameValidationRule,
    }
    const result = validate({name: 'foo'}, validationRules)
    deepEqual({name: true}, result)
  })

  it('should handle multiple validations and return the correct errors', () => {
    const validationRules = {
      name: nameValidationRule,
      random: randomValidationRule,
    }
    const result = validate({name: 'foo', random:'A'}, validationRules)
    deepEqual({name: true, random: minimumMsg('Random', 3)}, result)
  })

  it('should handle multiple validations and return true for all fields when valid', () => {
    const validationRules = {
      name: nameValidationRule,
      random: randomValidationRule,
    }
    const result = validate({name: 'foo', random:'Abcd'}, validationRules)
    deepEqual({name: true, random: true}, result)
  })

  it('should enable to validate to true if two form field values are equal', () => {
    const validationRules = {
      password: passwordValidationRule,
      repeatPassword: repeatPasswordValidationRule,
    }
    const result = validate({password: 'fooBar', repeatPassword:'fooBar'}, validationRules)
    deepEqual({password: true, repeatPassword: true}, result)
  })

  it('should enable to validate to falsy if two form field values are not equal', () => {
    const validationRules = {
      password: passwordValidationRule,
      repeatPassword: repeatPasswordValidationRule,
    }
    const result = validate({password: 'fooBar', repeatPassword:'fooBarBaz'}, validationRules)
    deepEqual({password: true, repeatPassword: equalMsg('Password', 'RepeatPassword')}, result)
  })

  it('should skip validation if no predicate function is provided.', () => {
    const validationRules = {
      password: [],
    }
    const result = validate({password: 'fooBar'}, validationRules)
    deepEqual({password: true}, result)
  })


  it('should skip validation if no predicate function is provided and other fields have rules.', () => {
    const validationRules = {
      password: [],
      repeatPassword: repeatPasswordValidationRule,
    }
    const result = validate({password: 'fooBar', repeatPassword: 'fooBarBaz'}, validationRules)
    deepEqual({password: true, repeatPassword: equalMsg('Password', 'RepeatPassword')}, result)
  })

  it('should skip validation if no predicate functions are provided.', () => {
    const validationRules = {
      password: [],
      repeatPassword: [],
    }
    const result = validate({password: '', repeatPassword: ''}, validationRules)
    deepEqual({password: true, repeatPassword: true}, result)
  })

  it('should neglect key ordering.', () => {
    const validationRules = {
      repeatPassword: repeatPasswordValidationRule,
      password: passwordValidationRule,
    }
    const result = validate({password: 'fooBar', repeatPassword: 'foobarbaZ'}, validationRules)
    deepEqual({password: true, repeatPassword: equalMsg('Password', 'RepeatPassword')}, result)
  })

  it('should skip missing validations.', () => {
    const validationRules = {
      password: passwordValidationRule,
    }
    const result = validate({password: 'fooBar', repeatPassword: 'foobarbaZ'}, validationRules)
    deepEqual({password: true, repeatPassword: true}, result)
  })

})
