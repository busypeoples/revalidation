import { deepEqual } from 'assert'

import updateSyncErrors from '../../src/updaters/updateSyncErrors'
import { UPDATE_FIELD, UPDATE_ALL, VALIDATE_FIELD, VALIDATE_ALL } from '../../src/constants'

const rules = {
  name: [[x => x.length > 3, 'Minimum length is four.']],
  random: [[x => x.length > 6, 'Minimum length is seven.']]
}

const nestedRules = {
  name: [[x => x.length > 3, 'Minimum length is four.']],
  levelOne: {
    levelTwo: {
      random: [[x => x.length > 6, 'Minimum length is seven.']]
    }
  }
}

describe('updaters/updateSyncErrors', () => {

  it('should return an empty array when field value is valid', () => {
    const expected = {form: {name: 'foobar'}, errors: {name: []}}
    const result = updateSyncErrors({form: {name: 'foobar'}, errors: {}}, [VALIDATE_FIELD], {
      rules,
      name: ['name']
    })
    deepEqual(expected, result)
  })

  it('should return an array containing the error messages when field value is invalid', () => {
    const expected = {form: {name: 'bar'}, errors: {name: ['Minimum length is four.']}}
    const result = updateSyncErrors({form: {name: 'bar'}, errors: {}}, [VALIDATE_FIELD], {
      rules,
      name: ['name']
    })
    deepEqual(expected, result)
  })

  it('should only validate the field that has been updated when action=VALIDATE_FIELD', () => {
    const expected = {form: {name: 'foo', random: '1234567'}, errors: {random: []}}
    const result = updateSyncErrors({form: {name: 'foo', random: '1234567'}, errors: {}}, [VALIDATE_FIELD], {
      rules,
      name: ['random']
    })
    deepEqual(expected, result)
  })

  it('should return an empty array when field value is valid and action=VALIDATE_FIELD', () => {
    const expected = {form: {name: 'foobar'}, errors: {name: []}}
    const result = updateSyncErrors({form: {name: 'foobar'}, errors: {}}, [VALIDATE_FIELD], {
      rules,
      name: ['name']
    })
    deepEqual(expected, result)
  })

  it('should validate all fields when the complete form state has been updated', () => {
    const expected = {
      form: {name: 'foo', random: 'random'},
      errors: {name: ['Minimum length is four.'], random: ['Minimum length is seven.']},
      submitted: true,
    }
    const result = updateSyncErrors({form: {name: 'foo', random: 'random'}, errors: {}}, [VALIDATE_ALL], {
      rules,
    })
    deepEqual(expected, result)
  })

  it('should validate all fields when action=VALIDATE_ALL', () => {
    const expected = {
      form: {name: 'foo', random: 'random'},
      errors: {name: ['Minimum length is four.'], random: ['Minimum length is seven.']},
      submitted: true,
    }
    const result = updateSyncErrors({form: {name: 'foo', random: 'random'}, errors: {}}, [VALIDATE_ALL], {
      rules,
    })
    deepEqual(expected, result)
  })

  it('should skip validation when action=UPDATE_ALL', () => {
    const expected = {
      form: {name: 'foo', random: 'random'},
      errors: {}
    }
    const result = updateSyncErrors({form: {name: 'foo', random: 'random'}, errors: {}}, [UPDATE_ALL], {
      rules,
    })
    deepEqual(expected, result)
  })

  it('should should validate a deeply nested form field when action=VALIDATE_FIELD', () => {
    const expected = {
      form: {name: 'foo', levelOne: {levelTwo: {random: 'bar'}}},
      errors: {name: [], levelOne: {levelTwo: {random: ['Minimum length is seven.']}}},
    }
    const result = updateSyncErrors({
      form: {
        name: 'foo',
        levelOne: {
          levelTwo: {
            random: 'bar'
          }
        }
      },
      errors: {name: [], levelOne: {levelTwo: {random: []}}},
    }, VALIDATE_FIELD, {name: ['levelOne', 'levelTwo', 'random'], rules: nestedRules})
    deepEqual(expected, result)
  })

  it('should should validate all deeply nested fields when action=VALIDATE_ALL', () => {
    const expected = {
      form: {name: 'foo', levelOne: {levelTwo: {random: 'bar'}}},
      errors: {name: ['Minimum length is four.'], levelOne: {levelTwo: {random: ['Minimum length is seven.']}}},
      submitted: true,
    }
    const result = updateSyncErrors({
      form: {
        name: 'foo',
        levelOne: {levelTwo: {random: 'bar'}}
      },
      errors: {},
    }, VALIDATE_ALL, {
      rules: nestedRules,
    })
    deepEqual(expected, result)
  })

})
