import { equal, deepEqual } from 'assert'

import Validate from '../src/'
import {
  compose,
  curry,
  prop,
} from '../src/utils/'

const isNotEmpty = a => a.trim().length > 0
const hasCapitalLetter = a => /[A-Z]/.test(a)
const isGreaterThan = curry((len, a) => (a > len))
const isLengthGreaterThan = len => compose(isGreaterThan(len), prop('length'))

const notEmptyName = 'Name should not be  empty.'
const minimumRandom = 'Minimum Random length of 3 is required.'
const capitalLetterRandom = 'Random should contain at least one uppercase letter.'

const nameValidationRule = [[isNotEmpty, notEmptyName]]
const randomValidationRule =  [
  [ isLengthGreaterThan(2), minimumRandom ],
  [ hasCapitalLetter, capitalLetterRandom ],
]

describe('Validator', () => {

  it('should return an error when invalid', () => {
    const validationRules = {
      name: nameValidationRule,
    }
    const result = Validate({ name: ''}, validationRules)
    deepEqual({name: {value: notEmptyName}}, result)
  })

  it('should return the values when valid', () => {
    const validationRules = {
      name: nameValidationRule,
    }
    const result = Validate({ name: 'foo'}, validationRules)
    deepEqual({name: {value: [ 'foo' ]}}, result)
  })

  it('should handle multiple validations and return the correct errors', () => {
    const validationRules = {
      name: nameValidationRule,
      random: randomValidationRule,
    }
    const result = Validate({ name: 'foo', random:'A'}, validationRules)
    deepEqual({name: {value: [ 'foo' ]}, random: {value: minimumRandom}}, result)
  })

  it('should handle multiple validations and return all values when valid', () => {
    const validationRules = {
      name: nameValidationRule,
      random: randomValidationRule,
    }
    const result = Validate({ name: 'foo', random:'Abcd'}, validationRules)
    deepEqual({name: {value: [ 'foo' ]}, random: {value: ['Abcd', 'Abcd']}}, result)
  })

})

