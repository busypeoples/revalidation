/* @flow */
import curry from './curry'

function prop(key: string, obj: Object): any {
  return obj[key]
}

export default curry(prop)
