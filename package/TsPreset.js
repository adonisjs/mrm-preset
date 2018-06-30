/*
* adonis-mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { json, install, uninstall, deleteFiles } = require('mrm-core')
const debug = require('debug')('adonis:mrm-package')

class TsPreset {
  constructor () {
    this.dependencies = [
      'ts-node',
      'typescript',
      '@types/node',
      'tslint',
      'tslint-eslint-rules',
      'del-cli'
    ]
  }

  /**
   * Installing dependencies for a Typescript project
   *
   * @method install
   *
   * @param  {Array} baseDependencies
   *
   * @return {void}
   */
  install (baseDependencies) {
    const dependencies = baseDependencies.concat(this.dependencies)

    debug('installing dependencies %o', dependencies)
    install(dependencies)
  }

  /**
   * Removing dependencies for a Typescript project
   *
   * @method uninstall
   *
   * @return {void}
   */
  uninstall () {
    debug('removing dependencies %o', this.dependencies)
    uninstall(this.dependencies)
  }

  /**
   * Mutating the package file for a typescript project
   *
   * @method up
   *
   * @param  {Object}  pkgFile
   *
   * @return {void}
   */
  up (pkgFile) {
    pkgFile.setScript('lint', 'tslint --project tsconfig.json')
    pkgFile.setScript('clean', 'del build')
    pkgFile.setScript('compile', 'npm run lint && npm run clean && tsc')
    pkgFile.setScript('build', 'npm run compile')
    pkgFile.setScript('prepublishOnly', 'npm run build')
    pkgFile.set('nyc.extension', ['.ts'])

    debug('creating files %o', ['tsconfig.json', 'tslint.json'])

    json('tsconfig.json').merge({ extends: './node_modules/@adonisjs/mrm-preset/_tsconfig' }).save()
    json('tslint.json').merge({ extends: ['@adonisjs/mrm-preset/_tslint'], rules: {} }).save()
  }

  /**
   * Reverting mutations done for a typescript project
   *
   * @method down
   *
   * @param  {Object}  pkgFile
   *
   * @return {void}
   */
  down (pkgFile) {
    debug('removing files/dirs %o', ['tsconfig.json', 'tslint.json', 'build'])
    deleteFiles(['tsconfig.json', 'tslint.json', 'build'])

    pkgFile.removeScript('lint')
    pkgFile.removeScript('clean')
    pkgFile.removeScript('compile')
    pkgFile.removeScript('build')
    pkgFile.removeScript('prepublishOnly')
    pkgFile.unset('nyc.extension', ['.ts'])
  }
}

module.exports = new TsPreset()
