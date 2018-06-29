/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { packageJson, file } = require('mrm-core')

const mergeConfig = require('../utils/mergeConfig')
const buildJapaFile = require('../utils/buildJapaFile')
const JsPreset = require('./JsPreset')
const TsPreset = require('./TsPreset')
const CoverallsPreset = require('./CoverallsPreset')

const baseDependencies = ['japa', 'japa-cli', 'cz-conventional-changelog', 'commitizen']

function task (config) {
  mergeConfig(config)

  const values = config.defaults({ services: [] }).values()
  const hasCoveralls = values.services.indexOf('coveralls') > -1

  if (values.ts) {
    JsPreset.uninstall()
    TsPreset.install(baseDependencies)
  } else {
    TsPreset.uninstall()
    JsPreset.install(baseDependencies)
  }

  if (hasCoveralls) {
    CoverallsPreset.install()
  } else {
    CoverallsPreset.uninstall()
  }

  const pkgFile = packageJson()

  /**
   * Below are common scripts for both Typescript and Javascript
   * projects.
   */
  pkgFile.setScript('test', hasCoveralls ? 'nyc japa' : 'japa')
  pkgFile.setScript('commit', 'git-cz')
  pkgFile.setScript('pretest', 'npm run lint')
  pkgFile.set('config.commitizen.path', 'cz-conventional-changelog')

  if (values.ts) {
    JsPreset.down(pkgFile, hasCoveralls)
    TsPreset.up(pkgFile, hasCoveralls)
  } else {
    TsPreset.down(pkgFile, hasCoveralls)
    JsPreset.up(pkgFile, hasCoveralls)
  }

  if (hasCoveralls) {
    CoverallsPreset.up(pkgFile)
  } else {
    CoverallsPreset.down(pkgFile)
  }

  /**
   * Save the package file
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
