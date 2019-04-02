/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { packageJson, install } = require('mrm-core')

function task () {
  const pkgFile = packageJson()

  /**
   * Add git hook to re-generate the TOC
   */
  pkgFile.set(
    'gitHooks.pre-commit',
    `doctoc README.md --title='## Table of contents' && git add README.md`
  )

  /**
   * Save the package file
   */
  pkgFile.save()

  /**
   * Install required dependencies
   */
  install(['doctoc'])
}

task.description = 'Generate TOC for readme.md file'
module.exports = task
