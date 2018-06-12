/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { template } = require('mrm-core')
const { join } = require('path')

function task (config) {
  let templateFile = 'CONTRIBUTING.md'

  if (config.core) {
    templateFile = 'CONTRIBUTING_CORE.md'
  } else if (config.ts) {
    templateFile = 'CONTRIBUTING_TS.md'
  }

  const file = template('CONTRIBUTING.md', join(__dirname, 'templates', templateFile))

  const { github, packageName, force } = config
    .defaults({ force: false })
    .values()

  if (file.exists() && !force) {
    return
  }

  file.apply({ github, packageName }).save()
}

task.description = 'Adds CONTRIBUTING.md file'
module.exports = task
