import React from 'react'
import Revalidation from 'revalidation'

import Form from './Form'
import ErrorComponent from './ErrorComponent'
import validationRules from '../validationRules'

const initialState = {name: '', password: '', repeatPassword: '', random: ''}

const enhanced = Revalidation(
  initialState,
  validationRules,
  ErrorComponent,
  {validateSingle: false, instantValidation: true}
)

export default enhanced(Form)
