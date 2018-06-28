/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { lines } = require('mrm-core')

/**
 * Creates `.gitignore` file
 *
 * @return {void}
 */
function task () {
  const file = lines('.gitignore')

  file.add([
    'node_modules',
    'coverage',
    '.DS_STORE',
    '.nyc_output',
    '.idea',
    '.vscode/',
    '*.sublime-project',
    '*.sublime-workspace',
    '*.log',
    'yarn.lock',
    'build'
  ])

  file.save()
}

task.description = 'Adds Gitignore file'
module.exports = task
