# Revalidation

### Higher Order Component for Forms in React


__Revalidation__ lets you write your forms as __stateless function components__, taking care of managing the local form state
as well as the validation. Revalidation also works with classes and will support other __React__ like libraries __Preact__ or __Inferno__
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

__Revalidation__ takes care of running your predicate functions against defined field inputs, by separating the validation from the input.
For example we would like to define a number of validation rules for two inputs, _name_ and _random_.

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
const inputData = { name 'abcdef', random: 'z'}
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

```javascript```
const initialState = {password: '', random: ''}
```

Now that we have everything in place, we import Revalidation.
```javascript
import Revalidation from 'revalidation'
```

Revalidation needs the initial state, the validation rules, an error component and an options object as well as the Form component itself.
The error component is simply telling Revalidation how to render the error messages.
For example we only want to display one error at a time.

```javascript
const ErrorComponent = ({errorMsgs}) => <div className='error'>{head(errorMsgs)}</div>
```

Revalidate will only render the error component when a field is invalid and the ___errorMsg___ prop is always an array. So in this
case we want to access and render the first error message.

The options object currently only has one option: ___validateSingle___. This is useful if we only want to validate one field
at a time.
```javascript 
const option1 = {validateSingle: false} // validate all fields as soon as the first field changes f.e.
const option2 = {validateSingle: true} // validate per changed values. 
```

Finally we enhance the Form component.
```javascript
const enhanced = Revalidation(
  initialState,
  validationRules,
  ErrorComponent,
  {validateSingle: false}
)

export default enhanced(Form)
```

This enables us to rewrite our Form component, which accepts a ___reValidation___ prop now.
```javascript

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
```

reValidtion returns an object containing:
- __form__: form values
- __validate__: validation function expecting form name and value, f.e. `validate('name', 'foo')` 
- __valid__: caclulated validation state, f.e. initially disabling the submit button when a form is rendered.
- __errors__: the errors object either containing nothing or a error component for every defined form field.
- __validateAll__: validate all fields at once, also accepts a callback function that will be called incase of a valid state.

Where and how to display the errors and when and how to validate is responsibilty of the form not Revalidation.
Another aspect is that the form props can als be provided when rendering the enhanced Form component.
```javascript
<Form
    onSubmit={this.onSubmit}
    form={{name: 'foobar', random: ''}}
/>
```

Either define an initial state or use form props to define an actual form state. Revalidation will check for props first
and then fallback to the initial state when none is found.

Also check the [example](https://github.com/25th-floor/revalidation/tree/master/example) for more detailed insight into how to build more advanced forms, f.e. validating dependent fields.

Clone the repository go to the examples folder and run the following commands:
```js
yarn install
npm start.
```

### Further Information

For a deeper understanding of the underlying ideas and concepts:

[Form Validation As A Higher Order Component Pt.1](https://medium.com/javascript-inside/form-validation-as-a-higher-order-component-pt-1-83ac8fd6c1f0)

[Form Validation As A Higher Order Component Pt.2](https://medium.com/javascript-inside/form-validation-as-a-higher-order-component-pt-2-1edb7881870d)


### Credits
Written by [A.Sharif](https://twitter.com/sharifsbeat)

Original idea and support by [Stefan Oestreicher](https://twitter.com/thinkfunctional)

#### More
__Revalidation__ is under development. The underlying validation library will be extracted into a standalone package in the near 
future.

#### Documentation
[API](docs/API.md)

### License

MIT

