/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const createLicense = require('mrm-task-license')
const mergeConfig = require('../utils/mergeConfig')
const gitUserName = require('git-user-name')

function task (config) {
  mergeConfig(config)
  config.defaults({ licenseFile: 'LICENSE.md', name: gitUserName() })
  createLicense(config)
}

task.description = 'Adds LICENSE.md file'
module.exports = task
