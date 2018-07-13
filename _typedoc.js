const deepExtend = require('deep-extend')

const defaultConfig = {
  out: 'docs',
  tsconfig: 'tsconfig.json',
  exclude: [
    '**/test/*.ts'
  ],
  excludeExternals: true,
  excludeNotExported: true,
  theme: 'default'
}

module.exports = function (base) {
  return deepExtend(defaultConfig, base || {})
}
