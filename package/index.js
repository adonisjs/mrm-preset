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

const mergeConfig = require('../utils/mergeConfig')
const buildJapaFile = require('../utils/buildJapaFile')
const JsPreset = require('./JsPreset')
const TsPreset = require('./TsPreset')
const CoverallsPreset = require('./CoverallsPreset')

const baseDependencies = ['japa', 'pkg-ok']

function task (config) {
  mergeConfig(config)

  /**
   * Create package.json file, if missing
   */
  const initialPkgFile = packageJson()
  if (!initialPkgFile.exists()) {
    execSync('npm init --yes')
  }

  const values = config.defaults({ services: [] }).values()
  const hasCoveralls = values.services.indexOf('coveralls') > -1

  /**
   * Installing required dependencies and removing
   * unwanted dependencies
   */
  if (values.ts) {
    JsPreset.uninstall()
    TsPreset.install(baseDependencies)
  } else {
    TsPreset.uninstall()
    JsPreset.install(baseDependencies)
  }

  /**
   * Install coveralls dependencies if required
   */
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
  pkgFile.setScript('mrm', 'mrm --preset=@adonisjs/mrm-preset')
  pkgFile.setScript('test', hasCoveralls ? 'nyc node japaFile.js' : 'node japaFile.js')
  pkgFile.setScript('pretest', 'npm run lint')
  pkgFile.appendScript('prepublishOnly', 'pkg-ok')
  pkgFile.set('nyc.exclude', ['test'])
  pkgFile.set('license', values.license)

  /**
   * Adding Typescript or Javascript related
   * scripts
   */
  if (values.ts) {
    JsPreset.down(pkgFile, hasCoveralls)
    TsPreset.up(pkgFile, hasCoveralls)
  } else {
    TsPreset.down(pkgFile, hasCoveralls)
    JsPreset.up(pkgFile, hasCoveralls)
  }

  /**
   * Adding coveralls related scripts
   */
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
