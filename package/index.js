/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { packageJson, file } = require('mrm-core')
const { execSync } = require('child_process')

const TsPreset = require('./TsPreset')
const mergeConfig = require('../utils/mergeConfig')
const buildJapaFile = require('../utils/buildJapaFile')

const baseDependencies = ['japa']

function task (config) {
  mergeConfig(config, { services: [], license: 'UNLICENSED' })

  /**
   * Create package.json file, if missing
   */
  const initialPkgFile = packageJson()
  if (!initialPkgFile.exists()) {
    execSync('npm init --yes')
  }

  TsPreset.install(baseDependencies)

  const pkgFile = packageJson()

  /**
   * Below are common scripts for both Typescript and Javascript
   * projects.
   */
  pkgFile.setScript('mrm', 'mrm --preset=@adonisjs/mrm-preset')
  pkgFile.setScript('test', 'node .bin/test.js')
  pkgFile.setScript('pretest', 'npm run lint')
  pkgFile.set('license', config.license)

  TsPreset.up(pkgFile)

  /**
   * Save the package file
   */
  pkgFile.save()

  /**
   * Remove old japafile
   */
  file('japaFile.js').delete()

  /**
   * Create japaFile.js
   */
  const japaFile = file('.bin/test.js')
  japaFile.save(buildJapaFile(japaFile.get(), config.ts))
}

task.description = 'Adds package.json file and configures/installs dependencies'
module.exports = task
