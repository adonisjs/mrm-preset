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
  const prettierRc = json('.prettierrc.json')
  prettierRc.set({
    trailingComma: 'es5',
    tabWidth: 2,
    semi: false,
    singleQuote: true,
    useTabs: false,
    bracketSpacing: true,
    arrowParens: 'always',
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
  prettierIgnore.save()

  /**
   * Update eslintrc.json file to use prettier
   */
  const eslintRc = json('.eslintrc.json')

  /**
   * Update if file exists, otherwise ignore
   */
  if (eslintRc.exists()) {
    eslintRc.merge({ extends: ['prettier', 'prettier/@typescript-eslint'] })
    eslintRc.merge({ plugins: ['prettier'] })
    eslintRc.set('rules.prettier/prettier', ['error'])
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