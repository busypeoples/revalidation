/* @flow */

/**
 * Partial application
 *
 * @param {Function} fn function to be partially applied
 * @param {Array} args The arguments to apply to the function
 * @returns {Function} the applied function
 * @example
 *
 *    const fakeFn = (a, b, c) => a + b + c
 *    partial(fakeFn, 1, 2, 3)
 *    partial(fakeFn, 1, 2)(3)
 *    partial(fakeFn)(1, 2, 3)
 *
 */
export default function partial(fn: Function, ...args: Array<any>) {
  if (fn.length <= args.length) {
    return fn.apply(this, args)
  }

  return function(...arg: Array<any>) {
    return fn.apply(this, args.concat(arg))
  };
}
