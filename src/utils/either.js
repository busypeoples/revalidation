/* @flow */

// minimal Either implementation

function Either() {}

function Left (a: any) {
  this.value = a
}

function Right(a: any) {
  this.value = a
}

Either.Left = function(a: any) {
  return new Left(a)
}

Either.Right = function(a:any) {
  return new Right(a)
}

Either.fromNullable = function(a: any) {
  return a ? new Right(a) : new Left( a)
}

Either.of = function(a: any) {
  return new Right(a)
}

Either.prototype = {
  Left: Either.Left,
  Right: Either.Right,
  fromNullable: Either.fromNullable,
  of: Either.of,
}

Left.prototype = Object.assign({}, Either.prototype, {
  ap: function(o: Object) {
    return this
  },
  map: function(f: Function) {
    return this
  },
  isLeft: true,
  isRight: false,
  fold: function(f: Function, g: Function) {
    return f(this.value)
  },
  cata: function(p: Object) {
    return p.Left(this.value)
  },
  concat: function(o) {
    return this
  },
})

Right.prototype = Object.assign({}, Either.prototype, {
  ap: function(o: Object) {
    return o.map(this.value)
  },
  map: function(f: Function) {
    return this.of(f(this.value))
  },
  isLeft: false,
  isRight: true,
  fold: function(f: Function, g: Function): any {
    return g(this.value)
  },
  cata: function(p: Object) {
    return p.Right(this.value)
  },
  concat: function(o) {
    const that = this
    return o.fold(
      function(a) {
        return o
      },
      function(a) {
        return that.Right(that.value.concat(a))
      }
    )
  },
})

export default Either
