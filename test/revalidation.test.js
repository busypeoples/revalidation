/* eslint-env mocha */

import { equal } from 'assert'
import React from 'react' // eslint-disable-line no-unused-vars
import ShallowRenderer from 'react-test-renderer/shallow'
import Revalidation, { isValid } from '../src/'

const isNotEmpty = a => a.trim().length > 0

const validationRules = {
  name: [[isNotEmpty, 'Name should not be empty']],
}

const displayErrors = (errorMsgs) =>
  isValid(errorMsgs) ? null : <div className='error'>{errorMsgs[0]}</div>

const Form = ({
  revalidation: { form, updateValueAndValidate, errors = {}, onSubmit },
  onSubmit: submitCb,
}) =>
  <div className='form'>
    <div className='formGroup'>
      <label>Name</label>
      <input
        type='text'
        value={form.name}
        name='name'
        onChange={updateValueAndValidate}
      />
      {displayErrors(errors.name)}
    </div>
    <button onClick={onSubmit(({ form, valid }) => valid ? submitCb(form) : null)}>Submit</button>
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
    output.props.revalidation.onSubmit(({valid, form}) => valid ? output.props.onSubmit(form) : null)
    equal(wasCallbackCalled, false)
  })

  it('callback passed to `onSubmit` is called when the form is valid', () => {
    const renderer = new ShallowRenderer()
    const initialState = { name: 'foo' }
    let wasCallbackCalled = false
    renderer.render(
      <EnhancedForm
        initialState={initialState}
        rules={validationRules}
        validateSingle={false}
        validateOnChange={false}
        onSubmit={() => {
          wasCallbackCalled = true
        }}
      />,
    )
    const output = renderer.getRenderOutput()
    output.props.revalidation.onSubmit(({valid, form, errors}) => console.log('valid: ', valid, form, errors) || valid ? output.props.onSubmit(form) : null)
    equal(wasCallbackCalled, true)
  })
})
