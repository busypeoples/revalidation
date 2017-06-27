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
    const expected = [{form: {name: 'foobar'}, asyncErrors: {}}, []]

    deepEqual(expected, updateAsyncErrors([{form: {name: 'foobar'}, asyncErrors: {}}, []], VALIDATE_FIELD, {
      name: ['name']
    }))
  })

  it('should return an empty array when field value is valid, asyncRules are defined and action=VALIDATE_FIELD', (done) => {
    const expected = {form: {name: 'foobar'}, pending: false, asyncErrors: { name: [] }}

    const [state, [runPromises]] = updateAsyncErrors([{form: {name: 'foobar'}, asyncErrors: {}}, []], VALIDATE_FIELD, {
      asyncRules,
      name: ['name'],
      value: 'foobar',
    })

    return runPromises().fork(() => {}, result => {
      deepEqual(expected, result({form: {name: 'foobar'}, asyncErrors: {}}))
      done()
    })

  })

  it('should return an array containing the error messages when field value is invalid', (done) => {
    const expected = {form: {name: 'bar'}, pending: false, asyncErrors: {name: ['Minimum length is four.']}}

    const [state, [runPromises]] = updateAsyncErrors([{form: {name: 'bar'}, asyncErrors: {}}, []], VALIDATE_FIELD, {
      asyncRules,
      name: ['name'],
      value: 'foo',
    })

    runPromises().fork(() => {}, result => {
      deepEqual(expected, result({form: {name: 'bar'}, asyncErrors: {}}))
      done()
    })

  })

  it('should skip validating when action=UPDATE_FIELD', () => {
    const expected = {form: {name: 'foo'}, pending: false, asyncErrors: {}}

    const [state, [runPromises]] = updateAsyncErrors([{form: {name: 'foo'}, asyncErrors: {}}, []], UPDATE_FIELD, {
      asyncRules,
      name: ['name'],
      value: 'foo',
    })

    equal(null, runPromises)
  })

  it('should return an empty array when field value is valid and action=VALIDATE_FIELD', (done) => {
    const expected = {form: {name: 'foobar'}, pending: false, asyncErrors: {name: []}}

    const [state, [runPromises]] = updateAsyncErrors([{form: {name: 'foobar'}, asyncErrors: {}}, []], VALIDATE_FIELD, {
      asyncRules,
      validateSingle: true,
      name: ['name'],
      value: 'foobar',
    })

    return runPromises().fork(() => {}, result => {
      deepEqual(expected, result({form: {name: 'foobar'}, asyncErrors: {}}))
      done()
    })
  })

  it('should validate all fields when the complete form state has been updated', (done) => {
    const expected = {
      form: {name: 'foo', random: 'random'},
      pending: false,
      asyncErrors: {name: ['Minimum length is four.'], random: ['Minimum length is seven.']}
    }

    const [state, [runPromises]]  = updateAsyncErrors([{form: {name: 'foo', random: 'random'}, asyncErrors: {}}, []], VALIDATE_ALL, {
      asyncRules,
    })

    return runPromises().fork(() => {}, result => {
      deepEqual(expected, result({form: {name: 'foo', random: 'random'}, asyncErrors: {}}))
      done()
    })
  })

  it('should validate all fields when action=VALIDATE_ALL', (done) => {
    const expected  = {
      form: {name: 'foo', random: 'random'},
      pending: false,
      asyncErrors: {name: ['Minimum length is four.'], random: ['Minimum length is seven.']},
    }

    const [state, [runPromises]] = updateAsyncErrors([{form: {name: 'foo', random: 'random'}, asyncErrors: {}}, []], VALIDATE_ALL, {
      asyncRules,
    })

    return runPromises().fork(() => {}, result => {
      deepEqual(expected, result({form: {name: 'foo', random: 'random'}, asyncErrors: {}}))
      done()
    })
  })

  it('should skip validation when validateOnChange action !== UPDATE_ALL', () => {
    const expected = {
      form: {name: 'foo', random: 'random'},
      pending: false,
      asyncErrors: {},
    }

    const [state, [runPromises]] = updateAsyncErrors([{form: {name: 'foo', random: 'random'}, asyncErrors: {}}, []], UPDATE_ALL, {
      asyncRules,
    })

    equal(null, runPromises)
  })

  it('should skip validation when action !== VALIDATE_ALL and failed sync error messages exists.', () => {
    const expected = {
      form: {name: 'foo', random: 'random'},
      pending: false,
      asyncErrors: {name: ['Some Sync Error']},
    }

    const [state, [runPromises]] = updateAsyncErrors([{form: {name: 'foo', random: 'random'}, asyncErrors: {}}, []], UPDATE_FIELD, {
      asyncRules,
      name: ['name'],
      value: 'foo',
    })

    equal(null, runPromises)
  })

})
