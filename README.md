# Revalidation

### Higher Order Component for Forms in React


__Revalidation__ lets you write your forms as __stateless function components__, taking care of managing the local form state
as well as the validation. Revalidation also works with classes and will support other React-like libraries like __Preact__ or __Inferno__
in the future.

### Use Case
Form handling sounds trivial sometimes, but let’s just take a second to think about what is involved in the process.
We need to define form fields, we need to validate the fields,
we also might need to display errors according to the fact if the input validates,
furthermore we need to figure out if the validation is instant or only after clicking
on a submit button and so on and so forth.

### Why Revalidation?
There are a number of solutions already available in __React__ land, each with there own approach on how to tackle aforementioned problems.
__Revalidation__ is another approach on taming the problems that come with forms by only doing two things: managing the
local form component state and validating against a defined set of rules. There is no real configuration and very
little is hidden away from user land. This approach has pros and cons obviously. The benefit we gain, but declaring an initial state
and a set of rules is that we can reuse parts of the spec and compose those specs to bigger specs. The downside is that
Revalidation doesn't abstract away the form handling itself. The only configurations available are `validateSingle` and
`validateOnChange`, while the first enables to define if the predicates functions are against all fields or only that one updated,
the latter enables to turn dynamic validation on and off all together. This is it. Everything is up to the form implementer.

__Revalidation__ enhances the wrapped Component by passing a `revalidation` prop containing a number of properties and functions
to manage the state. There are no automatic field updates, validations or _onsubmit_ actions, Revalidation doesn't know how
the form is implemented or how it should handle user interactions.

Let's see an example to get a better idea on how this could work.
For example we would like to define a number of validation rules for two inputs, _name_ and _random_.
More often that not, inside an `onChange(name, value)` f.e, we might start to hard code some rules and verify them against
the provided input:

```js

onChange(name, value) {
  if (name === 'lastName') {
    if (hasCapitalLetter(lastName)) {
      // then do something
    }
  }  
  // etc...
}

```

This example might be exaggerated but you get the idea.
Revalidation takes care of running your predicate functions against defined field inputs, enabling to decouple the actual input from the predicates.


```javascript
const validationRules = {
  name: [
    [ isGreaterThan(5),
      `Minimum Name length of 6 is required.`
    ],
  ],
  random: [
    [ isGreaterThan(7), 'Minimum Random length of 8 is required.' ],
    [ hasCapitalLetter, 'Random should contain at least one uppercase letter.' ],
  ]
}
```
And imagine this is our input data.

```javascript
const inputData = { name: 'abcdef', random: 'z'}
```

We would like to have a result that displays any possible errors.

Calling validate `validate({inputData, validationRules)`
should return
```javascript
{name: true,
 random: [
    'Minimum Random length of 8 is required.',
    'Random should contain at least one uppercase letter.'
]}
```

Revalidate does exactly that, by defining an initial state and the validation rules it takes care of updating and validating
any React Form Component. Revalidate also doesn't know how your form is built or if it is even a form for that matter.
This also means, a form library can be built on top Revalidation, making it a sort of meta form library.


### Getting started

Install revalidation via npm or yarn.


```
npm install --save revalidation
```

### Example

We might have a stateless function component that receives a prop ___form___, which include the needed field values.

```javascript

import React, {Component} from 'react'

const Form = ({ form, onSubmit }) =>
  (
    <div className='form'>
      <div className='formGroup'>
        <label>Name</label>
        <input
          type='text'
          value={form.name}
        />
      </div>
      <div className='formGroup'>
        <label>Random</label>
        <input
          type='text'
          value={form.random}
        />
      </div>
      <button onClick={() => onSubmit(form)}>Submit</button>
    </div>
  )

```

Next we might have a defined set of rules that we need to validate for given input values.

```javascript
const validationRules = {
  name: [
    [isNotEmpty, 'Name should not be  empty.']
  ],
  random: [
    [isLengthGreaterThan(7), 'Minimum Random length of 8 is required.'],
    [hasCapitalLetter, 'Random should contain at least one uppercase letter.'],
  ]
}

```

Further more we know about the inital form state, which could be empty field values.

```javascript
const initialState = {password: '', random: ''}
```

Now that we have everything in place, we import Revalidation.

```js
import Revalidation from 'revalidation'
```
Revalidation only needs the Component and returns a Higher Order Component accepting the following props:

- __`initialState`__ *(Object)*

- __`rules`__ *(Object)*

- __`validateSingle`__ *(Boolean)*

- __`validateOnChange`__: *(Boolean|Function)*

- __`asyncErrors`__ *(Object)*

- __`updateForm`__ *(Object)*


```js

const enhancedForm = revalidation(Form)

// inside render f.e.

<EnhancedForm
  onSubmit={this.onSubmit} // pass any additional props down...
  initialState={initialState}
  rules={validationRules}
  validateSingle={true}
  validateOnChange={true}
  {/*
    alternatively pass in a function, i.e. enable validationOnChange after a submit.
    validateOnChange={(submitted) => submitted}
  */}
/>

```

This enables us to rewrite our Form component, which accepts a ___revalidation___ prop now.

```js

const createErrorMessage = (errorMsgs) =>
  isValid(errorMsgs) ? null : <div className='error'>{head(errorMsgs)}</div>

const getValue = e => e.target.value

const Form = ({ revalidation : {form, onChange, updateState, valid, errors = {}, onSubmit}, onSubmit: onSubmitCb }) =>
  (
  <div className='form'>
    <div className='formGroup'>
      <label>Name</label>
      <input
        type='text'
        className={isValid(errors.name) ? '' : 'error'}
        value={form.name}
        onChange={compose(onChange('name'), getValue)}
      />
      <div className='errorPlaceholder'>{ createErrorMessage(errors.name) }</div>
    </div>
    <div className='formGroup'>
      <label>Random</label>
      <input
        type='text'
        className={isValid(errors.random) ? '' : 'error'}
        value={form.random}
        onChange={compose(onChange('random'), getValue)}
      />
      <div className='errorPlaceholder'>{ createErrorMessage(errors.random) }</div>
    </div>
    <button onClick={() => onSubmit(onSubmitCb)}>Submit</button>
  </div>
  )

export default revalidation(Form)
```

revalidtion returns an object containing:
- __form__: form values
- __onChange__: a function expecting form name and value, additionally one can specify if the value and/or the validation should be updated and also accepts a callback function that will be run after an update has occurred. i.e.

```js
onChange('name', 'foo')
// or
onChange('name', 'foo', [UPDATE_FIELD])
// or
onChange('name', 'foo', null, ({valid, form}) => valid ? submitCb(form) : null )
```

- __updateState__: a function expecting all the form values, f.e. Useful when wanting to reset the form. Depending on the setting either a validation will occur or not.


```js
 <button onClick={() => updateState({ name: '', random: '' })}>Reset</button>
```

- __valid__: calculated validation state, f.e. initially disabling the submit button when a form is rendered.
- __submitted__: set to true once the form has been submitted.
- __errors__: the errors object containing an array for every form field.
- __onSubmit__: validates all fields at once, also accepts a callback function that will be called after the a validation state has been calculated. The callback function receives the current state including the valid state.

```js
<button
  onClick={() => onSubmit(({form, valid}) => valid ? submitCb(form) : console.log('something went wrong!'))}
>
  Submit
</button>
```

- __updateErrors__: Enables to update any errors.


- __updateAsyncErrors__: Enables to update any asynchronous errors. Useful when working with asynchronous validations.
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

- __settings__: access the current settings: `{ validateOnChange: true, validateSingle: true }`

Additionally revalidation offers a number of helper functions to quickly update any values or validations.

- __debounce__: a helper function for triggering asynchronous validations. The passed in asynchronous validation can be debounced by a specified time. i.e. 1000 ms.

```js
<input
  type="text"
  value={form.name}
  onChange={debounce.name(usernameExists, 1000)}
/>
```

- __updateValue__: update a specific field value. Important to note that no validation will run. Use _updateValueAndValidate_ if you need to update and validate of field. A name attribute must be defined on the element for _updateValue_ to update the value.

```js
  <input
    type='text'
    className={isValid(errors.random) ? '' : 'error'}
    name='random'
    value={form.random}
    onChange={updateValue}
  />
```

- __validateValue__: validates a specific field. Useful when validation should happen after an *onBlur* i.e.
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

- __updateValueAndValidate__: Updates and validates the value for the specified element.
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


Where and how to display the errors and when and how to validate is responsibility of the form not Revalidation.
Another aspect is that the form props can be updated when needed.

__NOTE:__ `updateForm` should be used carefully and only when needed. Make sure to reset or remove `updateForm` after
applying the new form values.


```javascript
<Form
  onSubmit={this.onSubmit}
  updateForm={{name: 'foobar', random: ''}}
/>
```

Either define an initial state or use form props to define an actual form state. Revalidation will check for props first
and then fallback to the initial state when none is found.

__Revalidation__ also enables to pass in asynchronous error messages via the `asyncErrors` prop. As side effects are run outside of Revalidation itself, any error messages (from a dynamic validation or after submitting to a server and receiving errors) can be passed back into Revalidation.

```js

// i.e. userNameExists is a function returning a promise and sends a request to validate if the username is available.

<EnhancedSubmitForm
  onSubmit={this.onSubmit}
  rules={validationRules}
  initialState={initialState}
  asyncErrors={{name: ['Not available.']}}
  userNameExists={this.usernameExists}
  validateSingle={true}
  validateOnChange={true}
/>

```

__NOTE:__ A sensible approach with asynchronous validation functions is useful, Revalidation will not run any effects against
an input field. Needed consideration include: when to run the side effects
(dynamically or on submit) and how often to trigger an async validation (immediately on every change or debounced)


More: Revalidation also works with deep nested data structure (see the deep nested data example)

check the [example](https://github.com/25th-floor/revalidation/tree/master/example) for more detailed insight into how to build more advanced forms, f.e. validating dependent fields.

Clone the repository go to the examples folder and run the following commands:

```js
yarn install
npm start.
```

### Demo
Check the live [demo](http://revalidation.oss.25th-floor.com/example/demo/)

### Further Information

For a deeper understanding of the underlying ideas and concepts:

[Form Validation As A Higher Order Component Pt.1](https://medium.com/javascript-inside/form-validation-as-a-higher-order-component-pt-1-83ac8fd6c1f0)

[Form Validation As A Higher Order Component Pt.2](https://medium.com/javascript-inside/form-validation-as-a-higher-order-component-pt-2-1edb7881870d)


### Credits
Written by [A.Sharif](https://twitter.com/sharifsbeat)

Original idea and support by [Stefan Oestreicher](https://twitter.com/thinkfunctional)

Very special thanks to [Alex Booker](https://twitter.com/bookercodes) for providing input on the API and creating use cases.

#### More
__Revalidation__ is under development.

The underlying synchronous validation is handled via [__Spected__](https://github.com/25th-floor/spected)

#### Documentation
[API](docs/API.md)

[FAQ](docs/FAQ.md)

### License

MIT
