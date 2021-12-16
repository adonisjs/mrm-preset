/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const path = require('path')
const deepExtend = require('deep-extend')

module.exports = function (config, defaults) {
  try {
    const projectConfigFile = require(path.join(process.cwd(), 'config.json'))
    deepExtend(config, defaults, projectConfigFile || {})
  } catch {
    deepExtend(config, defaults, {})
  }
}
