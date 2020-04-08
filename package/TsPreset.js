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
    pkgFile.setScript('clean', 'del build')
    pkgFile.setScript('compile', 'npm run lint && npm run clean && tsc')
    pkgFile.setScript('build', 'npm run compile')
    pkgFile.setScript('prepublishOnly', 'npm run build')
    pkgFile.set('nyc.extension', ['.ts'])

    /**
     * Set files to publish along with the main file
     */
    pkgFile.set('main', 'build/index.js')
    pkgFile.set('files', [
      'build/src',
      'build/index.d.ts',
      'build/index.js',
    ])

    debug('creating files %o', ['tsconfig.json'])

    json('tsconfig.json').merge({ extends: './node_modules/@adonisjs/mrm-preset/_tsconfig' }).save()
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
    debug('removing files/dirs %o', ['tsconfig.json', 'build'])
    deleteFiles(['tsconfig.json', 'build'])

    pkgFile.removeScript('lint')
    pkgFile.removeScript('clean')
    pkgFile.removeScript('compile')
    pkgFile.removeScript('build')
    pkgFile.removeScript('prepublishOnly')
    pkgFile.unset('nyc.extension', ['.ts'])
    pkgFile.unset('main')
    pkgFile.unset('files')
  }
}

module.exports = new TsPreset()
