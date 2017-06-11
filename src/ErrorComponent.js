/* @flow */
import React from 'react'

const ErrorComponent = componentFn => result =>
  result.cata({
    Right: a => null,
    Left: errorMsg => componentFn({errorMsg})
  })

export default ErrorComponent