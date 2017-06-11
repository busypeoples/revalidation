/* @flow */
import curry from './curry'
import reduce from './reduce'

function set(prop, val, obj) {
  const cloned = reduce((o, v, k) => {
    o[k] = v
    return o
  }, Array.isArray(obj) ? [] : {}, obj)
  cloned[prop] = val
  return cloned
}

function update(path: Array<string|number>|number|string, val: any, obj: Object) {
  if (typeof path === 'string' || typeof path === 'number') {
    return set(path, val, obj)
  }
  if (!Array.isArray(path) || path.length < 1) {
    return obj
  }

  const [idx, ...rest] = path
  if (path.length > 1) {
    const next = (obj && obj.hasOwnProperty(idx)) ? obj[idx] : (typeof idx === 'number') ? [] : {}
    val = update(...rest, val, next)
  }

  return set(idx, val, obj)

}

export default curry(update)