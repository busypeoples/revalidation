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

const identity = r => r

const makePredicate = ([predFn, e]) => (a, all) => predFn(a, all) ? Right(a) : Left(e)
const runPredicates = ([input, validations, all]) =>
  map(predFn => predFn(input, all), map(makePredicate, validations))

const validator = transform => map(compose(transform, sequence(Either.of), runPredicates))
const makeValidationObject =(input, validations) => merge((k, l, r) => [l, r, input], input, validations)
const createValidation = (transform: Function = identity) => compose(validator(transform), makeValidationObject)

export default createValidation
