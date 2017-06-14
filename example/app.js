import React from 'react'
import { render } from 'react-dom'
import R from 'ramda'

import Form from './Form'
import SimpleForm from './SimpleForm'

class Root extends React.Component {
  constructor(props) {
    super(props)
    this.state = { example: 1 }
    this.onSubmit = this.onSubmit.bind(this)
    this.changeExample = this.changeExample.bind(this)
  }

  onSubmit(values) {
    console.log('updated form values', values)
  }

  changeExample(example) {
    this.setState(state => ({example}))
  }

  render() {
    const { example } = this.state

    const SelectedForm = example === 1 ? SimpleForm : Form
    return (
      <div id="main">
        <h1>Revalidation</h1>
        <h2>High Order Validation React Component</h2>
        <div>
          {  }
        </div>
        <div id="example">
          <div className="switch">
            <div
              onClick={() => this.changeExample(1)}
              className={example === 1 ? 'selected' : ''}
            >
              Simple
            </div>
            <div
              onClick={() => this.changeExample(2)}
              className={example === 2 ? 'selected' : ''}
            >
              Advanced
            </div>
          </div>
          <SelectedForm
            onSubmit={this.onSubmit}
            form={{name: 'foo', random: ''}}
          />
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
