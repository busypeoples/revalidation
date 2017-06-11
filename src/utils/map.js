import reduce from './reduce'
import curry from './curry'

function map(fn: Function, functor: Array<any> | Object)  {
  if (typeof functor.map === 'function') {
    return functor.map(fn)
  }

  if (typeof functor === 'object') {
    return reduce((total, prop, key) => {
      total[key] = fn(prop)
      return total
    },
    Array.isArray(functor) ? [] : {},
    functor
  )}

  return functor
}

export default curry(map)
