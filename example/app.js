/* eslint-disable no-nested-ternary, no-unused-vars, no-undef */

import React from 'react'
import { render } from 'react-dom'

import SimpleForm from './Components/SimpleForm'
import Form from './Components/Form'
import AsyncForm from './Components/AsyncForm'
import validationRules, { basicValidationRules } from './validationRules'


class Root extends React.Component {
  constructor(props) {
    super(props)
    this.state = { example: 0, message: '', formValues: { name: '', random: '' } }
    this.onSubmit = this.onSubmit.bind(this)
    this.changeExample = this.changeExample.bind(this)
    this.updateProps = this.updateProps.bind(this)
    this.getForm = this.getForm.bind(this)
  }

  onSubmit(formValues) {
    const message = `Just updated: ${JSON.stringify(formValues, null, 4)}`
    this.setState(() => ({ formValues, message }))
  }

  changeExample(example) {
    if (example === this.state.example) {
      return
    }
    this.setState(() => ({ example, message: '', formValues: {} }))
  }

  updateProps() {
    this.setState(() => ({
      formValues: { name: 'foobarBaz', random: 'n' },
    }))
  }

  getForm(example, formValues = {}) {
    const initState = { name: '', password: '', repeatPassword: '', random: '' }
    const updatedValues = {...initState, ...formValues}
    switch (example) {
      case 0:
        return (
          <AsyncForm />
        )

      case 1:
        return (
          <SimpleForm
            onSubmit={this.onSubmit}
            initialState={initState}
            rules={basicValidationRules}
            validateSingle={true}
          />
        )

      case 2:
        return (<Form
          onSubmit={this.onSubmit}
          initialState={initState}
          updateForm={updatedValues}
          instantValidation={false}
          rules={validationRules}
        />
        )
      case 3:
        return (
          <Form
            onSubmit={this.onSubmit}
            initialState={initState}
            rules={validationRules}
            validateSingle={false}
            instantValidation={true}
            updateForm={updatedValues}
          />
        )
      case 4:
        return (
          <SimpleForm
            onSubmit={this.onSubmit}
            initialState={initState}
            rules={basicValidationRules}
            disableButtonOption
          />
        )
      default:
        return (
          <SimpleForm
            onSubmit={this.onSubmit}
            initialState={{ ...{ name: '', random: '' }, ...formValues }}
            rules={basicValidationRules}
            validateSingle={true}
          />
        )
    }
  }

  render() {
    const { example, message, formValues } = this.state
    const selectedForm = this.getForm(example, formValues)
    const getClassName = id => (example === id) ? 'selected' : ''
    const getConfig = id => (id === 1)
      ? { validateSingle: true }
      : (id === 2)
        ? { validateSingle: false, instantValidation: false }
        : { validateSingle: false, instantValidation: true }

    return (
      <div id="main">
        <h1>Revalidation</h1>
        <h2>High Order Validation React Component</h2>
        <div id="example">
          <div className="switch">
            <div
              onClick={() => this.changeExample(1)}
              className={getClassName(0)}
            >
              Async Example
            </div>
            <div
              onClick={() => this.changeExample(1)}
              className={getClassName(1)}
            >
            Basic
            </div>
            <div
              onClick={() => this.changeExample(4)}
              className={getClassName(4)}
            >
              Basic (Disable Submit Button if Invalid)
            </div>
            <div
              onClick={() => this.changeExample(2)}
              className={getClassName(2)}
            >
              Advanced (No dynamic prop updates validation)
            </div>
            <div
              onClick={() => this.changeExample(3)}
              className={getClassName(3)}
            >
              Advanced (Dynamic prop updates validation)
            </div>
          </div>
          <div className="highlight">
          </div>
          <div className="result">
            <pre>configuration:
              {JSON.stringify(getConfig(example), null, 4)}
            </pre>
            <pre>Passed in props:
              {JSON.stringify(formValues, null, 4)}
            </pre>
            <pre>{message}</pre>
          </div>
          {selectedForm}
          { (example === 2 || example === 3) && <button onClick={this.updateProps}>Update Props</button> }
        </div>
      </div>
    )
  }
}

render(
  <div>
    <Root />
  </div>,
  document.getElementById('app'),
)
