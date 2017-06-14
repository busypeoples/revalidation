# FAQ

#### How can I disable the submit button when initially rendering the form with empty values?
Revalidation provides a computed `valid` property when passing in the __reValidation__ prop. 
Even when the form itself contains no errors yet, `valid` has the actual validation result.
```js
const Form = ({ reValidation : {form, validate, valid, errors = {}, validateAll}, onSubmit }) =>
  (
    <div className='form'>
       {/* ...form fields */} 
      <button 
        {...{disabled? !valid} }
        onClick={() => validateAll(onSubmit)}
      >
        Submit
      </button>
    </div>
  )
```

### How can I prevent Revalidate from validating all the fields as soon as I edit the first field?
Via the options object set the `validateSingle` option to true.
```js
const enhanced = Revalidation(
  initialState,
  validationRules,
  ErrorComponent,
  {validateSingle: true}
)
```

### How can I validate all fields at once?
Revalidation provides a `validateAll` function via the __reValidation__ prop.

```js
const Form = ({ reValidation : {form, validate, valid, errors = {}, validateAll}, onSubmit }) =>
  (
    <div className='form'>
       {/* ...form fields */} 
      <button onClick={() => validateAll()}>
        Submit
      </button>
    </div>
  )
```

### How can I instantly validate the form as soon as props have been updated?
Revalidation provides a `validateAll` function via the __reValidation__ prop. 
`validateAll` accepts a callback function as well as any data as arguments. 
If the validation is successful Revalidation will call the callback with either the provided data or the current form values.
```js
const Form = ({ reValidation : {form, validate, valid, errors = {}, validateAll}, onSubmit }) =>
  (
    <div className='form'>
       {/* ...form fields */} 
      <button 
        {...{disabled? !valid} }
        onClick={() => validateAll(onSubmit)}
      >
        Submit
      </button>
    </div>
  )
```

### How can I define a callback as soon as a validation is successful?
Via the options object set the `instantValidation` option to true.
```js
const enhanced = Revalidation(
  initialState,
  validationRules,
  ErrorComponent,
  {validateSingle: false, instantValidation: true}
)
```

#### Why do I have to manually tell Revalidation when it should update any values?
Revalidation doesn't know anything about the form structure or how it is designed. 
It only reacts to changes via passed in props or via `validate` and `validateAll` function calls.
Revalidation only manages and validates the actual form state and provides the data to design your form accordingly.

```js
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
    </div>
  )
```

#### Can I use React Classes instead Functions as Form Components?
Yes, Revalidation also works with classes, there is no difference, although the use case is handling local state management and validation for stateless functional components.
