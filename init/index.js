/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const inquirer = require('inquirer')
const { json } = require('mrm-core')
const debug = require('debug')('adonis:mrm-init')

/**
 * Asking for project language
 *
 * @type {Object}
 */
const projectLang = {
  type: 'list',
  choices: ['Typescript', 'Javascript'],
  message: 'Select the language you want to code in',
  name: 'lang'
}

/**
 * Whether written by the core team or not
 *
 * @type {Object}
 */
const isCore = {
  type: 'confirm',
  message: 'Is it a package written by the core team',
  name: 'core'
}

/**
 * The project license
 *
 * @type {Object}
 */
const license = {
  type: 'list',
  choices: ['Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'MIT', 'Unlicense'],
  message: 'Select project license. Select Unlicense if not sure',
  name: 'license'
}

/**
 * Services to be used by the project
 *
 * @type {Object}
 */
const services = {
  type: 'checkbox',
  message: 'Select the CI services you are planning to use',
  choices: [
    {
      name: 'Travis',
      value: 'travis'
    },
    {
      name: 'Appveyor',
      value: 'appveyor'
    },
    {
      name: 'Coveralls',
      value: 'coveralls'
    }
  ],
  name: 'services'
}

/**
 * The appveyor username. Only asked when services
 * has `appveyor` in it
 *
 * @type {Object}
 */
const appveyorUsername = {
  type: 'input',
  message: 'Enter appveyor username',
  when: function (answers) {
    return answers.services.indexOf('appveyor') > -1
  },
  name: 'appveyorUsername'
}

/**
 * Running the task, asking questions and create a project
 * specific config file.
 *
 * @method task
 *
 * @return {void}
 */
async function task () {
  const answers = await inquirer.prompt([projectLang, isCore, license, services, appveyorUsername])

  const file = json('config.json')
  const fileContent = {
    core: answers.core,
    ts: answers.lang === 'Typescript',
    license: answers.license,
    services: answers.services,
    appveyorUsername: answers.appveyorUsername
  }

  debug('init %o', fileContent)

  file.set(fileContent)
  file.save()
}

task.description = 'Initiate the project config file'
module.exports = task
