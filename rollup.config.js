import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import commonjs from 'rollup-plugin-commonjs'
import flow from 'rollup-plugin-flow'

var env = process.env.NODE_ENV

var config = {
  entry: 'src/index.js',
  moduleName: 'ValidationHOC',
  exports: 'named',
  format: 'umd',
  sourceMap: env !== 'production',
  targets: (env == 'production') ?
  [
    { dest: 'dist/validation-hoc.min.js', format: 'umd' },
  ] :
  [
    { dest: 'dist/validation-hoc.js', format: 'umd' },
    { dest: 'dist/validation-hoc.es.js', format: 'es' },
  ],
  globals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  external: ['react', 'react-dom'],
  plugins: [
    flow(),
    commonjs(),
    nodeResolve({
      jsnext: true,
    }),
    babel({
      babelrc: false,
      presets: [["es2015", { "modules": false }]],
      plugins: [
        "external-helpers",
        'transform-object-rest-spread',
        'transform-flow-strip-types',
        'ramda',
        'transform-react-jsx',
      ],
      exclude: 'node_modules/**',
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
}

if (env === 'prod') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      }
    })
  )
}

export default config
