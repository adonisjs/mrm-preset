/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { json, install, packageJson, lines } = require('mrm-core')

function task () {
  /**
   * Add prettier file
   */
  const prettierRc = json('.prettierrc')
  prettierRc.set({
    trailingComma: 'es5',
    semi: false,
    singleQuote: true,
    useTabs: false,
    quoteProps: 'consistent',
    bracketSpacing: true,
    arrowParens: 'always',
    printWidth: 100
  })
  prettierRc.save()

  /**
   * Update package file
   */
  const pkgFile = packageJson()
  pkgFile.setScript('format', 'prettier --write .')
  pkgFile.save()

  /**
   * Add .prettierignore file
   */
  const prettierIgnore = lines('.prettierignore')
  prettierIgnore.add('build')
  prettierIgnore.add('docs')
  prettierIgnore.add('*.md')
  prettierIgnore.add('config.json')
  prettierIgnore.add('.eslintrc.json')
  prettierIgnore.add('package.json')
  prettierIgnore.add('*.html')
  prettierIgnore.add('*.txt')
  prettierIgnore.save()

  /**
   * Update eslintrc.json file to use prettier
   */
  const eslintRc = json('.eslintrc.json')

  /**
   * Update if file exists, otherwise ignore
   */
  if (eslintRc.exists()) {
    eslintRc.merge({ extends: ['prettier'] })
    eslintRc.merge({ plugins: ['prettier'] })
    eslintRc.set('rules.prettier/prettier', ['error', { endOfLine: 'auto' }])
    eslintRc.save()
  }

  const plugins = ['prettier']

  /**
   * Only install when using eslint
   */
  if (eslintRc.exists()) {
    plugins.push('eslint-plugin-prettier')
    plugins.push('eslint-config-prettier')
  }

  /**
   * Install required dependencies
   */
  install(plugins)
}

task.description = 'Adds prettier to the project'
module.exports = task
