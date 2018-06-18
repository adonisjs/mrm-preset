/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { packageJson, install, file } = require('mrm-core')
const mergeConfig = require('../utils/mergeConfig')
const buildJapaFile = require('../utils/buildJapaFile')

const dependencies = ['japa', 'japa-cli']
const tsDeps = ['ts-node', 'typescript', '@types/node', 'tslint', 'tslint-eslint-rules']
const jsDeps = ['standard']

function task (config) {
  mergeConfig(config)

  const values = config.defaults({ services: [] }).values()

  const hasCoveralls = values.services.indexOf('coveralls') > -1
  const appDeps = values.ts ? dependencies.concat(tsDeps) : dependencies.concat(jsDeps)

  if (hasCoveralls) {
    appDeps.push('coveralls').push('nyc')
  }

  /**
   * Install all required dependencies
   */
  install(appDeps)

  const pkgFile = packageJson()

  /**
   * Add required scripts
   */
  pkgFile.setScript('test', hasCoveralls ? 'nyc japa' : 'japa')
  pkgFile.setScript('lint', 'tslint --project tsconfig.json')
  pkgFile.prependScript('build', 'npm run lint && tsc')

  /**
   * Save package.json
   */
  pkgFile.save()

  /**
   * Create japaFile.js
   */
  const japaFile = file('japaFile.js')
  japaFile.save(buildJapaFile(japaFile.get(), values.ts))
}

task.description = 'Adds package.json file'
module.exports = task
