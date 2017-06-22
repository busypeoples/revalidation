import React from 'react'
import Revalidation from '../../src/'

import Form from './Form'
import validationRules from '../validationRules'

const initialState = {name: '', password: '', repeatPassword: '', random: ''}

const enhanced = Revalidation(
  initialState,
  validationRules,
  {validateSingle: false, instantValidation: false}
)

export default enhanced(Form)
