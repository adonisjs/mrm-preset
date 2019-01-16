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

class CoverallsPreset {
  constructor () {
    this.dependencies = [
      'coveralls',
      'nyc'
    ]
  }

  /**
   * Install coveralls related dependencies
   *
   * @method install
   *
   * @return {void}
   */
  install () {
    debug('installing %o', this.dependencies)
    install(this.dependencies)
  }

  /**
   * Remove converalls dependencies
   *
   * @method uninstall
   *
   * @return {void}
   */
  uninstall () {
    debug('removing %o', this.dependencies)
    uninstall(this.dependencies)
  }

  /**
   * Make mutations to the pkgFile
   *
   * @method up
   *
   * @param  {Object} pkgFile
   *
   * @return {void}
   */
  up (pkgFile) {
    pkgFile.setScript('coverage', 'nyc report --reporter=text-lcov | coveralls')
  }

  /**
   * Revert package file mutations
   *
   * @method down
   *
   * @param  {Object} pkgFile
   *
   * @return {void}
   */
  down (pkgFile) {
    pkgFile.removeScript('coverage')
  }
}

module.exports = new CoverallsPreset()
