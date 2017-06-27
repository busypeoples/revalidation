# API
## `Revalidation(Component)`

Creates an enhanced React Component containing validation and state keeping capabilities.

#### Arguments
1. `Component` *(React Component)*: The React Component that will be enhanced with validation and state keeping functionality.


#### Returns

#### &lt;HigherOrderComponentForm />

`Higher Order React Component`: The provided component will be enhanced with a [`revalidation`](#revalidation) prop.



#### Props
- __`initialState`__ *(Object)*: 

    The initial state, make sure to provide defaults for all form fields.

- __`rules`__ *(Object)*: 

    An object of rules, consisting of arrays containing predicate function / error message tuple, f.e. `{name: [[a => a.length > 2, 'Minimum length 3.']]}`
 
- __`singleValue`__ *(Function)*: 

    if you need validation per field you can set the option to true (default is true).

- __`validateOnChange`__: *(Function)*: 

    if you need instant validation as soon as props have changed set to true (default is true).

- __`asyncRules`__ *(Object)*: 

    An object of asynchronous rules, consisting of arrays containing predicate function / error message tuple, f.e. `{name: [[doSomethingAsync, 'Minimum length 3.']]}`

- __`updateForm`__ *(Object)*: 

    Overrides the current form values. Only use in situations where `setState` isn't enough, add and remove `the updateForm` before and after 
updating the form values to avoid destroying the local component state when the component will receive new props. To initialize the 
state use `initialState`. `updateForm` is ignored when the Component is initially mounted.

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

const Form = ({ revalidation : {form, validate, valid, errors = {}, validateAll}, onSubmit }) =>
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

#### revalidation 
An additional prop `revalidation` is provided to the enhanced component.

The following properties are provided by revalidation.

- __`form`__ *(Object)*: 
    
    Containing the current form values. f.e. input field name can be accessed via `form.name`

    ```js
        const Form = ({ revalidation : {form, onSubmit }) =>
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

- __`valid`__ *(Boolean)*: 
    
    A computed validation state. Useful when initializing the form and needing to disable a submit f.e.
    
    ```js
    <button {...{disabled : !valid}} onClick={() => submit()}>Submit</button>
    ```

- __`onChange(key, value)`__ *(Function)*: 

    Apply any changes to a field value and validate.
    
    ```js
    <input
        type='text'
        value={form.name}
        onChange={e => onChange('name', e.targetValue)}
    />
    ```

- __`updateState(form)`__ *(Function)*: 

   Udpate the complete form state, f.e. implementing a clear function.

    ```js
     <button onClick={() => updateState({ name: '', random: '' })}>Reset</button>
    ```

- __`validateAll([cb], [data])`__ *(Function)*: 

    Function for validating all fields. For example when submitting a form.
    To enable an action after successful validation, provide a success `callback`, optionally specific `data` can be passed to the callback.
    If no `data` provided is, the current form state will be passed in.
    
    ```js
    <button onClick={() => validateAll(onSubmit)}>Submit</button>
    ```

- __`errors`__ *(Object)*: 
    
    The object containing the errors. How to display the errors isn't up to __Revalidation__.
    
    Initially `errors` might be an empty object, this is the case when no validation has run. 

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


===

#### Helpers

##### isValid

Use `isValid` to check if errors exist for an input. 

```js

<input
  type='text'
  className={isValid(errors.name) ? '' : 'error'}
  value={form.name}
  onChange={compose(onChange('name'), getValue)}
/>

```
