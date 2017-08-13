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

- __`validateSingle`__ *(Boolean)*:

    if you need validation per field you can set the option to true (default is false).

- __`validateOnChange`__: *(Boolean|Function)*:

    if you need instant validation as soon as props have changed set to true (default is false).
    Pass in a function to enable dynamic validation after the form has been submitted:

    ```js
    <Form validateOnChange={(submitted) => submitted} />
    ```

    The provided function will receive the current state, enabling to set `validateOnChange` depending on that state.

- __`asyncErrors`__ *(Object)*:

    An object containing asynchronous errors, f.e. `{userName: ['UserName is not available.']}`
    Enables to pass any asynchronous errors back into Revalidation.

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

const Form = ({ revalidation : {form, validate, valid, errors = {}, onSubmit}, onSubmitCb }) =>
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
      <button onClick={() => onSubmit(onSubmitCb)}>Submit</button>
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
    validateOnChange
/>


```

#### revalidation
An additional prop `revalidation` is provided to the enhanced component.

The following properties are provided by revalidation.

- __`form`__ *(Object)*:

    Containing the current form values. f.e. input field name can be accessed via `form.name`

    ```js
        const Form = ({ revalidation : {form, onSubmit }, onSubmitCb) =>
          (
            <div className='form'>
              <div className='formGroup'>
                <label>Name</label>
                <input
                  type='text'
                  value={form.name}
                />
              </div>
              <button onClick={() => onSubmit(onSubmitCb)}>Submit</button>
            </div>
          )
    ```

- __`valid`__ *(Boolean)*:

    A computed validation state. Useful when initializing the form and needing to disable a submit f.e.

    ```js
    <button {...{disabled : !valid}} onClick={() => submit()}>Submit</button>
    ```
- __`submitted`__ *(Boolean)*:

    Set to true after the form has been submitted.

- __`onChange(key, value, [type], [callback])`__ *(Function)*:

    Apply any changes to a field value and validate.

    ```js
    <input
        type='text'
        value={form.name}
        onChange={e => onChange('name', e.targetValue)}
    />
    ```    
    Additionally on can pass in a callback function.

    ```js
    <input
        type='text'
        value={form.name}
        onChange={e => onChange('name', e.targetValue, null, ({valid, form}) => valid ? submitCb(form) : null )}
    />
    ```

- __`updateState(form)`__ *(Function)*:

   Udpate the complete form state, f.e. implementing a clear function.

    ```js
     <button onClick={() => updateState({ name: '', random: '' })}>Reset</button>
    ```

- __`onSubmit([cb])`__ *(Function)*:

    Function for validating all fields. For example when submitting a form.
    To enable an action after successful validation, provide a `callback`.
    Thee current state (including errors) as well as the calculated valid state will be passed to the provided callback function.

    ```js
    <button onClick={() => onSubmit(({valid, form}) => valid ? onSubmitCb(form): doSomethingElse())}>Submit</button>
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
        onChange={e => (onChange('random', getValue(e))}
      />
      { displayErrors(errors.random) }
    </div>
    ```

- __`updateErrors`__*(Function)*: Enables to update any errors.


- __`updateAsyncErrors`__*(Function)*: Enables to update any asynchronous errors. Useful when working with asynchronous validations.
    Pass the `updateAsyncErrors` to a callback, once the validation is finished set the result manually.

    ```js
    <button
      onClick={() => onSubmit(({form, valid}) => valid ? submitCb(form, updateAsyncErrors) : console.log('something went wrong!'))}>Submit
    </button>

    // use in another Component...
    class HigherUpComponent extends React.Component {
      onSubmit = (formValues, updateAsyncErrors) => {
        setTimeout(() => {
          // something went wrong...
          updateAsyncErrors({ name: ['Username is not available'] })
        }, 1000)
      }

      render() {
        {/* ... */}
      }
    }
    ```

- __`settings`__ *(Object)*:
    Access the current settings: `{ validateOnChange: true, validateSingle: true }`


Additionally revalidation offers a number of helper functions to quickly update any values or validations.

- __`debounce`__ *(Function)*:
    A helper function for triggering asynchronous validations. The passed in asynchronous validation can be debounced by a specified time. i.e. 1000 ms.

    ```js
    <input
      type="text"
      value={form.name}
      onChange={debounce.name(usernameExists, 1000)}
    />
    ```

- __`updateValue`__ *(Function)*:
    Update a specific field value. Important to note that no validation will run. Use _updateValueAndValidate_ if you need to update and validate of field. A name attribute must be defined on the element for _updateValue_ to update the value.

    ```js
      <input
        type='text'
        className={isValid(errors.random) ? '' : 'error'}
        name='random'
        value={form.random}
        onChange={updateValue}
      />
    ```

- __`validateValue`__ *(Function)*:
    Validates a specific field. Useful when validation should happen after an *onBlur* i.e.
    A name attribute must be defined on the element for _validateValue_ to validate the value.

    ```js
      <input
        type='text'
        className={isValid(errors.random) ? '' : 'error'}
        name='random'
        onBlur={validateValue}
        value={form.random}
        onChange={updateValue}
      />
    ```

- __`updateValueAndValidate`__ *(Function)*:
    Updates and validates the value for the specified element.
    A name attribute must be defined on the element for _updateValueAndValidate_ to update the value.

    ```js
      <input
        type='text'
        className={isValid(errors.random) ? '' : 'error'}
        name='random'
        onBlur={validateValue}
        value={form.random}
        onChange={updateValue}
      />
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
