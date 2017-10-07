import helpers from './helpers'

const {
  isNotEmpty,
  isLengthGreaterThan,
  isLengthLessThan,
  hasCapitalLetter,
} = helpers

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

export const basicValidationRules = {
  name: [
    [isNotEmpty, 'Name should not be  empty.'],
  ],
  random: [
    [isLengthGreaterThan(7), 'Minimum Random length of 8 is required.'],
    [hasCapitalLetter, 'Random should contain at least one uppercase letter.'],
  ],
  comment: [
    [isLengthLessThan(141), 'Comments must be 140 characters or less.']
  ],
}

const validationRules = {
  ...basicValidationRules,
  password: passwordValidationRule,
  repeatPassword: repeatPasswordValidationRule,
}

export default validationRules
