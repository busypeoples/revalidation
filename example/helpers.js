import {
  compose,
  curry,
  path,
  prop,
} from 'ramda'

// helper
const getValue = path(['target', 'value'])

// validations
const isNotEmpty = a => a.trim().length > 0
const hasCapitalLetter = a => /[A-Z]/.test(a)
const isGreaterThan = curry((len, a) => (a > len))
const isLessThan = curry((len, a) => (a < len))
const isLengthGreaterThan = len => compose(isGreaterThan(len), prop('length'))
const isLengthLessThan = len => compose(isLessThan(len), prop('length'))

export default {
  getValue,
  isNotEmpty,
  isLengthGreaterThan,
  isLengthLessThan,
  hasCapitalLetter,
}
