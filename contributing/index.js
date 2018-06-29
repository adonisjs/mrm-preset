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
const debug = require('debug')('adonis:mrm-contributing')

const mergeConfig = require('../utils/mergeConfig')
const saveFile = require('../utils/saveFile')

/**
 * Creates CONTRIBUTING.md file. The `in template` is dependent
 * upon various config values. However, the `out template` is
 * always `CONTRIBUTING.md` file.
 *
 * @method task
 *
 * @param  {Object} config
 *
 * @return {void}
 */
function task (config) {
  mergeConfig(config)

  const values = config.defaults({ force: false }).values()

  /**
   * Choosing which template to use
   */
  let templateFile = 'CONTRIBUTING.md'
  if (values.core) {
    templateFile = 'CONTRIBUTING_CORE.md'
  } else if (values.ts) {
    templateFile = 'CONTRIBUTING_TS.md'
  }

  debug('template file %s', templateFile)

  const file = template('CONTRIBUTING.md', join(__dirname, 'templates', templateFile))
  file.apply()

  saveFile(file, values.force)
}

task.description = 'Adds CONTRIBUTING.md file'
module.exports = task
