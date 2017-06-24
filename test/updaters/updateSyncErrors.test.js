import { deepEqual } from 'assert'

import updateSyncErrors from '../../src/updaters/updateSyncErrors'
import { UPDATE_FIELD, UPDATE_ALL, VALIDATE_FIELD, VALIDATE_ALL } from '../../src/constants'

const rules = {
  name: [[x => x.length > 3, 'Minimum length is four.']],
  random: [[x => x.length > 6, 'Minimum length is seven.']]
}

describe('updaters/updateSyncErrors', () => {

  it('should return an empty array when field value is valid and validateSingle is set to true', () => {
    const expected = [{form: {name: 'foobar'}, errors: {name: []}}, []]
    const result = updateSyncErrors([{form: {name: 'foobar'}, errors: {}}, []], UPDATE_FIELD, {
      rules,
      validateSingle: true,
      instantValidation: true,
      name: 'name'
    })
    deepEqual(expected, result)
  })

  it('should return an array containing the error messages when field value is invalid', () => {
    const expected = [{form: {name: 'bar'}, errors: {name: ['Minimum length is four.']}}, []]
    const result = updateSyncErrors([{form: {name: 'bar'}, errors: {}}, []], UPDATE_FIELD, {
      rules,
      validateSingle: true,
      instantValidation: true,
      name: 'name'
    })
    deepEqual(expected, result)
  })

  it('should skip validating when validateSingle is set to false and a field has been updated', () => {
    const expected = [{form: {name: 'foo'}, errors: {}}, []]
    const result = updateSyncErrors([{form: {name: 'foo'}, errors: {}}, []], UPDATE_FIELD, {
      rules,
      validateSingle: false,
      instantValidation: true,
      name: 'name'
    })
    deepEqual(expected, result)
  })

  it('should return an empty array when field value is valid and validateSingle is set to true and a validate field has been triggered', () => {
    const expected = [{form: {name: 'foobar'}, errors: {name: []}}, []]
    const result = updateSyncErrors([{form: {name: 'foobar'}, errors: {}}, []], VALIDATE_FIELD, {
      rules,
      validateSingle: true,
      instantValidation: true,
      name: 'name'
    })
    deepEqual(expected, result)
  })

  it('should validate all fields when the complete form state has been updated', () => {
    const expected = [{
      form: {name: 'foo', random: 'random'},
      errors: {name: ['Minimum length is four.'], random: ['Minimum length is seven.']}
    }, []]
    const result = updateSyncErrors([{form: {name: 'foo', random: 'random'}, errors: {}}, []], UPDATE_ALL, {
      rules,
      instantValidation: true
    })
    deepEqual(expected, result)
  })

  it('should validate all fields a validate all actions has been triggered', () => {
    const expected = [{
      form: {name: 'foo', random: 'random'},
      errors: {name: ['Minimum length is four.'], random: ['Minimum length is seven.']}
    }, []]
    const result = updateSyncErrors([{form: {name: 'foo', random: 'random'}, errors: {}}, []], VALIDATE_ALL, {
      rules,
      instantValidation: true
    })
    deepEqual(expected, result)
  })

  it('should skip validation when instantValidation is false and the action is not validate all', () => {
    const expected = [{
      form: {name: 'foo', random: 'random'},
      errors: {}
    }, []]
    const result = updateSyncErrors([{form: {name: 'foo', random: 'random'}, errors: {}}, []], UPDATE_ALL, {
      rules,
      instantValidation: false
    })
    deepEqual(expected, result)
  })

})
