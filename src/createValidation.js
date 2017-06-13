/* @flow */
import {
  Either,
} from './utils/'

import {
  chain,
  curry,
  compose,
  filter,
  ifElse,
  isEmpty,
  map,
  prop,
  merge,
  mergeWithKey,
  sequence,
} from 'ramda'

const { Right, Left } = Either

const identity = r => r

/**
 *
 * curried function for creating a new object containing an empty array for every key
 * createDefaultValidation({'name': '1', 'random': '2'})
 * outputs: {name: [], random: []}
 */
const createDefaultValidation = map(i => [])

/**
 *
 * merge default validation rules with actual validation rules
 * @param input
 * @param validations
 * @example
 *    createBaseValidation(
 *      {name: [], random: []},
 *      {name: [[x => x > 1, 'some msg']]}
 *    ) // {name: [[x => x > 1, 'some msg']], random: []})
 */
const createBaseValidation = (input, validations) => merge(createDefaultValidation(input), validations)


/**
 * higher order function expecting a predicate function and error message tuple.
 * Returns a new function expecting the value and the input object.
 * the predicate function is applied with the input and result object.
 * if predicate function is truthy an Either.Right is rerturned else an Else.Left
 *
 * @param {Function} predFn the predicate function to be run
 * @param {string} e the error message
 */
const makePredicate = ([predFn, e]) => (a, inputs) => predFn(a, inputs) ? Left(a) : Right(e)

/**
 * applies all predicates with the input value and inputs objects
 *
 * @param {*} input the value to be tested
 * @param {Array} validations all validations to be applied with the input
 * @param {Object} all object containing all input values
 */
const runPredicates = ([input, validations, all]) =>
  map(predFn => predFn(input, all), map(makePredicate, validations))

/**
 * validator expects a transformation function to run on the results of the predicates and the sequence.
 * Depending on what is needed, one can transform the Either result.
 *
 * @param {Function} transform to apply the transformation
 */
const validator = transform => map(compose(
  transform,
  chain(ifElse(isEmpty, Right, Left)),
  sequence(Either.of),
  filter(prop('isRight')),
  runPredicates
))

/**
 *
 * @param {Object} input the provided input object
 * @param {Object} validations the validations for the input keys
 */
const makeValidationObject = (input, validations) => mergeWithKey((k, l, r) => [l, r, input], input, createBaseValidation(input, validations))

/**
 *
 * @param transform
 */
const createValidation = (transform: Function = identity) => compose(validator(transform), makeValidationObject)

export default createValidation
