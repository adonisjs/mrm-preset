/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { json, uninstall, install } = require('mrm-core')

function task (config) {
  const eslintRc = json('.eslintrc.json')
  eslintRc.set({
    extends: ['plugin:adonis/typescriptPackage']
  })
  eslintRc.save()
  install(['eslint'])

  // Remove tslint
  const tsLint = json('tslint.json')
  tsLint.delete()
  uninstall(['tslint-eslint-rules', 'tslint'])
}

task.description = 'Adds eslint to the project and remove tslint'
module.exports = task
