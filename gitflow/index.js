/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { packageJson } = require('mrm-core')

function task () {
  const pkgFile = packageJson()

  /**
   * Add git hook to re-generate the TOC
   */
  pkgFile.setScript('release:start', 'start(){ git flow release start $1; };start')
  pkgFile.setScript('release:end', 'end(){ git checkout master && git merge --no-ff --no-verify release/$1 && git tag -a $1 && git checkout develop && git merge --no-ff --no-verify release/$1 && git branch -d release/$1; };end')

  /**
   * Save the package file
   */
  pkgFile.save()
}

task.description = 'Adds hooks for git flow'
module.exports = task
