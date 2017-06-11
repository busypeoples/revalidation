/* @flow */
import {
  curry,
  compose,
  Either,
  map,
  merge,
  prop,
  sequence,
  update
} from './utils/'

const { Right, Left } = Either

const makePredicate = ([predFn, e]) => a => predFn(a) ? Right(a) : Left(e)
const runPredicates = ([input, validations]) =>
  map(predFn => predFn(input), map(makePredicate, validations))

const validator = map(compose(sequence(Either.of), runPredicates))
const makeValidationObject = merge((k, l, r) => [l, r])
const validate = compose(validator, makeValidationObject)

export default validate
