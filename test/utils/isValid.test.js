import { equal, ok } from 'assert'

import isValid from '../../src/utils/isValid'

describe('utils/isValid', () => {

  it('isValid should return true when validating []', () => {
    ok(isValid([]))
  })

  it('isValid should return true when validating {}', () => {
    ok(isValid({}))
  })

  it('isValid should return false when validating {id: "foo"}', () => {
    ok(!isValid({id: 'foo'}))
  })

  it('isValid should return false when validating {id: "foo", name: true, random: true}', () => {
    ok(!isValid({id: 'foo', name: true, random: true}))
  })

  it('isValid should return false when validating ["foo"]', () => {
    ok(!isValid(['foo']))
  })

  it('isValid should return false when validating [true, true, "foo"]', () => {
    ok(!isValid([true, true, 'foo']))
  })

  it('isValid should return false when validating {random: x => x}', () => {
    ok(!isValid({random: x => x}))
  })

  it('isValid should return false when validating [x => x]', () => {
    ok(!isValid([x => x]))
  })

  it('isValid should return false when validating {random:{}}', () => {
    ok(!isValid({random:{}}))
  })

  it('isValid should return false when validating [{}]', () => {
    ok(!isValid([{}]))
  })

})
