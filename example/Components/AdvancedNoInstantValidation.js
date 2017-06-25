/* @flow */
import React from 'react'
import Revalidation from '../../src/'
import Form from './Form'
import validationRules from '../validationRules'

export default class AdvancedNoInstantValidation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {form: { name: '', password: '', repeatPassword: '', random: '' }}
  }

  render() {
    return (
        <Form
          onSubmit={this.props.onSubmit}
          initialState={this.state.form}
          rules={validationRules}
          updateForm={this.props.updateForm}
          validateSingle={true}
          instantValidation={false}
        />
    )
  }
}
