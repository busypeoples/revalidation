/* @flow */

export default function curry(fn: Function) {
  const len = fn.length

  function curryFn(prev: Array<any>) {
    return function (...args: Array<any>) {
      const argument = prev.concat(args)
      return (argument.length < len) ? curryFn(argument) : fn.apply(this, argument)
    }
  }

  return curryFn([])
}
