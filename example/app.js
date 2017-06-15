import React from 'react'
import { render } from 'react-dom'
import R from 'ramda'

import SimpleForm from './Components/SimpleForm'
import AdvancedForm from './Components/Advanced'
import AdvancedInstantValidationForm from './Components/AdvancedInstantValidation'

class Root extends React.Component {
  constructor(props) {
    super(props)
    this.state = { example: 1, message: '', formValues: {name: '', random: ''} }
    this.onSubmit = this.onSubmit.bind(this)
    this.changeExample = this.changeExample.bind(this)
    this.updateProps = this.updateProps.bind(this)
    this.getForm = this.getForm.bind(this)
  }

  onSubmit(formValues) {
    const message = `Just updated: ${JSON.stringify(formValues, null, 4)}`
    this.setState(state => ({ formValues, message }))
  }

  changeExample(example) {
    if (example === this.state.example) {
      return
    }
    this.setState(state => ({ example, message: '', formValues: {} }))
  }

  updateProps() {
    this.setState(state => ({
      formValues: {name: 'foobarBaz', random: 'n'}
    }))
  }

  getForm(example, formValues) {
    const initState = { name: '', password: '', repeatPassword: '', random: ''}
    switch (example) {
      case 1:
        return (
          <SimpleForm
            onSubmit={this.onSubmit}
            form={{...{ name: '', random: ''}, ...formValues}}
          />
        )

      case 2:
        return (<AdvancedForm
            onSubmit={this.onSubmit}
            form={{...initState, ...formValues}}
          />
        )
      case 3:
        return (
          <AdvancedInstantValidationForm
            onSubmit={this.onSubmit}
            form={{...initState, ...formValues}}
          />
        )
      case 4:
        return (
          <SimpleForm
            onSubmit={this.onSubmit}
            form={{...{ name: '', random: ''}, ...formValues}}
            disableButtonOption
          />
        )
      default:
        return (
          <SimpleForm
            onSubmit={this.onSubmit}
            form={formValues}
          />
        )
    }
  }

  render() {
    const { example, message, formValues } = this.state
    const selectedForm = this.getForm(example, formValues)
    const getClassName = id => (example === id) ? 'selected' : ''
    const getConfig = id => (id === 1)
      ? {validateSingle: true}
      : (id === 2)
      ? {validateSingle: false, instantValidation: false}
      : {validateSingle: false, instantValidation: true}

    return (
      <div id="main">
        <h1>Revalidation</h1>
        <h2>High Order Validation React Component</h2>
        <div id="example">
          <div className="switch">
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
          { (example === 2 || example == 3) && <button onClick={this.updateProps}>Update Props</button> }
        </div>
      </div>
    )
  }
}

render(
  <div>
    <Root />
  </div>,
  document.getElementById('app')
)
