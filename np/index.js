/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { install, packageJson, file } = require('mrm-core')
const mergeConfig = require('../utils/mergeConfig')

function task (config) {
  mergeConfig(config)
  const values = config.defaults({ services: [] }).values()

  /**
   * Install required dev-dependencies
   */
  install(['np'])

  const pkgFile = packageJson()

  /**
   * Set npm config
   */
  pkgFile.set('np', {
    contents: values.ts ? 'build' : '.',
    anyBranch: false,
  })

  /**
   * Set release script
   */
  pkgFile.setScript('release', 'np')

  /**
   * Save the package file
   */
  pkgFile.save()
}

task.description = 'Adds np to do release management'
module.exports = task
