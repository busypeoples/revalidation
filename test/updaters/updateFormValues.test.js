import { deepEqual } from 'assert'

import updateFormValues from '../../src/updaters/updateFormValues'
import { UPDATE_FIELD, UPDATE_ALL, VALIDATE_FIELD, VALIDATE_ALL } from '../../src/constants'

describe('updaters/updateFormValues', () => {

  it('should change the field value according to the provided value when an input has been updated', () => {
    const expected = {form: {name: 'bar'}}
    const result = updateFormValues({form: {name: 'foo'}}, UPDATE_FIELD, {name: ['name'], value: 'bar'})
    deepEqual(expected, result)
  })

  it('should change the field value according to the provided value when the complete form state has been updated', () => {
    const expected = {form: {name: '', random: ''}}
    const result = updateFormValues({form: {name: 'foo', random: 'bar'}}, UPDATE_ALL, {
      value: {
        name: '',
        random: ''
      }
    })
    deepEqual(expected, result)
  })

  it('should not change the form state when action=VALIDATE_FIELD', () => {
    const expected = {form: {name: 'foo', random: 'bar'}}
    const result = updateFormValues({form: {name: 'foo', random: 'bar'}}, VALIDATE_FIELD, {
      value: {
        name: '',
        random: ''
      }
    })
    deepEqual(expected, result)
  })

  it('should not change the form state when action=VALIDATE_ALL', () => {
    const expected = {form: {name: 'foo', random: 'bar'}}
    const result = updateFormValues({form: {name: 'foo', random: 'bar'}}, VALIDATE_ALL, {
      value: {
        name: '',
        random: ''
      }
    })
    deepEqual(expected, result)
  })

  it('should should update a deeply nested form field when action=UPDATE_FIELD', () => {
    const expected = {form: {name: 'foo', levelOne: {levelTwo: {random: 'foobar'}}}}
    const result = updateFormValues({
      form: {
        name: 'foo',
        levelOne: {
          levelTwo: {
            random: 'bar'
          }
        }
      }
    }, UPDATE_FIELD, {name: ['levelOne', 'levelTwo', 'random'], value: 'foobar'})
    deepEqual(expected, result)
  })

  it('should should update a deeply nested form when action=UPDATE_ALL', () => {
    const expected = {form: {name: 'foo', levelOne: {levelTwo: {random: 'bar'}}}}
    const result = updateFormValues({
      form: {
        name: 'oldName',
        levelOne: {levelTwo: {random: 'oldRandom'}}
      }
    }, UPDATE_ALL, {
      value: {
        name: 'foo',
        levelOne: {
          levelTwo: {
            random: 'bar'
          }
        }
      }
    })
    deepEqual(expected, result)
  })

})
