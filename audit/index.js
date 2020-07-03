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
   * Add git hook to generate npm audit report
   */
  let preCommit = pkgFile.get('husky.hooks.pre-commit')
  if (preCommit) {
    preCommit = `${preCommit} && npm audit --production --json | ./node_modules/.bin/npm-audit-html`
  } else {
    preCommit = 'npm audit --production --json | ./node_modules/.bin/npm-audit-html'
  }
  pkgFile.set('husky.hooks.pre-commit', preCommit)

  /**
   * Save the package file
   */
  pkgFile.save()

  /**
   * Install required dependencies
   */
  install(['npm-audit-html'])
}

task.description = 'Runs "npm audit --production" and saves the audit report inside npm-audit.html file'
module.exports = task
