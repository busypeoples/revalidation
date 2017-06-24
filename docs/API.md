# API
## `Revalidation(initialState, rules, options, Component)`

Creates an enhanced React Component containing validation and state keeping capabilities.

#### Arguments

1. `initialState` *(Object)*: The initial state, will be merged with props `form` if they available.

2. `rules` *(Object)*: An object of rules, consisting of arrays containing predicate function / error message tuple, f.e. `{name: [[a => a.length > 2, 'Minimum length 3.']]}`
 
3. `options` *(Object)*: Currently there are two options available: `singleValue` and `instantValidation`. 

    - `singleValue`: if you need validation per field you can set the option to true (default is false). `{singleValue: true}` 
    - `instantValidation`: if you need instant validation as soon as props have changed set to true (default is false). `{instantValidation: true}` 

5. `Component` *(React Component)*: The React Component that will be enhanced with validation and state keeping functionality.

__NOTE:__ Enabling to override the `rules` and `options` via props might be added to Revalidation at some point, as to enable 
dynamic changes.

#### Returns

`Higher Order React Component`: The provided component will be enhanced with a [`reValidation`](#revalidation) prop.

#### Example

```js
import React from 'react'
import Revalidation, { isValid } from 'revalidation'
import { head } from 'ramda'

import helpers from './helpers'

const {
  isNotEmpty,
  isLengthGreaterThan,
  hasCapitalLetter,
} = helpers

const displayErrors = (errorMsgs) => 
  isValid(errorMsgs) ? null : <div className='error'>{head(errorMsgs)}</div>

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
        { displayErrors(errors.random) }
      </div>
      <button onClick={() => validateAll(onSubmit)}>Submit</button>
    </div>
  )

const EnhancedForm = Revalidation(Form)

// ...usage

const initialState = {name: '', random: ''}

const validationRules = {
  name: [
    [isNotEmpty, 'Name should not be  empty.']
  ],
  random: [
    [isLengthGreaterThan(7), 'Minimum Random length of 8 is required.'],
    [hasCapitalLetter, 'Random should contain at least one uppercase letter.'],
  ]
}


<EnhancedForm 
    initialState={initialState}
    rules={validationRules}
    validateSingle
/>


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

`valid` *(Boolean)*: A computed validation state. Useful when initializing the form and needing to disable a submit f.e.
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

`errors` *(Object)*: The object containing the errors. How to display the errors isn't up to __Revalidation__.

Every field is mapped to list of error messages.

```
{
  name: [],
  random: ['Minimum Random length of 8 is required.']
}
```

Display the error messages as needed. This approach enables to define field specific error messages if needed.

```js

const displayErrors = (errorMsgs) => 
  isValid(errorMsgs) ? null : <div className='error'>{head(errorMsgs)}</div>

 <div className='formGroup'>
  <label>Random</label>
  <input
    type='text'
    value={form.random}
    onChange={e => (validate('random', getValue(e))}
  />
  { displayErrors(errors.random) }
</div>
```
