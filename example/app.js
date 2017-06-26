/* eslint-disable no-nested-ternary, no-unused-vars, no-undef */

import React from 'react'
import { render } from 'react-dom'

import AdvancedInstantValidation from './Components/AdvancedInstantValidation'
import AdvancedNoInstantValidation from './Components/AdvancedNoInstantValidation'
import AdvancedDeepNestedData from './Components/AdvancedDeepNestedData'
import Basic from './Components/Basic'
import BasicWithIsValid from './Components/BasicWithIsValid'
import AsyncForm from './Components/AsyncForm'

class Root extends React.Component {
  constructor(props) {
    super(props)
    this.state = { example: 1, message: '', formValues: { name: '', random: '' } }
  }

  onSubmit = (formValues) => {
    const message = `Just updated: ${JSON.stringify(formValues, null, 4)}`
    this.setState(() => ({ formValues, message }))
  }

  changeExample = (example) => {
    if (example !== this.state.example) {
      this.setState(() => ({example, message: '', formValues: {}}))
    }
  }

  updateProps = () => {
    this.setState(() => ({
      formValues: { name: 'foobarBaz', random: 'n' },
    }))
  }

  getForm = (example, formValues = {}) => {
    const initState = { name: '', password: '', repeatPassword: '', random: '' }
    const updatedValues = {...initState, ...formValues}

    switch (example) {

      case 1: return <Basic onSubmit={this.onSubmit} />

      case 2: return <BasicWithIsValid onSubmit={this.onSubmit} />

      case 3: return <AdvancedNoInstantValidation onSubmit={this.onSubmit} updateForm={updatedValues} />

      case 4: return <AdvancedInstantValidation onSubmit={this.onSubmit} updateForm={updatedValues} />

      case 5: return <AdvancedDeepNestedData onSubmit={this.onSubmit} updateForm={updatedValues} />

      case 6: return <AsyncForm onSubmit={this.onSubmit} />

      default: return <AdvancedDeepNestedData onSubmit={this.onSubmit} updateForm={updatedValues} />
    }
  }

  render() {
    const { example, message, formValues } = this.state

    const examples = [
      {id: 1, name: 'Basic'},
      {id: 2, name: 'Basic (Disable Submit Button if Invalid)'},
      {id: 3, name: 'Advanced (No dynamic prop updates validation)'},
      {id: 4, name: 'Advanced (Dynamic prop updates validation)'},
      {id: 5, name: 'Advanced (Deep Nested Input Data)'},
      {id: 6, name: 'Async Example'},
    ]

    const selectedForm = this.getForm(example, formValues)
    const getClassName = id => (example === id) ? 'selected' : ''
    const getConfig = id => (id === 1)
      ? { validateSingle: true, instantValidation: true }
      : (id === 3)
        ? { validateSingle: false, instantValidation: false }
        : { validateSingle: false, instantValidation: true }

    return (
      <div id="main">
        <h1>Revalidation</h1>
        <h2>High Order Validation React Component</h2>
        <div id="example">
          <div className="switch">
            {examples.map(({id, name}) => <div
              onClick={() => this.changeExample(id)}
              className={getClassName(id)}
              key={id}
            >
            {name}
            </div>)}
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
          { ([2, 3, 4].indexOf(example) !== -1) && <button onClick={this.updateProps}>Update Props</button> }
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
