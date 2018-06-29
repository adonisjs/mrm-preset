/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { yaml, deleteFiles } = require('mrm-core')
const mergeConfig = require('../utils/mergeConfig')

function task (config) {
  mergeConfig(config)

  const values = config.defaults({
    services: [],
    minNodeVersion: '8.0.0'
  }).values()

  const appveyor = values.services.indexOf('appveyor') > -1
  if (!appveyor) {
    deleteFiles(['appveyor.yml'])
    return
  }

  const appveyorFile = yaml('appveyor.yml')
    .set('environment.matrix', [{ 'nodejs_version': 'Stable' }, { 'nodejs_version': values.minNodeVersion }])
    .set('init', 'git config --global core.autocrlf true')
    .set('install', [{ ps: 'Install-Product node $env:nodejs_version' }, 'npm install'])
    .set('test_script', ['node --version', 'npm --version', 'npm run test:win'])
    .set('build', 'off')
    .set('clone_depth', 1)
    .set('matrix.fast_finish', true)

  appveyorFile.save()
}

task.description = 'Adds appveyor.yml file'
module.exports = task
