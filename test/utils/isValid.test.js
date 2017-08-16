import { equal, ok } from 'assert'

import isValid from '../../src/utils/isValid'

describe('utils/isValid', () => {

  it('should return true when validating []', () => {
    ok(isValid([]))
  })

  it('should return true when validating {}', () => {
    ok(isValid({}))
  })

  it('should return false when validating {id: "foo"}', () => {
    ok(!isValid({id: 'foo'}))
  })

  it('should return false when validating {id: "foo", name: true, random: true}', () => {
    ok(!isValid({id: 'foo', name: true, random: true}))
  })

  it('should return false when validating ["foo"]', () => {
    ok(!isValid(['foo']))
  })

  it('should return false when validating [true, true, "foo"]', () => {
    ok(!isValid([true, true, 'foo']))
  })

  it('should return false when validating {random: x => x}', () => {
    ok(!isValid({random: x => x}))
  })

  it('should return false when validating [x => x]', () => {
    ok(!isValid([x => x]))
  })

  it('should return true when validating {random:{}}', () => {
    ok(isValid({random: {}}))
  })

  it('should return true when validating {random:[]}', () => {
    ok(isValid({random: []}))
  })

  it('should return true when validating [{}]', () => {
    ok(isValid([{}]))
  })

  it('should return true when passing in an undefined value', () => {
    ok(isValid(undefined))
  })

  it('should return true when validating deeply nested data: {name: [], levelOne: {random: [], nestedArray: [[], [], []]}}', () => {
    ok(isValid({name: [], levelOne: {random: [], nestedArray: [[], [], []]}}))
  })

  it('should return true when validating deeply nested data: {name: [], levelOne: {levelTwo: {random: [], nestedArray: [[], [], []]}}}', () => {
    ok(isValid({name: [], levelOne: {levelTwo: {random: [], nestedArray: [[], [], []]}}}))
  })

  it('should return false when validating deeply nested data: {name: [], levelOne: {random: ["foo"], nestedArray: [["bar"], [], ["baz"]]}}', () => {
    ok(!isValid({name: [], levelOne: {random: ['foo'], nestedArray: [['bar'], [], ['baz']]}}))
  })

  it('should return false when validating deeply nested data: {name: [], levelOne: {levelTwo: {random: ["foo"], nestedArray: [["bar"], [], ["baz"]]}}}', () => {
    ok(!isValid({name: [], levelOne: {levelTwo: {random: ['foo'], nestedArray: [['bar'], [], ['baz']]}}}))
  })

})
