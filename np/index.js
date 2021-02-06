/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { install, packageJson, ini } = require('mrm-core')

function task () {
  /**
   * Install required dev-dependencies
   */
  install(['np'])

  const pkgFile = packageJson()

  /**
   * Set npm config
   */
  pkgFile.set('np', {
    contents: '.',
    anyBranch: false
  })

  /**
   * Set release script
   */
  pkgFile.setScript('release', 'np')
  pkgFile.setScript('version', 'npm run build')

  /**
   * Save the package file
   */
  pkgFile.save()

  /**
   * Create npmrc file to define commit format
   */
  const npmrc = ini('.npmrc')
  npmrc.set('_global', { message: '"chore(release): %s"' })
  npmrc.save({ withSpaces: false })
}

task.description = 'Adds np to do release management'
module.exports = task
