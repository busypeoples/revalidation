/* @flow */
import React from 'react'
import { render } from 'react-dom'
import R from 'ramda'

import FormClass from './formClass'
import StatelessFunctionForm from './statelessFunctionForm'

class Root extends React.Component {
  constructor(props) {
    super(props)
    this.state = {classExample: true}
    this.onSubmit = this.onSubmit.bind(this)
    this.changeView = this.changeView.bind(this)
  }

  onSubmit(values) {
    console.log('updated form values', values)
  }

  changeView() {
    this.setState(state => ({ classExample: !state.classExample }))
  }

  render() {
    const { classExample } = this.state
    const form = classExample
      ? <FormClass onSubmit={this.onSubmit} />
      : <StatelessFunctionForm onSubmit={this.onSubmit} />

    return (
      <div>
        <button onClick={this.changeView}>
          { classExample
            ? 'Show Stateless Function Example'
            : 'Class Example'
          }
        </button>
        <div>{form}</div>
      </div>
    )
  }
}

render(
  <div>
    <Root />
  </div>,
  document.getElementById('root')
)
