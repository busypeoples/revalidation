/* @flow */

export default function partial(fn: Function, ...args: Array<any>) {
  if (fn.length <= args.length) {
    return fn.apply(this, args)
  }

  return function(...arg: Array<any>) {
    return fn.apply(this, args.concat(arg))
  };
}
