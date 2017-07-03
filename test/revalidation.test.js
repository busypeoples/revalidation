/* eslint-env mocha */

import { equal } from 'assert'
import React from 'react' // eslint-disable-line no-unused-vars
import ShallowRenderer from 'react-test-renderer/shallow'
import Revalidation, { isValid } from '../src/'

const isNotEmpty = a => a.trim().length > 0

const getValue = e => e.target.value

const validationRules = {
  name: [[isNotEmpty, 'Name should not be empty']],
}

const displayErrors = (errorMsgs) =>
  isValid(errorMsgs) ? null : <div className='error'>{errorMsgs[0]}</div>

const Form = ({
  revalidation: { form, validate, errors = {}, validateAll },
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
      {displayErrors(errors.name)}
    </div>
    <button onClick={() => validateAll(onSubmit)}>Submit</button>
  </div>

const initialState = { name: '' }

const EnhancedForm = Revalidation(Form) // eslint-disable-line no-unused-vars

describe('revalidation', () => {
  it('callback passed to `onSubmit` is not called when the form has errors', () => {
    const renderer = new ShallowRenderer()
    let wasCallbackCalled = false
    renderer.render(
      <EnhancedForm
        initialState={initialState}
        rules={validationRules}
        validateSingle={false}
        onSubmit={() => {
          wasCallbackCalled = true
        }}
      />,
    )
    const output = renderer.getRenderOutput()
    output.props.revalidation.onSubmit(output.props.onSubmit)
    equal(wasCallbackCalled, false)
  })
})
