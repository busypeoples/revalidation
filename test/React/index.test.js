/* eslint-env mocha */

import { equal } from 'assert'
import React from 'react' // eslint-disable-line no-unused-vars
import ShallowRenderer from 'react-test-renderer/shallow'
import Revalidation from '../../src'

const isNotEmpty = a => a.trim().length > 0

const getValue = e => e.target.value

const validationRules = {
  name: [[isNotEmpty, 'Name should not be empty']],
}

const ErrorComponent = ({ errorMsgs }) =>
  <div className='error'>{errorMsgs && errorMsgs[0]}</div>

const Form = ({
  reValidation: { form, validate, errors = {}, validateAll },
  onSubmit,
}) =>
  <div className='form'>
    <div className='formGroup'>
      <label>Name</label>
      <input
        type='text'
        value={form.name}
        onChange={e => validate('name', getValue(e))}
      />
      {errors.name}
    </div>
    <button onClick={() => validateAll(onSubmit)}>Submit</button>
  </div>

const initialState = { name: '' }

const enhanced = Revalidation(
  initialState,
  validationRules,
  ErrorComponent,
  { validateSingle: false },
)

const EnhancedForm = enhanced(Form) // eslint-disable-line no-unused-vars

describe('React/index', () => {
  it('callback passed to `validateAll` is not called when the form has errors', () => {
    const renderer = new ShallowRenderer()
    let wasCallbackCalled = false
    renderer.render(
      <EnhancedForm
        onSubmit={() => {
          wasCallbackCalled = true
        }}
      />,
    )
    const output = renderer.getRenderOutput()
    output.props.reValidation.validateAll(output.props.onSubmit)
    equal(wasCallbackCalled, false)
  })
})
