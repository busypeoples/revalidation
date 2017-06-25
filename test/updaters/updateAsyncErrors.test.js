import { equal, deepEqual } from 'assert'

import updateAsyncErrors from '../../src/updaters/updateAsyncErrors'
import { UPDATE_FIELD, UPDATE_ALL, VALIDATE_FIELD, VALIDATE_ALL } from '../../src/constants'

const createPromise = (fn, delay = 100) => {
  return (input) => new Promise(res =>{
    setTimeout(() => res(fn(input)), delay)
  })
}

const asyncRules = {
  name: [[createPromise(x => x.length > 3), 'Minimum length is four.']],
  random: [[createPromise(x => x.length > 6), 'Minimum length is seven.']]
}

describe('updaters/updateAsyncErrors', () => {

  it('should skip validation when no asyncRules are defined', () => {
    const expected = [{form: {name: 'foobar'}, errors: {}}, []]

    deepEqual(expected, updateAsyncErrors([{form: {name: 'foobar'}, errors: {}}, []], UPDATE_FIELD, {
      validateSingle: true,
      instantValidation: true,
      name: 'name'
    }))
  })

  it('should return an empty array when field value is valid and validateSingle=true and asyncRules are defined', () => {
    const expected = {form: {name: 'foobar'}, pending: false, errors: { name: [] }}

    const [state, [runPromises]] = updateAsyncErrors([{form: {name: 'foobar'}, errors: {}}, []], UPDATE_FIELD, {
      asyncRules,
      validateSingle: true,
      instantValidation: true,
      name: 'name',
      value: 'foobar',
    })

    return runPromises().fork(() => {}, result => {
      deepEqual(expected, result({form: {name: 'foobar'}, errors: {}}))
    })

  })

  it('should return an array containing the error messages when field value is invalid', () => {
    const expected = {form: {name: 'bar'}, pending: false, errors: {name: ['Minimum length is four.']}}

    const [state, [runPromises]] = updateAsyncErrors([{form: {name: 'bar'}, errors: {}}, []], UPDATE_FIELD, {
      asyncRules,
      validateSingle: true,
      instantValidation: true,
      name: 'name',
      value: 'foo',
    })

    return runPromises().fork(() => {}, result => {
      deepEqual(expected, result({form: {name: 'bar'}, errors: {}}))
    })

  })

  it('should skip validating when validateSingle=false and a field has been updated', () => {
    const expected = {form: {name: 'foo'}, pending: false, errors: {}}

    const [state, [runPromises]] = updateAsyncErrors([{form: {name: 'foo'}, errors: {}}, []], UPDATE_FIELD, {
      asyncRules,
      validateSingle: false,
      instantValidation: true,
      name: 'name',
      value: 'foo',
    })

    equal(null, runPromises)

  })

  it('should return an empty array when field value is valid and validateSingle=true and a VALIDATE_FIELD has been triggered', () => {
    const expected = {form: {name: 'foobar'}, pending: false, errors: {name: []}}

    const [state, [runPromises]] = updateAsyncErrors([{form: {name: 'foobar'}, errors: {}}, []], VALIDATE_FIELD, {
      asyncRules,
      validateSingle: true,
      instantValidation: true,
      name: 'name',
      value: 'foobar',
    })

    return runPromises().fork(() => {}, result => {
      deepEqual(expected, result({form: {name: 'foobar'}, errors: {}}))
    })
  })

  it('should validate all fields when the complete form state has been updated', () => {
    const expected = {
      form: {name: 'foo', random: 'random'},
      pending: false,
      errors: {name: ['Minimum length is four.'], random: ['Minimum length is seven.']}
    }

    const [state, [runPromises]]  = updateAsyncErrors([{form: {name: 'foo', random: 'random'}, errors: {}}, []], UPDATE_ALL, {
      asyncRules,
      instantValidation: true,
    })

    return runPromises().fork(() => {}, result => {
      console.log(result)
      deepEqual(expected, result({form: {name: 'foo', random: 'random'}, errors: {}}))
    })
  })

  it('should validate all fields when a VALIDATE_ALL action has been triggered', () => {
    const expected  = {
      form: {name: 'foo', random: 'random'},
      pending: false,
      errors: {name: ['Minimum length is four.'], random: ['Minimum length is seven.']},
    }

    const [state, [runPromises]] = updateAsyncErrors([{form: {name: 'foo', random: 'random'}, errors: {}}, []], VALIDATE_ALL, {
      asyncRules,
      instantValidation: true,
    })

    return runPromises().fork(() => {}, result => {
      deepEqual(expected, result({form: {name: 'foo', random: 'random'}, errors: {}}))
    })
  })

  it('should skip validation when instantValidation is false and action !== VALIDATE_ALL', () => {
    const expected = {
      form: {name: 'foo', random: 'random'},
      pending: false,
      errors: {},
    }

    const [state, [runPromises]] = updateAsyncErrors([{form: {name: 'foo', random: 'random'}, errors: {}}, []], UPDATE_ALL, {
      asyncRules,
      instantValidation: false
    })

    equal(null, runPromises)
  })

  it('should skip validation when instantValidation=true and action !== VALIDATE_ALL and fail sync error messages exists.', () => {
    const expected = {
      form: {name: 'foo', random: 'random'},
      pending: false,
      errors: {name: ['Some Sync Error']},
    }

    const [state, [runPromises]] = updateAsyncErrors([{form: {name: 'foo', random: 'random'}, errors: {}}, []], UPDATE_FIELD, {
      asyncRules,
      instantValidation: true,
      name: 'name',
      value: 'foo',
    })

    equal(null, runPromises)
  })

})
