/* @flow */
import curry from './curry'
import reduce from './reduce'

function merge(fn: Function, left: Object, right: Object): Object {

  const initial = reduce((o, v, k) => {
    o[k] = right.hasOwnProperty(k) ? fn(k, v, right[k]) : v
    return o
  }, {}, left)

  return reduce((o, v, k) => {
    if (!o.hasOwnProperty(k)) {
      o[k] = v
    }
    return o
  }, initial, right)
}

export default curry(merge)