/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { packageJson, install, template } = require('mrm-core')
const prTemplate = '.github/COMMIT_CONVENTION.md'
const { join } = require('path')

function task () {
  const pkgFile = packageJson()

  /**
   * Below are common scripts for both Typescript and Javascript
   * projects.
   */
  pkgFile.setScript('commit', 'git-cz')
  pkgFile.set('config.commitizen.path', 'cz-conventional-changelog')

  /**
   * Add git hook to validate commit message
   */
  pkgFile.set(
    'gitHooks.commit-msg',
    'node ./node_modules/@adonisjs/mrm-preset/validateCommit/conventional/validate.js'
  )

  /**
   * Save the package file
   */
  pkgFile.save()

  /**
   * Install required dependencies
   */
  install(['cz-conventional-changelog', 'commitizen', 'yorkie'])

  /**
   * Copy commit convention template
   */
  template(prTemplate, join(__dirname, 'conventional', 'template.md')).apply({}).save()
}

task.description = 'Enforces commit message convention'
module.exports = task
