import React from 'react'
import { head } from 'ramda'
import { isValid } from '../../src/'

export default (errorMsgs) => isValid(errorMsgs) ? null : <div className='error'>{head(errorMsgs)}</div>
