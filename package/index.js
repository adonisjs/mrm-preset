/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { packageJson, install, file, json, uninstall } = require('mrm-core')
const mergeConfig = require('../utils/mergeConfig')
const buildJapaFile = require('../utils/buildJapaFile')

const dependencies = ['japa', 'japa-cli', 'cz-conventional-changelog', 'commitizen']
const tsDeps = ['ts-node', 'typescript', '@types/node', 'tslint', 'tslint-eslint-rules']
const jsDeps = ['standard']

function task (config) {
  mergeConfig(config)

  const values = config.defaults({ services: [] }).values()

  const hasCoveralls = values.services.indexOf('coveralls') > -1
  const appDeps = values.ts ? dependencies.concat(tsDeps) : dependencies.concat(jsDeps)

  if (hasCoveralls) {
    appDeps.push('coveralls')
    appDeps.push('nyc')
  }

  /**
   * Install all required dependencies
   */
  install(appDeps)

  /**
   * Remove redundant dependencies
   */
  uninstall(values.ts ? jsDeps : tsDeps)

  const pkgFile = packageJson()

  /**
   * Add required scripts
   */
  pkgFile.setScript('commit', 'git-cz')
  pkgFile.setScript('pretest', 'npm run lint')

  /**
   * Have different set of scripts when coveralls is used
   * as a service
   */
  if (hasCoveralls) {
    pkgFile.setScript('test', 'nyc japa')
    pkgFile.setScript('coverage', 'nyc report --reporter=text-lcov | coveralls')
    pkgFile.appendScript('posttest', 'npm run coverage')
    pkgFile.set('nyc.exclude', ['test/**'])
  } else {
    pkgFile.setScript('test', 'japa')
  }

  /**
   * Have a different set of scripts when project uses typescript
   */
  if (values.ts) {
    pkgFile.setScript('lint', 'tslint --project tsconfig.json')
    pkgFile.prependScript('build', 'npm run lint && tsc')
  } else {
    pkgFile.setScript('lint', 'standard')
  }

  /**
   * Set config for commitizen. It will show prompts
   * to build a proper commit message.
   */
  pkgFile.set('config.commitizen.path', 'cz-conventional-changelog')

  /**
   * Save package.json
   */
  pkgFile.save()

  /**
   * Create japaFile.js
   */
  const japaFile = file('japaFile.js')
  japaFile.save(buildJapaFile(japaFile.get(), values.ts))

  /**
   * Create tsconfig.json and tslint.json files
   */
  if (values.ts) {
    json('tsconfig.json').merge({ extends: './node_modules/@adonisjs/mrm-preset/_tsconfig' })
    json('tslint.json').merge({ extends: ['@adonisjs/mrm-preset/_tslint'], rules: {} })
  }
}

task.description = 'Adds package.json file'
module.exports = task
