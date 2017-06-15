import React from 'react'
import { head } from 'ramda'

const ErrorComponent = ({errorMsgs}) => <div className='error'>{head(errorMsgs)}</div>

export default ErrorComponent
