/* @flow */
import React from 'react'

import curry from '../utils/curry'

const ErrorComponent = curry((
  componentFn: Function,
  result: Object
) =>
  result.cata({
    Right: a => null,
    Left: errorMsg => componentFn({errorMsg})
  })
)

export default ErrorComponent