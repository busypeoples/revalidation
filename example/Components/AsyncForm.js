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

const SubmitForm = ({
  revalidation: { form, onChange, updateState, valid, asyncErrors, errors, onSubmit, debounce },
  onSubmit: submitCb,
  pendingNameCheck,
  usernameExists,
  }) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(({valid, form}) => valid ? submitCb(form) : null ) }}>
      <div className="formGroup">
        <label>ID</label>
        <input
          type="text"
          value={form.name}
          onChange={debounce.name(usernameExists, 1000)}
        />
        {errors.name && errors.name.map((errMsg, index) => (<div className='error' key={index}>
          {errMsg}</div>))}
         {asyncErrors.name && <div className='error'>{asyncErrors.name[0]}</div>}
      </div>
      <div className="info" style={{padding: '10px'}}>
        <i>To see the async validation fail type: "foobarbaz"</i>
      </div>
      <div>
        <p>valid? {valid.toString()}</p>
        <p>loading? {pendingNameCheck.toString()}</p>
        <p>valid? {valid.toString()}</p>
        <p>errors? {JSON.stringify(errors, null ,4)}</p>
        <p>asyncErrors? {JSON.stringify(asyncErrors, null ,4)}</p>
      </div>
      <button>Submit</button>

      <button onClick={() => updateState({ name: '' })}>Reset</button>
    </form>
  )
}

const EnhancedSubmitForm = Revalidation(SubmitForm)

class SubmitPage extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {form: {name: ''}, pendingNameCheck: false, pendingSubmit: false, asyncErrors:{}}
  }

  onSubmit = (data) => {
    this.setState(state => ({pendingSubmit: true}))
    // something went wrong...
    setTimeout(() => {
      this.setState(state => ({ pendingSubmit: false }))
      this.props.onSubmit(data)
    }, 1000)
  }

  isUnusedUserName = (username, {errors}) => {
    if (errors.name.length > 0) return
    this.setState(state => ({pendingNameCheck: true}))
    get(username)
    .then(({ data }) => data).then(data => {
      const asyncErrors = data.exists
        ? { name: [`Username ${name} is not available`] }
        : { name: [] }
      this.setState({ asyncErrors, pendingNameCheck: false })
    })
  }

  render() {
    const validationRules = {
      name: [
        [x =>  x && x.length >= 6, 'Minimum length of 6'],
      ],
    }

    return (
      <EnhancedSubmitForm
        onSubmit={this.onSubmit}
        rules={validationRules}
        initialState={this.state.form}
        asyncErrors={this.state.asyncErrors}
        usernameExists={this.isUnusedUserName}
        validateSingle={true}
        validateOnChange={true}
        pendingNameCheck={this.state.pendingNameCheck}
        pendingSubmit={this.state.pendingSubmit}
      />
    )
  }
}

export default SubmitPage
