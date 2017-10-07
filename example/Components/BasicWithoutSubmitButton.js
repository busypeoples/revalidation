/* @flow */
import React from 'react'
import Revalidation from '../../src/'
import Form from './FormWithoutSubmitButton'
import { basicValidationRules } from '../validationRules'

export default class BasicWithoutSubmitButton extends React.Component {

  constructor(props) {
    super(props)
    this.state = {form: {name: '', random: '', comment: ''}}
  }

  render() {
    return (
      <div>
        <Form
          onSubmit={this.props.onSubmit}
          initialState={this.state.form}
          rules={basicValidationRules}
          validateSingle
          validateOnChange
        />
      </div>
    )
  }
}
