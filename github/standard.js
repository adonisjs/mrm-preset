/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { template, deleteFiles } = require('mrm-core')
const { join } = require('path')
const debug = require('debug')('adonis:mrm-github')

class StandardTemplate {
  constructor () {
    this.issues = '.github/ISSUE_TEMPLATE.md'
  }

  up () {
    debug('using template: %s', this.issues)
    template(this.issues, join(__dirname, 'templates', 'issues.md')).apply().save()
  }

  down () {
    debug('removing template: %s', this.issues)
    deleteFiles(this.issues)
  }
}

module.exports = new StandardTemplate()
