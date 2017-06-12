/* @flow */
import React from 'react'

import { curry } from 'ramda'

const createErrorComponent = (
  componentFn: Function,
  result: Object
) =>
  result.cata({
    Right: a => null,
    Left: errorMsg => componentFn({errorMsg})
  })

export default curry(createErrorComponent)
