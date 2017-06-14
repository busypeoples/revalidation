# API
## `Revalidation(initialState, rules, errorCallback, options, Component)`

Creates an enhanced React Component containing validation and state keeping capabilities.

#### Arguments

1. `initialState` *(Object)*: The initial state, will be merged with props `form` if they available.

2. `rules` *(Object)*: An object of rules, consisting of arrays containing predicate function / error message tuple, f.e. `{name: [[a => a.length > 2, 'Minimum length 3.']]}`
 
3. `errorCallback` *(Function)*: The callback function to be called when errors exist for a key. f.e. `({errorMsg}) => <div>{errorMsg[0]}</div>`. A prop errorMsg is passed into the function. Anything can be returned at this point, f.e. a React Component, a boolean, the array itself.

4. `options` *(Object)*: Currently only a single option available: `singleValue`. if you need validation per field you can set the option to true. `{singleValue: true}` 

5. `Component` *(React Component)*: The React Component that will be enhanced with validation and state keeping functionality.

#### Returns

`Higher Order React Component`: The provided component will be enhanced with a [`reValidation`](#revalidation) prop.

#### Example

```js
import React from 'react'
import Revalidation from 'revalidation'
import { head } from 'ramda'

import helpers from './helpers'

const {
  isNotEmpty,
  isLengthGreaterThan,
  hasCapitalLetter,
  } = helpers

const ErrorComponent = ({errorMsgs}) => <div className='error'>{head(errorMsgs)}</div>

const getValue = e => e.target.value

const Form = ({ reValidation : {form, validate, valid, errors = {}, validateAll}, onSubmit }) =>
  (
    <div className='form'>
      <div className='formGroup'>
        <label>Name</label>
        <input
          type='text'
          value={form.name}
          onChange={e => validate('name', getValue(e))}
        />
        { errors.name }
      </div>
      <div className='formGroup'>
        <label>Random</label>
        <input
          type='text'
          value={form.random}
          onChange={e => (validate('random', getValue(e))}
        />
        { errors.random }
      </div>
      <button onClick={() => validateAll(onSubmit)}>Submit</button>
    </div>
  )

const validationRules = {
  name: [
    [isNotEmpty, 'Name should not be  empty.']
  ],
  random: [
    [isLengthGreaterThan(7), 'Minimum Random length of 8 is required.'],
    [hasCapitalLetter, 'Random should contain at least one uppercase letter.'],
  ]
}

const initialState = {}

const enhanced = Revalidation(
  initialState,
  validationRules,
  ErrorComponent,
  {validateSingle: true}
)

export default enhanced(Form)
```

#### reValidation 
An additional prop `reValidation` is provided to the enhanced component.

The following properties are provided by reValidation.

`form` *(Object)*: Containing the current form values. f.e. input field name can be accessed by `form.name`
```js
    const Form = ({ reValidation : {form, onSubmit }) =>
      (
        <div className='form'>
          <div className='formGroup'>
            <label>Name</label>
            <input
              type='text'
              value={form.name}
            />
          </div>
          <button onClick={() => validateAll(onSubmit)}>Submit</button>
        </div>
      )
```

`valid` *(Boolean)*: A computed validation state. Useful when initializing the form and needing disable a submit for example.
```js
<button {...{disabled : !valid}} onClick={() => submit()}>Submit</button>
```

`validate(key, value)` *(Function)*: Apply any changes to a field value and validate.
```js
<input
    type='text'
    value={form.name}
    onChange={e => validate('name', e.targetValue)}
/>
```

`validateAll([cb], [data])` *(Function)*: Function for validating all fields. For example when submitting a form.
To enable an action after successful validation, provide a success `callback`, optionally specific `data` can be passed to the callback.
If no `data` provided is, the current form state will be passed in.
```js
<button onClick={() => validateAll(onSubmit)}>Submit</button>
```

`errors` *(Object)*: The object containing the errors. Depending on the provided error callback the error might have a structure like this f.e.
```js
// errorCallback = ({errorMsgs}) => errorMsgs
{name: [], random: ['something is missing', 'invalid data']}

// errorCallback = ({errorMsgs}) => <div>errorMsgs[0]</div>
{name: [], random: [<div>something is missing</div>]}
```
