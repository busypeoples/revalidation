/* @flow */
import {
  Either,
} from './utils/'

import {
  curry,
  compose,
  map,
  prop,
  merge,
  mergeWithKey,
  sequence,
} from 'ramda'

const { Right, Left } = Either

const identity = r => r
// create a new object containing an empty array
// createDefaultValidation({'name': '1', 'random': '2'})
// outputs: {name: [], random: []}
const createDefaultValidation = map(i => [])

// merge default validation rules with actual validation rules
// createBaseValidation({name: [], random: []}, {name: [[x => x > 1, 'some msg']]})
// outputs: {name: [[x => x > 1, 'some msg']], random: []})
const createBaseValidation = (input, validations) => merge(createDefaultValidation(input), validations)

const makePredicate = ([predFn, e]) => (a, all) => predFn(a, all) ? Right(a) : Left(e)
const runPredicates = ([input, validations, all]) =>
  map(predFn => predFn(input, all), map(makePredicate, validations))

const validator = transform => map(compose(transform, sequence(Either.of), runPredicates))
const makeValidationObject = (input, validations) => mergeWithKey((k, l, r) => [l, r, input], input, createBaseValidation(input, validations))
const createValidation = (transform: Function = identity) => compose(validator(transform), makeValidationObject)

export default createValidation
