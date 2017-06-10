/* @flow */

export default function compose(...funcs: Array<any>): Function {
  return funcs.reduce(function(f,g) {
    return function(...args) {
      return f(g.apply(this, args));
    }
  })
}
