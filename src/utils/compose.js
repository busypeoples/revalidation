/* @flow */

/**
 * Composes Functions from right to left.
 * The right most argument can accept multiple arguments
 * all other functions must be unary.
 *
 * @param {...Function} funcs functions to be composed
 * @returns {Function}
 * @example
 *
 *     const multiply = (a) => a * a
 *     const add = (a, b) => a + b
 *     const composedFn = compose(multiply, add)
 *     composedFn(2, 3) // 25
 */
export default function compose(...funcs: Array<any>): Function {
  return funcs.reduce(function(f,g) {
    return function(...args) {
      return f(g.apply(this, args));
    }
  })
}
