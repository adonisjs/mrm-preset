/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { json, uninstall, install, packageJson, lines } = require('mrm-core')

function task (config) {
  /**
   * Add eslintrc file
   */
  const eslintRc = json('.eslintrc.json')
  eslintRc.set({ extends: ['plugin:adonis/typescriptPackage'] })
  eslintRc.save()

  /**
   * Update package file
   */
  const pkgFile = packageJson()
  pkgFile.setScript('lint', 'eslint .')
  pkgFile.save()

  /**
   * Add .eslintignore file
   */
  const eslintIgnore = lines('.eslintignore')
  eslintIgnore.add('build')
  eslintIgnore.save()

  /**
   * Install required dependencies
   */
  install(['eslint', 'eslint-plugin-adonis'])

  // Remove tslint
  const tsLint = json('tslint.json')
  tsLint.delete()

  /**
   * Remove tslint related dependencies
   */
  uninstall(['tslint-eslint-rules', 'tslint'])
}

task.description = 'Adds eslint to the project and remove tslint'
module.exports = task
