/* @flow */
import { validate } from 'spected'
import { identity } from 'ramda'

/**
 * Defines the shape of the validation results. Always return an empty [] when value is valid.
 * In case of errors simply return the array containing the errors.
 *
 * @example
 *
 *   validate({id: [[id => id > 0, 'Please provide a valid id']], {id: 1}})
 *   //=> {id: []}
 *
 *   validate({id: [[id => id > 0, 'Please provide a valid id']], {id: 0}})
 *   //=> {id: ['Please provide a valid id']}
 *
 */
export default validate(() => [], identity)
