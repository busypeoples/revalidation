/* @flow */
import { curry } from 'ramda'

const createErrorComponent = (
  componentFn: Function,
  result: Object // eslint-disable-line comma-dangle
) =>
  componentFn({ errorMsgs: result })

export default curry(createErrorComponent)
