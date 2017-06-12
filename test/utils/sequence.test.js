import { deepEqual } from 'assert'

import sequence from '../../src/utils/sequence'
import Either from '../../src/utils/either'
const { Left, Right } = Either

/*

 it('should convert Right([1, 2, 3]) to [Right(1), Right(2)]', () => {
 deepEqual([Right(1), Right(2), Right(3)], sequence(x => [x], Right([1, 2, 3])))
 })

 it('should convert Left() to [Left()]', () => {
 deepEqual([Left(1)], sequence(x => [x], Left(1)))
 })

*/

describe('utils/sequence', () => {

  it('should convert [Right(1), Right(2), Right(3)] to Right([1, 2, 3]', () => {
    deepEqual(Right([1, 2, 3]), sequence(Either.of, [Right(1), Right(2), Right(3)]))
  })

  it('should convert [Right(1), Right(2), Left()] to Left()', () => {
    deepEqual(Left(), sequence(Either.of, [Right(1), Right(2), Left()]))
  })


})
