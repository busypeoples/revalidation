import React from 'react'
import { render } from 'react-dom'
import R from 'ramda'

import Form from './Form'

class Root extends React.Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(values) {
    console.log('updated form values', values)
  }

  render() {
    return (
      <div>
        <h1>Revalidation Example</h1>
        <h2>High Order Validation Component for React</h2>
        <div>
          <Form
            onSubmit={this.onSubmit}
            form={{name: 'yoo', password: '', repeatPassword: '', random: ''}}
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
