import { equal, ok } from 'assert'

import Either from '../../src/utils/either'

const {Left, Right} = Either

describe('utils/either', () => {

  it('should apply Left on cata', () => {
    const l = Left(2)
    equal(2, l.cata({
      Left: x => x,
      Right: x => x + 1
    }))
  })

  it('should apply Right on cata', () => {
    const r = Right(2)
    equal(3, r.cata({
        Left: x => x,
        Right: x => x + 1
      }))
  })

  it('should return Left when passing a nullable', () => {
    const l = Either.fromNullable(null)
    ok(l.isLeft)
  })


  it('should return Rights when passing in a value', () => {
    const r = Either.fromNullable(1)
    ok(r.isRight)
  })

})
