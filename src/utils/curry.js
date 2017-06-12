/* @flow */

/**
 * Accepts a function and returns a curried function.
 *
 * @param {Function} fn function to be curried
 * @returns {Function} a curried function
 * @example
 *
 *    const fakeFn = (a, b, c) => a + b + c
 *    const curriedFakeFn = curry(fakeFn)
 *    curriedFakeFn((1, 2)(3) // 6
 */
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
