/* @flow */
import { curry } from 'ramda'

const createErrorComponent = (
  componentFn: Function,
  result: Object // eslint-disable-line comma-dangle
) =>
  result.cata({
    Right: () => null,
    Left: errorMsgs => componentFn({ errorMsgs }),
  })

export default curry(createErrorComponent)
