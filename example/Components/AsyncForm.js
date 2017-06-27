/* eslint-disable no-unused-vars */
import React from 'react'
import Revalidation from '../../src/'

const get = username => new Promise(res => {
  const existingNames = ['foo', 'bar', 'baz', 'foobarbaz']
  setTimeout(() =>
      res({
        data: {
          exists: existingNames.indexOf(username.toLowerCase().trim()) !== -1,
        },
      }),
    1000)
})

// we need to check if user name exists
const isUnusedUserName = (username) => get(username)
  .then(({ data }) => !data.exists)

const SubmitForm = ({
  revalidation: { form, updateValue, updateState, valid, asyncErrors, errors, validateAll, loading, debounce },
  onSubmit,
  }) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); validateAll(onSubmit) }}>
      <div className="formGroup">
        <label>ID</label>
        <input
          type="text"
          value={form.name}
          onChange={debounce.name(updateValue, 1000)}
        />
        {errors.name && errors.name.map((errMsg, index) => (<div className='error' key={index}>
          {errMsg}</div>))}
         {asyncErrors.name && <div className='error'>{asyncErrors.name[0]}</div>}
      </div>
      <div>
        <p>valid? {valid.toString()}</p>
        <p>loading? {loading.toString()}</p>
        <p>valid? {valid.toString()}</p>
        <p>errors? {JSON.stringify(errors, null ,4)}</p>
        <p>asyncErrors? {JSON.stringify(asyncErrors, null ,4)}</p>
      </div>
      <button>Submit</button>

      <button onClick={() => updateState({ name: '', random: '' })}>Reset</button>
    </form>
  )
}

const EnhancedSubmitForm = Revalidation(SubmitForm)

class SubmitPage extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {form: {name: ''}}
  }

  render() {
    const validationRules = {
      name: [
        [x =>  x && x.length >= 6, 'Minimum length of 6'],
      ],
    }

    const asyncValidationRules = {
      name: [
        [isUnusedUserName, name => `Username ${name} is not available`]
      ]
    }

    return (
      <EnhancedSubmitForm
        onSubmit={this.props.onSubmit}
        rules={validationRules}
        initialState={this.state.form}
        asyncRules={asyncValidationRules}
        userNameExists={this.usernameExists}
        validateSingle={true}
        instantValidation={true}
      />
    )
  }
}

export default SubmitPage
