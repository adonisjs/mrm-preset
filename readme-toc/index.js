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
  let preCommit = pkgFile.get('husky.hooks.pre-commit')
  if (preCommit) {
    preCommit = `${preCommit} && doctoc README.md --title='## Table of contents' && git add README.md`
  } else {
    preCommit = `doctoc README.md --title='## Table of contents' && git add README.md`
  }
  pkgFile.set('husky.hooks.pre-commit', preCommit)

  /**
   * Save the package file
   */
  pkgFile.save()

  /**
   * Install required dependencies
   */
  install(['doctoc', 'husky'])
}

task.description = 'Generate TOC for readme.md file'
module.exports = task
