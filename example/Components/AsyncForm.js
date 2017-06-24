/* eslint-disable no-unused-vars */
import React from 'react'
import Revalidation from '../../src/'

const get = username => new Promise(res => {
  setTimeout(() =>
    res({
      data: {
        exists: [
          'foo',
          'bar',
          'baz',
          'foobarbaz',
        ].indexOf(
          username
            .toLowerCase()
            .trim(),
        ) !== -1,
      },
    }),
  1000)
})

// we need to check if user name exists
const isUnusedUserName = (username) => get(username)
  .then(({ data }) => !data.exists)

const SubmitForm = ({
  reValidation: { form, updateValue, updateState, valid, errors, validateAll, pending },
  onSubmit,
}) => (
  <form onSubmit={(e) => { e.preventDefault(); validateAll(onSubmit) }}>
    <div className="formGroup">
      <label>ID</label>
      <input
        type="text"
        value={form.name}
        onChange={e => updateValue('name', e.target.value)}
      />
      {errors.name && errors.name.map((errMsg, index) => (<div className='error' key={index}>
        {errMsg}
      </div>))}
    </div>
    <p>valid? {valid.toString()}</p>
    <p>pending? {pending.toString()}</p>
    <button>Submit</button>

    <button onClick={() => updateState({ name: '', random: '' })}>Reset</button>
  </form>
)

const EnhancedSubmitForm = Revalidation(SubmitForm)

class SubmitPage extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = { form: { name: '' } }
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(newState) {
    this.setState(state => ({ form: newState }))
  }

  render() {
    const validationRules = {
      name: [
        [x => x.length >= 6, 'Minimum length of 6'],
      ],
    }

    return (
      <EnhancedSubmitForm
        onSubmit={this.onSubmit}
        rules={validationRules}
        initialState={this.state.form}
        asyncRules={{
          name: [[isUnusedUserName, 'Username is not available'],
          ] }}
        userNameExists={this.usernameExists}
        validateSingle={true}
        instantValidation={true}
      />
    )
  }
}

export default SubmitPage
