/*
* adonis-mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { install, uninstall } = require('mrm-core')
const debug = require('debug')('adonis:mrm-package')

class JsPreset {
  constructor () {
    this.dependencies = [ 'standard' ]
    this.coverallDependencies = [
      'coveralls',
      'nyc'
    ]
  }

  /**
   * Installing depedencies for a Javascript project
   *
   * @method install
   *
   * @param  {Array}   baseDependencies
   *
   * @return {void}
   */
  install (baseDependencies) {
    const dependencies = baseDependencies.concat(this.dependencies)
    debug('installing dependencies %o', dependencies)
    install(dependencies)
  }

  /**
   * Removing dependencies for a Javascript project
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
   * Mutating the pkgfile for a Javascript project
   *
   * @method up
   *
   * @param  {Object} pkgFile
   *
   * @return {void}
   */
  up (pkgFile) {
    pkgFile.setScript('lint', 'standard')
    if (!pkgFile.get('main')) {
      pkgFile.set('main', 'index.js')
    }

    if (!pkgFile.get('files')) {
      pkgFile.set('files', [
        'index.js',
        'src',
      ])
    }
  }

  /**
   * Removing previous Javascript project mutations from the
   * package.json file.
   *
   * @method down
   *
   * @param  {Object} pkgFile
   *
   * @return {void}
   */
  down (pkgFile) {
    pkgFile.removeScript('lint')
    pkgFile.unset('main')
    pkgFile.unset('files')
  }
}

module.exports = new JsPreset()
