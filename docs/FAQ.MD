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

#### How can I prevent Revalidation from validating all the fields as soon as I edit the first field?
Via the options object set the `validateSingle` option to true.
```js
const enhanced = Revalidation(
  initialState,
  validationRules,
  ErrorComponent,
  {validateSingle: true}
)
```

#### How can I only validate updated form elements without validating any untouched elements?
Via the options object set the `validateSingle` option to true.

```js
const enhanced = Revalidation(
  initialState,
  validationRules,
  ErrorComponent,
  {validateSingle: true}
)
```

#### How can I validate all fields at once?
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

#### How can I define a callback as soon as a validation is successful?
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

#### How can I instantly validate the form as soon as props have been updated?
Via the options object set the `instantValidation` option to true.
```js
const enhanced = Revalidation(
  initialState,
  validationRules,
  ErrorComponent,
  {validateSingle: false, instantValidation: true}
)
```

#### How can I trigger a success callback as soon as a field has been updated and is valid?
Currently you have to call the `validate` and `validateAll` functions separately, f.e. via onChange.
Taking this approach might have a performance impact on your application. 
This scenario should be solved in an upcoming release.

```js
 <input
    type='text'
    className={errors.random ? 'error' : ''}
    value={form.random}
    onChange={e => {
        validate('random', getValue(e)
        validateAll(onSubmit)
    }}
/>
```

#### Can I define how the error is displayed for every field individually?
Define how the errors should be transformed inside the error callback. 
All error messages per field are passed into the callback function as an array.

```js
// errorCallback = ({errorMsgs}) => errorMsgs
{name: null, random: ['something is missing', 'invalid data']}
```

Now you can do a manual error check per field basis and render the error message accordingly.
```js
const Form = ({ reValidation : {form, validate, valid, errors = {}, validateAll}, onSubmit }) =>
  (
    <div className='form'>
      <div className='formGroup'>
        {/* some field */}
        { errors.name ? <div>{errors.name.map((msg, i) => <span className='error' key={i}>{msg}</span>)} }
      </div>
    </div>
  )
```


#### How can I pass the current form values to a callback function even when the state is not valid?
Define a callback function and pass in the current form state provided via the __reValidation__ `form` property.

```js
const Form = ({ reValidation : {form, validate, valid, errors = {}, validateAll}, ownCallback }) =>
  (
    <div className='form'>
      <div className='formGroup'>
        <label>Name</label>
        <input
          type='text'
          value={form.name}
          onChange={e => ownCallback(form)}
        />
        { errors.name }
      </div>
    </div>
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
