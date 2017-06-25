# Revalidation

### Higher Order Component for Forms in React


__Revalidation__ lets you write your forms as __stateless function components__, taking care of managing the local form state
as well as the validation. Revalidation also works with classes and will support other React-like libraries like __Preact__ or __Inferno__
in the future.


### Getting started

Install revalidation via npm or yarn.


```
npm install --save revalidation
```

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
`instantValidation`, while the first enables to define if the predicates functions are against all fields or only that one updated,
the latter enables to turn dynamic validation on and off all together. This is it. Everything is up to the form implementer.

__Revalidation__ enhances the wrapped Component by passing a `reValidation` prop containing a number of properties and functions
to manage the state. There are no automatic field updates, validations or onsubmit actions, Revalidation doesn't how 
the form is implemented or how it should handlde user interactions.

Let's see an example to get a better idea on how this could work. 
For example we would like to define a number of validation rules for two inputs, _name_ and _random_.
More often that not, inside an `updateValue(name, value)` f.e, we might start to hard code some rules and verify them against 
the provided input:

```js

updateValue(name, value) {
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
any React Form Component.

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

- __`singleValue`__ *(Function)*

- __`instantValidation`__: *(Function)*

- __`asyncRules`__ *(Object)*

- __`updateForm`__ *(Object)*


```js

const enhancedForm = revalidation(Form)

// inside render f.e.

<EnhancedForm
  onSubmit={this.onSubmit} // pass any additional props down...
  initialState={initialState}
  rules={validationRules}
  validateSingle={true}
  instantValidation={true}
/>

```

This enables us to rewrite our Form component, which accepts a ___reValidation___ prop now.

```js

const getValue = e => e.target.value

const displayErrors = (errorMsgs) => 
  isValid(errorMsgs) ? null : <div className='error'>{head(errorMsgs)}</div>

const getValue = e => e.target.value

const Form = ({ reValidation : {form, updateValue, updateState, valid, errors = {}, validateAll}, onSubmit }) =>
  (
    <div className='form'>
      <div className='formGroup'>
        <label>Name</label>
        <input
          type='text'
          value={form.name}
          onChange={e => validate('name', getValue(e))}
        />
        { displayErrors(errors.name) }
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
```

reValidtion returns an object containing:
- __form__: form values
- __updateValue__: a function expecting form name and value, f.e. `updateValue('name', 'foo')` 
- __updateState__: a function expecting all the form values, f.e. Useful when wanting to reset the form. Depending on the setting either a validation will occur or not. 

    
    ```js
     <button onClick={() => updateState({ name: '', random: '' })}>Reset</button>
    ```

- __valid__: calculated validation state, f.e. initially disabling the submit button when a form is rendered.
- __errors__: the errors object containing an array for every form field.
- __validateAll__: validates all fields at once, also accepts a callback function that will be called in case of a valid state.

Where and how to display the errors and when and how to validate is responsibilty of the form not Revalidation.
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

__Revalidation__ also enables to define asynchronous predicate functions via the `asyncRules` prop. Any predicates containing 
side effects have to be declared explicitly via the prop.
 
```js

// isUnusedUserName is function returning a promise and sends a request to validate if the username is available f.e.

const asyncRules = {name: [[isUnusedUserName, 'Username is not available']]}
 
<EnhancedSubmitForm
  onSubmit={this.onSubmit}
  rules={validationRules}
  initialState={initialState}
  asyncRules={asyncRules}
  userNameExists={this.usernameExists}
  validateSingle={true}
  instantValidation={true}
/>

```

__NOTE:__ A sensible approach with asynchronous validation functions is useful, Revalidation will not run any effects against 
an input field if any synchronous predicates have failed already. Needed consideration include: when to run the side effects
(dynamically or on submit) and how often to trigger an async validation (immediately on every change or debounced) 


Also check the [example](https://github.com/25th-floor/revalidation/tree/master/example) for more detailed insight into how to build more advanced forms, f.e. validating dependent fields.

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

